import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    carts: [
      {
        id: { type: String, required: true },
        quantity: { type: Number, required: true, default: 0, min: 1 },
        color: { type: String, required: true },
        size: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    total: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

var Cart = mongoose.model("Carts", cartSchema, "carts");

export default Cart;
