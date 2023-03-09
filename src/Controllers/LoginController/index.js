import User from "../../Models/UserModel/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { username, password, ...other } = req.body;
    console.log(req.body);
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      res
        .status(401)
        .json({ status: "0", message: "Sai tên đăng nhập hoặc mật khẩu" });
    } else {
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        res
          .status(401)
          .json({ status: "0", message: "Sai tên đăng nhập hoặc mật khẩu" });
      } else {
        const payload = { username, password };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res
          .status(200)
          .json({ status: 1, message: "Đăng nhập thành công", token: token });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ status: 1, message: "Đăng nhập thất bại" });
  }
};
