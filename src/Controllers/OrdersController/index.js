import Queue from "queue";

import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";
import Orders from "../../Models/OrdersModel/index.js";
import Product from "../../Models/ProductModel/index.js";

const ordersQueue = new Queue();
ordersQueue.autostart = true;
ordersQueue.concurrency = 1;
async function performTask(userId, ordersId, cartId, carts) {
  try {
    console.log("Đang thực hiện tác vụ");

    let listIdProductInCart = carts.map((item) => item._id);

    let listPrice = await Product.find({ _id: { $in: listIdProductInCart } });

    if (listPrice?.length === 0) {
      throw new Error("Giỏ hàng trống");
    }

    let totalPrice = listPrice.reduce((total, cur) => total + cur.price, 0);

    let lastPrice = listPrice.reduce(
      (total, cur) => total + cur.price - cur.price * cur.discountPercentage,
      0
    );

    const newOrders = new Orders({
      orders: carts,
      totalPrice: totalPrice,
      lastPrice: lastPrice,
      status: "Chờ xác nhận",
    });

    const updateCart = await Cart.findOneAndUpdate(
      { _id: cartId },
      { carts: [], total: 0 },
      { new: true }
    );
    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { ordersId: [...ordersId, newOrders.id], total: 0 },
      { new: true }
    );

    await Promise.all([newOrders.save(), updateCart.exec(), updateUser.exec()]);

    console.log(`Mua thành công id đơn: ${newOrders.id}!`);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

async function addToQueue(userId, ordersId, cartId, carts) {
  await new Promise((resolve, reject) => {
    ordersQueue.push(async (callback) => {
      try {
        await performTask(userId, ordersId, cartId, carts);
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
    const { cartId, ordersId } = await User.findOne({ _id });
    const { carts } = await Cart.findOne({ _id: cartId });

    await addToQueue(_id, ordersId, cartId, carts);

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
