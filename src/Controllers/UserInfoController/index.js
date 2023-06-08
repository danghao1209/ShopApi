import User from "../../Models/UserModel/index.js";

export const userInfo = async (req, res) => {
  try {
    let { id } = req.dataUser;
    const resultFind = await User.findOne({ id });
    if (resultFind) {
      const { name, email } = resultFind;
      return res.status(200).json({ status: 1, data: { name, email } });
    } else {
      return res.status(401).json({ status: 0, message: "No data find" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 0, message: "Error" });
  }
};

export const ordersInfo = async (req, res) => {
  try {
    let { id } = req.dataUser;
    const resultFind = await User.findOne({ id });
    if (resultFind) {
      const { ordersId } = resultFind;
      return res.status(200).json({ status: 1, data: { ordersId } });
    } else {
      return res.status(401).json({ status: 0, message: "No data find" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 0, message: "Error" });
  }
};

export const addressInfo = async (req, res) => {
  try {
    let { id } = req.dataUser;
    const resultFind = await User.findOne({ id });
    if (resultFind) {
      const { phone, address } = resultFind;
      return res.status(200).json({ status: 1, data: { phone, address } });
    } else {
      return res.status(401).json({ status: 0, message: "No data find" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 0, message: "Error" });
  }
};
