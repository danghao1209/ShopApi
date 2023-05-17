import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    description: [{ type: String, required: true }],
    price: { type: Number, required: true },
    new: { type: Boolean, required: true, default: false },
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
      max: 100,
      min: 0,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    data: [
      {
        size: {
          S: { type: Number, default: 0, min: 0 },
          M: { type: Number, default: 0, min: 0 },
          L: { type: Number, default: 0, min: 0 },
        },
        stock: { type: Number, required: true, default: 0, min: 0 },
        color: { type: String, required: true, default: "#111827" },
        images: [{ type: String, required: true }],
      },
    ],
    brand: { type: String, required: true, default: "" },
    category: { type: String, required: true },
    thumbnail: [{ type: String, required: true }],
  },
  { timestamps: true }
);

var Product = mongoose.model("Product", productSchema, "products");

export default Product;
