import shortid from "shortid";

import Product from "../../Models/ProductModel/index.js";

export const getAllProduct = async (req, res, next) => {
  try {
    let resultFind = await Product.find({});
    let resultsALl = {
      products: resultFind,
      total: resultFind.length,
      skip: 0,
      limit: 20,
    };
    res.status(200).json(resultsALl);
  } catch (e) {
    res.status(404).json("Error");
  }
};

export const getProduct = async (req, res, next) => {
  try {
    let result = await Product.findOne({ id: req.params.id });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json("Không có");
    }
  } catch (e) {
    res.status(404).json("Error");
  }
};

export const addProduct = async (req, res, next) => {
  try {
    let color = req.body.color.split(",");
    let thumbnail = req.files.thumbnail.map((img) => {
      return img.path;
    });
    let images = req.files.images.map((img) => {
      return img.path;
    });

    const addProduct = new Product({
      id: shortid.generate(),
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discountPercentage: req.body.discountPercentage,
      rating: req.body.rating,
      stock: req.body.stock,
      brand: req.body.brand,
      category: req.body.category,
      color: color,
      thumbnail: thumbnail,
      images: images,
      published: Date.now(),
    });
    await addProduct.save();

    res.status(200).json({
      status: "success",
      message: "Thêm sản phẩm thành công",
      data: addProduct,
    });
  } catch (e) {
    res.status(404).json(e.message);
  }
};
