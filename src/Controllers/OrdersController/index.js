import _ from "lodash";
import mongoose from "mongoose";
import Queue from "queue";
import { redisClient } from "../../Models/Redis/index.js";

import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";
import Orders from "../../Models/OrdersModel/index.js";
import Product from "../../Models/ProductModel/index.js";

const ordersQueue = new Queue();
ordersQueue.autostart = true;
ordersQueue.concurrency = 1;
async function performTask(userId, ordersId, cartId, carts, data) {
  try {
    console.log("Đang thực hiện tác vụ");

    const listIdProductInCart = carts.map((item) => item.id);

    const listPrice = await Product.find({ _id: { $in: listIdProductInCart } });

    if (listPrice?.length === 0) {
      throw new Error("Giỏ hàng trống");
    }

    const totalPrice = _.sumBy(carts, (cartItem) => {
      const product = _.find(listPrice, {
        _id: mongoose.Types.ObjectId(cartItem.id),
      });
      if (product) {
        const discountedPrice = Math.round(
          product.price * (1 - product.discountPercentage / 100)
        );
        return discountedPrice * cartItem.quantity;
      }
      return 0;
    });

    if (totalPrice === 0) {
      throw new Error("Lỗi mua hàng, vui lòng thử lại");
    }

    const updatedCartItems = _.map(carts, (cartItem) => {
      const matchedProduct = _.find(listPrice, {
        _id: new mongoose.Types.ObjectId(cartItem.id),
      });
      if (matchedProduct) {
        const plainCartItem = cartItem.toObject();
        const result = {
          ...plainCartItem,
          discountPercentage: matchedProduct.discountPercentage,
          price: matchedProduct.price,
          image: matchedProduct.data[cartItem.color]?.images[0] || "",
        };
        return result;
      }
      return null;
    });

    if (!updatedCartItems) {
      throw new Error("Lỗi mua hàng, vui lòng thử lại");
    }

    const updatedProduct = _.map(carts, (cartItem) => {
      const matchedProduct = _.find(listPrice, {
        _id: new mongoose.Types.ObjectId(cartItem.id),
      });
      if (matchedProduct) {
        if (
          matchedProduct.data[cartItem.color] &&
          matchedProduct.data[cartItem.color].size &&
          matchedProduct.data[cartItem.color].size[cartItem.size]
        ) {
          matchedProduct.data[cartItem.color].size[cartItem.size] -=
            cartItem.quantity;
        }

        return matchedProduct;
      }
      return null;
    });

    if (!updatedProduct) {
      throw new Error("Lỗi mua hàng, vui lòng thử lại");
    }

    const freeShip = totalPrice > 700;
    const lastPrice = freeShip ? totalPrice : totalPrice + 30;

    const { phone, name, address, tinh, huyen, xa, note } = data;
    const newOrders = new Orders({
      dataOrder: updatedCartItems,
      totalPrice: totalPrice,
      lastPrice: lastPrice,
      phone: phone,
      name: name,
      detailedAddress: { address, tinh, huyen, xa },
      freeship: freeShip,
      note: note,
      status: "Chờ xác nhận",
    });

    const updateCart = await Cart.findOneAndUpdate(
      { _id: cartId },
      { carts: [], totalQuanlity: 0 },
      { new: true }
    );

    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { ordersId: [...ordersId, newOrders.id] },
      { new: true }
    );

    await Promise.all([
      newOrders.save(),
      updateCart.save(),
      updateUser.save(),
      ...updatedProduct.map((product) => product.save()),
      listPrice.save(),
    ]);

    console.log(`Mua thành công id đơn: ${newOrders.id}!`);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

async function addToQueue(userId, ordersId, cartId, carts, data) {
  await new Promise((resolve, reject) => {
    ordersQueue.push(async (callback) => {
      try {
        await performTask(userId, ordersId, cartId, carts, data);
        resolve();
      } catch (error) {
        reject(error);
      }
      callback(); // Gọi callback() sau khi tác vụ hoàn thành
    });
  });
}

export const orderPayment = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;
    const { idCart, data } = req.body;
    const { cartId, ordersId } = await User.findOne({ _id });
    if (idCart !== cartId) {
      throw new Error("Không trùng id giỏ hàng");
    }
    const { carts } = await Cart.findOne({ _id: cartId });
    await addToQueue(_id, ordersId, cartId, carts, data);
    await redisClient.deleteKey("allproducts");
    res.status(200).json({
      status: 1,
      message: "Mua hàng thành công",
      data: carts,
      total: carts.reduce((total, cur) => total + cur.price, 0),
      lastPrice: carts.reduce(
        (total, cur) => total + cur.price - cur.price * cur.discountPercentage,
        0
      ),
      orderStatus: "Chờ xác nhận",
    });
  } catch (error) {
    console.log(error.message);
    error.message = "Mua hàng thất bại";
    next(error);
  }
};
