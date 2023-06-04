import shortid from "shortid";
import Queue from "queue";

import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";
import Orders from "../../Models/OrdersModel/index.js";
import Product from "../../Models/ProductModel/index.js";

const ordersQueue = new Queue({ concurrency: 1, autostart: true });

async function performTask(userId, ordersId, cartId, carts) {
  try {
    console.log("Đang thực hiện tác vụ");

    let listIdProductInCart = carts.map((item) => item.id);

    let listPrice = await Product.find({ id: { $in: listIdProductInCart } });

    let totalPrice = listPrice.reduce((total, cur) => total + cur, 0);

    const newOrders = new Orders({
      id: shortid.generate(),
      orders: carts,
      totalPrice: totalPrice,
      status: "Chờ xác nhận",
    });

    const updateCart = Cart.findOneAndUpdate(
      { id: cartId },
      { carts: [], total: 0 },
      { new: true }
    );
    const updateUser = User.findOneAndUpdate(
      { id: userId },
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
      callback();
    });
  });
}

export const orderPayment = async (req, res) => {
  try {
    const { id } = req.dataUser;
    const { cartId, ordersId } = await User.findOne({ id });
    const { carts } = await Cart.findOne({ id: cartId });

    await addToQueue(id, ordersId, cartId, carts);

    res.status(200).json({
      status: 1,
      message: "Mua hàng thành công",
      data: carts,
      total: carts.reduce((total, cur) => total + cur.price, 0),
      orderStatus: "Chờ xác nhận",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      status: 0,
      message: "Mua hàng thất bại",
    });
  }
};

ordersQueue.on("end", () => {
  if (ordersQueue.length > 0) {
    ordersQueue.start();
  }
});
