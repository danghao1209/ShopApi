import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
    },
    dataOrder: [
      {
        id: { type: String, required: true }, //id san pham
        quantity: { type: Number, required: true, default: 0, min: 1 },
        color: { type: String, required: true },
        size: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0, min: 0 },
    status: [{ type: String, default: "Đang xác nhận" }],
  },
  { timestamps: true }
);

var Orders = mongoose.model("Orders", orderSchema, "orders");

export default Orders;
