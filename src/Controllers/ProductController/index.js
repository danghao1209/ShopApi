import _ from "lodash";
import shortid from "shortid";
import fs from "fs";

import Product from "../../Models/ProductModel/index.js";

export const getAllProduct = async (req, res, next) => {
  try {
    let resultFind = await Product.find({});
    let resultsALl = {
      total: resultFind.length,
      products: resultFind,
    };
    return res.status(200).json(resultsALl);
  } catch (e) {
    return res.status(404).json({
      total: 0,
      products: {},
    });
  }
};

export const getProduct = async (req, res, next) => {
  try {
    console.log(req.params.id);
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({
        _id: null,
        title: null,
        description: [],
        price: null,
        new: null,
        discountPercentage: null,
        rating: null,
        data: [],
        brand: null,
        category: null,
        thumbnail: [],
      });
    }
  } catch (e) {
    return res.status(404).json({
      _id: null,
      title: null,
      description: [],
      price: null,
      new: null,
      discountPercentage: null,
      rating: null,
      data: [],
      brand: null,
      category: null,
      thumbnail: [],
    });
  }
};

const writeImg = (path, data) => {
  const dataWrite = Buffer.from(
    data.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  fs.writeFile(path, dataWrite, { encoding: "base64" }, (error) => {
    if (error) throw error;
  });
  let newPath = path.replace("public/", "");
  return newPath;
};

export const addProduct = async (req, res, next) => {
  //đang bị lỗi không add thành công vẫn lưu ảnh => cần tối ưu
  try {
    let result = await Product.findOne({ title: req.body.title });
    if (result) {
      throw new Error("Trùng tên sản phẩm");
    }
    let thumbnail = req.body.thumbnail.map((item) => {
      return writeImg(`public/imgs/${shortid.generate()}.png`, item);
    });
    let dataNew = req.body.data.map((data) => {
      return {
        ...data,
        images: data.images.map((item) => {
          const imagePath = `public/imgs/${shortid.generate()}.png`;
          return writeImg(imagePath, item);
        }),
      };
    });

    const addProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discountPercentage: req.body.discountPercentage,
      rating: req.body.rating,
      stock: req.body.stock,
      data: dataNew,
      brand: req.body.brand,
      category: req.body.category,
      thumbnail: thumbnail,
    });
    await addProduct.save();

    return res.status(200).json({
      status: "success",
      message: "Thêm sản phẩm thành công",
      data: addProduct,
    });
  } catch (e) {
    return res.status(404).json({
      status: "error",
      message: `Thêm sản phẩm thất bại: ${e.message}`,
      data: [],
    });
  }
};

export const searchPro = async (req, res, next) => {
  try {
    const { valueSearch } = req.body;
    const keyword = valueSearch.replace(/\s+/g, " ").trim();
    if (keyword?.length > 0) {
      const regexKeyword = new RegExp(keyword, "i");
      const products = await Product.find({ title: { $regex: regexKeyword } });

      // Xử lý kết quả trả về, ví dụ: gửi kết quả về cho client
      res.status(200).json({ data: products });
    } else {
      throw new Error("Không có keyword");
    }
  } catch (error) {
    // Xử lý lỗi
    //next(error);
    res.status(400).json({ error: error.message });
  }
};
