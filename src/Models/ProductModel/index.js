import mongoose from "mongoose";

const ImageSche = new mongoose.Schema({ id: String, url: String });

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
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
        color: { type: String, required: true },
        images: [ImageSche],
      },
    ],
    brand: { type: String, required: true, default: "" },
    category: { type: String, required: true },
    thumbnail: [ImageSche],
  },
  { timestamps: true },
);

var Product = mongoose.model("Product", productSchema, "products");

export default Product;
