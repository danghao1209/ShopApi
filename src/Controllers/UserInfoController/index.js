import User from "../../Models/UserModel/index.js";

export const userInfo = async (req, res) => {
  try {
    let { email, password } = req.dataUser;
    const resultFind = await User.findOne({ email });
    console.log(resultFind);
    if (resultFind) {
      const { id, name, email, phone, address, cart, ...pre } = resultFind;
      return res
        .status(200)
        .json({ status: 1, data: { id, name, email, phone, address, cart } });
    } else {
      return res.status(401).json({ status: 0, message: "No data find" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 0, message: "Error" });
  }
};
