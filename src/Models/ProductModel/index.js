import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    brand: { type: String, required: true, default: "" },
    category: { type: String, required: true },
    color: { type: Array, required: true, default: "#111827" },
    thumbnail: [String],
    images: [String],
  },
  { timestamps: true }
);

var Product = mongoose.model("Product", productSchema, "products");

export default Product;
