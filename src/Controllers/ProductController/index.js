import _ from "lodash";
import shortid from "shortid";
import fs from "fs";
import mongoose from "mongoose";

import Product from "../../Models/ProductModel/index.js";

export const getAllProduct = async (req, res, next) => {
  try {
    const resultFind = await Product.find({});
    if (resultFind?.length === 0) {
      throw new Error("Không lấy được sản phẩm");
    }
    const resultsALl = {
      total: resultFind.length,
      products: resultFind,
    };
    return res.status(200).json(resultsALl);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const result = await Product.findById(req.params.id);
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
  } catch (error) {
    console.log(error.message);
    next(error);
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
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const searchPro = async (req, res, next) => {
  try {
    const { valueSearch } = req.body;
    const keyword = valueSearch.replace(/\s+/g, " ").trim();
    if (keyword?.length > 0) {
      const regexKeyword = new RegExp(keyword, "i");
      const products = await Product.find({ title: { $regex: regexKeyword } });

      if (products?.length === 0) {
        throw new Error("Không có sản phẩm trùng hợp");
      }
      // Xử lý kết quả trả về, ví dụ: gửi kết quả về cho client
      res.status(200).json({ data: products });
    } else {
      throw new Error("Không có keyword");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
