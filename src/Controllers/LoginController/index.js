import User from "../../Models/UserModel/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password, ...other } = req.body;
    const user = await User.findOne({ email });
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "0", message: "Sai tên đăng nhập hoặc mật khẩu" });
    } else {
      const payload = {
        id: user.id,
      };
      const expiresIn = 365 * 24 * 60 * 60 * 1000;

      const tokenREFRESH = jwt.sign(
        payload,
        process.env.JWT_SECRET_REFRESH_TOKEN,
        { expiresIn: expiresIn }
      );

      const tokenACCESS = jwt.sign(
        payload,
        process.env.JWT_SECRET_ACCESS_TOKEN,
        { expiresIn: "1h" }
      );

      const updatedUser = await User.findOneAndUpdate(
        { id: user.id },
        { refreshToken: tokenREFRESH },
        { new: true }
      ).exec();

      return res.status(200).json({
        status: 1,
        message: "Đăng nhập thành công",
        userId: user.id,
        tokenREFRESH: updatedUser.refreshToken,
        tokenACCESS: tokenACCESS,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(401)
      .json({ status: "0", message: "Sai tên đăng nhập hoặc mật khẩu" });
  }
};
