import jwt from "jsonwebtoken";
import User from "../../Models/UserModel/index.js";

export function verifyAccessToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);
    req.dataUser = decoded;
    next();
  } catch (err) {
    res.status(403).send({ message: "Invalid token" });
  }
}

export async function verifyRefreshToken(req, res, next) {
  const token = req.headers["refresh-token"];

  if (!token) {
    return res.status(401).send({ message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN);
    req.dataUser = decoded;
    const data = await User.findOne({ _id: req.dataUser?._id });
    if (data.refreshToken === token) {
      next();
    } else {
      throw new Error("Không khớp trong db");
    }
  } catch (err) {
    res.status(403).send({ message: err.message });
  }
}

export async function verifyOTPToken(req, res, next) {
  const token = req.headers["otp-token"]; // Sử dụng "otp-token" thay vì "OTP-token"
  if (!token) {
    throw new Error("Token not provided");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_OTP_TOKEN);

    const user = await User.findOne({ email: decoded.email }); // Truy vấn theo trường "email" của đối tượng "decoded"
    if (!user) {
      throw new Error("User not found in database"); // Sửa thông báo lỗi
    }
    req.dataUser = user._id; // Lưu ID người dùng vào req.dataUser
    next();
  } catch (err) {
    res.status(403).send({ message: err.message });
  }
}
