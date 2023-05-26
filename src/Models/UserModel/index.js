import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, default: "" },
    cart: { type: String, required: true, unique: true },
    order: { type: String, required: true, unique: true },
    refreshToken: { type: String, unique: true, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
  bcrypt.hash(this.password, salt, (err, hashedPassword) => {
    if (err) return next(err);
    this.password = hashedPassword;
    next();
  });
});

const User = mongoose.model("User", userSchema, "users");

export default User;
