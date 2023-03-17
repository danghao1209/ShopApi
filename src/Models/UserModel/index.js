import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

var User = mongoose.model("User", userSchema, "users");

export default User;
