import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    carts: [
      {
        id: { type: String, required: true },
        quantity: { type: Number, required: true, default: 0, min: 1 },
        color: { type: String, required: true },
        size: { type: String, required: true },
      },
    ],
    totalQuanlity: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

var Cart = mongoose.model("Cart", cartSchema, "cart");

export default Cart;
