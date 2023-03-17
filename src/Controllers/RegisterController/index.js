import shortid from "shortid";
import bcrypt from "bcryptjs";
import User from "../../Models/UserModel/index.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, ...pre } = req.body;
    const isHaveUser = await User.findOne({ email });

    if (!isHaveUser) {
      if (password) {
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
          id: shortid.generate(),
          name: name,
          password: hashedPassword,
          email: email,
        });
        const saveUser = await newUser.save();
        if (saveUser) {
          return res
            .status(200)
            .json({ status: 1, message: "Đăng kí thành công" });
        } else {
          return res
            .status(401)
            .json({ status: 0, message: "Đăng kí thất bại" });
        }
      } else {
        return res
          .status(401)
          .json({ status: 0, message: "Password phải từ 6 kí tự" });
      }
    } else {
      return res.status(401).json({ status: 0, message: "Đã tồn tại" });
    }
  } catch (error) {
    return res.status(401).json(error.message);
  }
};
