import validator from "validator";

export const ValidateEmail = (req, res, next) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      res
        .status(401)
        .json({ status: 0, message: "Không đúng định dạng email" });
    } else {
      next();
    }

    // Nếu email hợp lệ, chuyển tiếp request đến middleware tiếp theo
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 0, message: "Fail" });
  }
};
