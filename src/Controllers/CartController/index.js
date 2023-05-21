import Cart from "../../Models/CartModel/index.js";

export const addCart = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 1, message: "Đăng nhập thất bại" });
  }
};

export const deleteCart = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 1, message: "Đăng nhập thất bại" });
  }
};
export const increaseCart = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 1, message: "Đăng nhập thất bại" });
  }
};
