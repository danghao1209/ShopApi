import User from "../../Models/UserModel/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password, ...other } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: "0", message: "Sai tên đăng nhập hoặc mật khẩu" });
    } else {
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ status: "0", message: "Sai tên đăng nhập hoặc mật khẩu" });
      } else {
        const payload = { email, password };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return res
          .status(200)
          .json({ status: 1, message: "Đăng nhập thành công", token: token });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 1, message: "Đăng nhập thất bại" });
  }
};
