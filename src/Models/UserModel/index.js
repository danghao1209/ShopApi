import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "public\\imgs\\no-image.png" },
    phone: { type: String, unique: true },
    address: { type: String },
  },
  { timestamps: true }
);

var User = mongoose.model("User", userSchema, "users");

export default User;
