import shortid from "shortid";
import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, phone, ...pre } = req.body;
    const isHaveUserEmail = await User.findOne({ email });
    const isHaveUserPhone = await User.findOne({ phone });

    if (!!name) {
      if (!isHaveUserEmail && !isHaveUserPhone) {
        const newCart = new Cart({
          id: shortid.generate(),
          carts: [],
          total: 0,
        });

        const newUser = new User({
          id: shortid.generate(),
          name: name,
          password: password,
          phone: phone,
          email: email,
          cart: newCart.id,
        });

        await Promise.all([newUser.save(), newCart.save()]);

        res.status(200).json({
          status: 1,
          message: "Đăng kí thành công",
          data: {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
          },
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
