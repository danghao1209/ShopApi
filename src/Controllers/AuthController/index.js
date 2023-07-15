import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";
import Otp from "../../Models/OtpModel/index.js";
import { redisClient } from "../../Models/Redis/index.js";

export const accessTokenNew = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;

    const payload = {
      _id: _id,
    };

    const tokenACCESS = jwt.sign(payload, process.env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      status: 1,
      message: "Lấy token thành công",
      userId: _id,
      tokenACCESS: tokenACCESS,
    });
  } catch (error) {
    console.log(error.message);
    error.message = "Lấy token thất bại";
    next(error);
  }
};

export const deleteToken = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;

    await User.findOneAndUpdate(
      { _id: _id },
      { refreshToken: null },
      { new: false }
    ).exec();

    return res.status(200).json({
      status: 1,
      message: "Xoá token thành công",
    });
  } catch (error) {
    console.log(error.message);
    error.message = "Xoá token thất bại";
    next(error);
  }
};
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error("Không có user");
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "0", message: "Sai tên đăng nhập hoặc mật khẩu" });
    } else {
      const payload = {
        _id: user._id,
      };
      const expiresIn = 365 * 24 * 60 * 60 * 1000;

      const tokenREFRESH = jwt.sign(
        payload,
        process.env.JWT_SECRET_REFRESH_TOKEN,
        { expiresIn: expiresIn }
      );

      const tokenACCESS = jwt.sign(
        payload,
        process.env.JWT_SECRET_ACCESS_TOKEN,
        { expiresIn: "1h" }
      );

      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { refreshToken: tokenREFRESH },
        { new: true }
      ).exec();

      return res.status(200).json({
        status: 1,
        message: "Đăng nhập thành công",
        userId: user._id,
        tokenREFRESH: updatedUser.refreshToken,
        tokenACCESS: tokenACCESS,
      });
    }
  } catch (error) {
    console.log(error.message);
    error.message = "Sai tên đăng nhập hoặc mật khẩu";
    next(error);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;
    const isHaveUserEmail = await User.findOne({ email });
    const isHaveUserPhone = await User.findOne({ phone });

    if (!!name) {
      if (!isHaveUserEmail && !isHaveUserPhone) {
        const newCart = new Cart({
          carts: [],
          totalQuanlity: 0,
        });

        const newUser = new User({
          name: name,
          password: password,
          phone: phone,
          email: email.toLowerCase(),
          address: {},
          cartId: newCart._id,
          ordersId: [],
          refreshToken: "",
        });

        await Promise.all([newUser.save(), newCart.save()]);

        res.status(200).json({
          status: 1,
          message: "Đăng kí thành công",
          data: {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
          },
        });
      } else {
        throw new Error("Đã tồn tại email hoặc số điện thoại");
      }
    } else {
      throw new Error("Chưa điền đầy đủ thông tin");
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

//export const changePassword = async (req, res, next) => {
//   try {
//     const { _id } = req.dataUser;
//     const { email, password } = req.body;
//     const user = await User.findOne({ _id });
//     if (!user) {
//       throw new Error("Không thấy user");
//     }
//   } catch (error) {}
// };
export const changePassword = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;
    const { oldPass, password } = req.body;

    if (oldPass === password) {
      throw new Error("Mật khẩu mới và cũ không được trùng nhau");
    }
    const user = await User.findOne({ _id });
    if (!user) {
      throw new Error("Lỗi không thấy user");
    }
    const isMatch = bcrypt.compareSync(oldPass, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu cũ không chính xác");
    }
    user.password = password;
    await user.save();
    return res
      .status(200)
      .json({ status: 1, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// send otp email

// const saveOtpToDatabase = async (email, otp) => {
//   const existingOtp = await Otp.findOne({ email });
//   if (existingOtp) {
//     // OTP đã tồn tại cho email này, ghi đè OTP mới lên email cũ
//     existingOtp.otp = otp;
//     existingOtp.expiredAt = new Date(Date.now() + 5 * 60 * 1000); // Cập nhật thời gian hết hạn mới
//     await existingOtp.save();
//   } else {
//     // OTP chưa tồn tại cho email này, tạo mới OTP và lưu vào cơ sở dữ liệu
//     const newOtp = new Otp({ email, otp });
//     await newOtp.save();
//   }
// };

const saveOtpToRedis = async (email, otp) => {
  const existingOtp = await redisClient.get(
    JSON.stringify(email).toLowerCase()
  );
  console.log(existingOtp);
  if (existingOtp) {
    // OTP đã tồn tại cho email này, ghi đè OTP mới lên email cũ
    const oldOTP = JSON.parse(existingOtp);
    if (oldOTP?.count > 5) {
      throw new Error(
        `Bạn đã gửi OTP quá nhiều lần vui lòng thử lại sau 5 phút`
      );
    }
    const newOTP = {
      otp: otp,
      count: oldOTP.count + 1,
    };
    await redisClient.setWithTime(
      JSON.stringify(email).toLowerCase(),
      JSON.stringify(newOTP),
      300000
    );
  } else {
    // OTP chưa tồn tại cho email này, tạo mới OTP và lưu vào cơ sở dữ liệu
    const newOTP = {
      otp: otp,
      count: 1,
    };
    await redisClient.setWithTime(
      JSON.stringify(email).toLowerCase(),
      JSON.stringify(newOTP),
      300000
    );
  }
};

const generateOTP = () => {
  const min = 1000; // Giá trị nhỏ nhất của mã OTP (1000)
  const max = 9999; // Giá trị lớn nhất của mã OTP (9999)
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
};
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("Không có email");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email không tồn tại người dùng vui lòng đăng ký");
    }
    const OTP = generateOTP();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const mailConfigs = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "DAHASHOP PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8">
        <title>DahaShop - OTP Email Template</title>
      </head>
      <body>
      <!-- partial:index.partial.html -->
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="dahashop.vn" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">DahaShop</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Thank you for choosing DahaShop. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
          <h2 style="background: #ccc;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
          <p style="font-size:0.9em;">DangHao,<br />DahaShop</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>DahaShop</p>
            <p>68 Trieu Khuc</p>
            <p>Hanoi</p>
          </div>
        </div>
      </div>
      <!-- partial -->
        
      </body>
      </html>`,
    };

    await transporter.sendMail(mailConfigs);
    await saveOtpToRedis(email, OTP);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

//confirm otp
const isOtpValidForEmail = async (email, otp) => {
  try {
    if (!otp || !email) {
      return false;
    }
    const existingOtp = await redisClient.get(
      JSON.stringify(email).toLowerCase()
    );

    if (!existingOtp) {
      console.log("không có trùng");
      return false; // Mã OTP không tồn tại trong cơ sở dữ liệu
    }

    const otpRedis = JSON.parse(existingOtp);

    if (otp !== otpRedis?.otp) {
      console.log("không khớp");
      return false;
    }

    return true; // Mã OTP hợp lệ
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOtp = async (email) => {
  await redisClient.deleteKey(JSON.stringify(email).toLowerCase());
};

export const submitOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const isOtpValid = await isOtpValidForEmail(email, otp);
    if (!isOtpValid) {
      throw new Error(`OTP không đúng vui lòng thử lại`);
    }
    await deleteOtp(JSON.stringify(email).toLowerCase());
    const tokenValidateOtp = jwt.sign(
      { email },
      process.env.JWT_SECRET_OTP_TOKEN,
      {
        expiresIn: "5m",
      }
    );
    res.status(200).json({ token: tokenValidateOtp });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const submitPassword = async (req, res, next) => {
  try {
    const _id = req.dataUser;
    const user = await User.findOne({ _id });
    if (!user) {
      throw new Error("Không có user");
    }
    const { password } = req.body;
    user.password = password;
    user.refreshToken = "";
    await user.save();
    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
