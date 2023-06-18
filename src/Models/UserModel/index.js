import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: Object, default: {} },
    cartId: { type: String, required: true, unique: true },
    ordersId: [{ type: String, required: true }],
    refreshToken: { type: String, unique: true, sparse: true },
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
