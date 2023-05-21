import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    orders: [
      [
        {
          id: { type: String, required: true },
          dataOrder: [
            {
              id: { type: String, required: true }, //id san pham
              quantity: { type: Number, required: true, default: 0, min: 1 },
              color: { type: String, required: true },
              size: { type: String, required: true },
              image: { type: String, required: true },
            },
          ],
          total: { type: Number, required: true, default: 0, min: 0 },
          status: [{ type: String, default: "Đang xác nhận" }],
        },
      ],
    ],
    total: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

var Orders = mongoose.model("Orders", orderSchema, "orders");

export default Orders;
