import shortid from "shortid";
import bcrypt from "bcryptjs";
import User from "../../Models/UserModel/index.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, phone, ...pre } = req.body;
    const isHaveUserEmail = await User.findOne({ email });
    const isHaveUserPhone = await User.findOne({ phone });
    if (!isHaveUserEmail && !isHaveUserPhone) {
      if (!!password) {
        if (password.length >= 6) {
          const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
          const hashedPassword = bcrypt.hashSync(req.body.password, salt);

          const newUser = new User({
            id: shortid.generate(),
            name: name,
            password: hashedPassword,
            phone: phone,
            email: email,
          });
          const saveUser = await newUser.save();
          if (saveUser) {
            return res
              .status(200)
              .json({ status: 1, message: "Đăng kí thành công" });
          } else {
            return res
              .status(401)
              .json({ status: 0, message: "Đăng kí thất bại" });
          }
        } else {
          return res
            .status(401)
            .json({ status: 0, message: "Password phải từ 6 kí tự" });
        }
      } else {
        return res
          .status(401)
          .json({ status: 0, message: "Password phải từ 6 kí tự" });
      }
    } else {
      return res
        .status(401)
        .json({ status: 0, message: "Đã tồn tại email hoặc số điện thoại" });
    }
  } catch (error) {
    return res.status(401).json(error.message);
  }
};
