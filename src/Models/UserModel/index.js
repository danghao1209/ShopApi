import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, default: "" },
    cart: { type: String, default: "" },
  },
  { timestamps: true }
);

var User = mongoose.model("User", userSchema, "users");

export default User;
