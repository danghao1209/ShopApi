import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.dataUser = decoded;
    next();
  } catch (err) {
    res.status(403).send({ message: "Invalid token" });
  }
}
