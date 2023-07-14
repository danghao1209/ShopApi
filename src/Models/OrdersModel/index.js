import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    dataOrder: [
      {
        id: { type: String, required: true }, //id san pham
        quantity: { type: Number, required: true, default: 0, min: 1 },
        color: { type: String, required: true },
        size: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        discountPercent: { type: Number, required: true, default: 0 },
      },
    ],
    detailedAddress: {
      address: { type: String, required: true },
      tinh: { type: Object, required: true },
      huyen: { type: Object, required: true },
      xa: { type: Object, required: true },
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    freeship: { type: Boolean, required: true, default: false },
    totalPrice: { type: Number, required: true, default: 0, min: 0 },
    lastPrice: { type: Number, required: true, default: 0, min: 0 },
    note: { type: String },
    status: [{ type: String, default: "Đang xác nhận" }],
  },
  { timestamps: true }
);

var Orders = mongoose.model("Orders", orderSchema, "orders");

export default Orders;
