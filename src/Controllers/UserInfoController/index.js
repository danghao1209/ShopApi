import User from "../../Models/UserModel/index.js";

export const userInfo = async (req, res, next) => {
  try {
    let { _id } = req.dataUser;
    const resultFind = await User.findOne({ _id });
    if (resultFind) {
      const { name, email } = resultFind;
      return res.status(200).json({ status: 1, data: { name, email } });
    } else {
      return res
        .status(401)
        .json({ status: 0, message: "Không tìm thấy user" });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const ordersInfo = async (req, res, next) => {
  try {
    let { _id } = req.dataUser;
    const resultFind = await User.findOne({ _id });
    if (resultFind) {
      const { ordersId } = resultFind;
      //thiếu lấy ra được các id rồi thì phải kiếm ra từng sản phẩm của order
      return res.status(200).json({ status: 1, data: { ordersId } });
    } else {
      throw new Error("Không tìm thấy đơn hàng");
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const addressInfo = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;
    const {} = req.body;
    const resultFind = await User.findOne({ _id });
    if (resultFind) {
      const { phone, address } = resultFind;
      return res.status(200).json({ status: 1, data: { phone, address } });
    } else {
      return res.status(401).json({ status: 0, message: "No data find" });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
