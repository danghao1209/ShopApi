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
    const data = await User.findOne({ id: req.dataUser.id });
    if (data.refreshToken === token) {
      next();
    } else {
      throw new Error("Không khớp trong db");
    }
  } catch (err) {
    res.status(403).send({ message: err.message });
  }
}
