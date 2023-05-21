import shortid from "shortid";
import bcrypt from "bcryptjs";
import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";
import Orders from "../../Models/OrdersModel/index.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, phone, ...pre } = req.body;
    const isHaveUserEmail = await User.findOne({ email });
    const isHaveUserPhone = await User.findOne({ phone });

    const newOrders = new Orders({
      id: shortid.generate(),
      orders: [],
      total: 0,
    });
    const newCart = new Cart({
      id: shortid.generate(),
      carts: [],
      total: 0,
    });
    if (!!name) {
      if (!isHaveUserEmail && !isHaveUserPhone) {
        const newUser = new User({
          id: shortid.generate(),
          name: name,
          password: password,
          phone: phone,
          email: email,
          cart: newCart.id,
          order: newOrders.id,
        });
        const promises = [newUser.save(), newOrders.save(), newCart.save()];

        Promise.all(promises)
          .then(([user, order, cart]) => {
            res.status(200).json({
              status: 1,
              message: "Đăng kí thành công",
              data: {
                name: user.name,
                email: user.email,
                phone: user.phone,
              },
            });
          })
          .catch((error) => {
            // Xử lý lỗi
            res.status(401).json({ status: 0, message: "Đăng kí thất bại" });
          });
      } else {
        res
          .status(401)
          .json({ status: 0, message: "Đã tồn tại email hoặc số điện thoại" });
      }
    } else {
      res
        .status(401)
        .json({ status: 0, message: "Chưa điền đầy đủ thông tin" });
    }
  } catch (error) {
    res.status(401).json({ status: 0, message: "Đăng kí thất bại" });
  }
};
