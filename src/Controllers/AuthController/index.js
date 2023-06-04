import User from "../../Models/UserModel/index.js";

export const accessTokenNew = async (req, res) => {
  try {
    const { id } = req.dataUser;

    const payload = {
      id: id,
    };

    const tokenACCESS = jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      status: 1,
      message: "Get token access",
      userId: id,
      tokenACCESS: tokenACCESS,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: "0", message: "Get token error" });
  }
};

export const deleteToken = async (req, res) => {
  try {
    const { id } = req.dataUser;

    await User.findOneAndUpdate(
      { id: id },
      { refreshToken: null },
      { new: false }
    ).exec();

    return res.status(200).json({
      status: 1,
      message: "Delete success",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: "0", message: "Delete error" });
  }
};
