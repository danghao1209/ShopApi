import _ from "lodash";
import shortid from "shortid";
import fs from "fs";
import { redisClient } from "../../Models/Redis/index.js";
import Product from "../../Models/ProductModel/index.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllProduct = async (req, res, next) => {
  try {
    const allProductsJSON = await redisClient.get("allproducts");
    if (allProductsJSON) {
      let resultsAll = null;
      try {
        resultsAll = JSON.parse(allProductsJSON);
      } catch (error) {
        throw new Error(error);
      }
      return res.status(200).json(resultsAll);
    } else {
      const resultFind = await Product.find({});
      if (resultFind?.length === 0) {
        throw new Error("Không lấy được sản phẩm");
      }
      const jsonString = JSON.stringify(resultFind);
      await redisClient.set("allproducts", jsonString);
      const resultsALl = {
        total: resultFind.length,
        products: resultFind,
      };

      return res.status(200).json(resultsALl);
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
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
    "base64",
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
    await redisClient.deleteKey("allproducts");

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

function deleteImageFromServer(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting image:", err);
      throw err;
    }
    console.log("Image deleted from server:", filePath);
  });
}

export const addPreDataProduct = async (req, res, next) => {
  //đang bị lỗi không add thành công vẫn lưu ảnh => cần tối ưu
  try {
    let result = await Product.findOne({ title: req.body.title });
    const {
      title,
      description,
      price,
      discountPercentage,
      rating,
      brand,
      category,
    } = req.body;
    if (result) {
      throw new Error("Trùng tên sản phẩm");
    }

    const file = req.files; // Đối tượng file đã được xử lý bởi multer

    // Upload ảnh từ server lên Cloudinary
    const thumb1File = req.files["thumb1"][0]; // Lấy file ảnh từ trường "thumb"
    const thumb2File = req.files["thumb2"][0];
    //const result = await cloudinary.uploader.upload(file.path);

    // Tiếp tục xử lý file tải lên nếu cần, ví dụ như lưu URL đã upload vào cơ sở dữ liệu

    // Xoá ảnh từ server sau khi đã upload lên Cloudinary
    //deleteImageFromServer(file.path);
    const thumb1Result = await cloudinary.uploader.upload(thumb1File.path);

    deleteImageFromServer(thumb1File.path);
    // Upload ảnh image từ server lên Cloudinary
    const thumb2Result = await cloudinary.uploader.upload(thumb2File.path);
    deleteImageFromServer(thumb2File.path);

    const thumbnail = [
      { id: thumb1Result?.public_id, url: thumb1Result?.url },
      { id: thumb2Result?.public_id, url: thumb2Result?.url },
    ];

    const arrDescription = description.split(/;\s|;/);
    const addProduct = new Product({
      title: title,
      description: arrDescription,
      price: price,
      discountPercentage: discountPercentage,
      rating: rating,
      data: [],
      brand: brand,
      category: category,
      thumbnail: thumbnail,
    });
    await addProduct.save();

    await redisClient.deleteKey("allproducts");

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

export const addDataForProduct = async (req, res, next) => {
  //đang bị lỗi không add thành công vẫn lưu ảnh => cần tối ưu
  try {
    const { id, S, M, L, color } = req.body;

    if (!id || !S || !M || !L || !color) {
      throw new Error("Thiếu thông tin sản phẩm");
    }
    const result = await Product.findOne({ _id: id });
    if (!result) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    const image1 = req.files["image1"][0];
    const image2 = req.files["image2"][0];
    const image3 = req.files["image3"][0];
    const image4 = req.files["image4"][0];

    const image1Result = await cloudinary.uploader.upload(image1.path);

    deleteImageFromServer(image1.path);
    // Upload ảnh image từ server lên Cloudinary
    const image2Result = await cloudinary.uploader.upload(image2.path);
    deleteImageFromServer(image2.path);

    const image3Result = await cloudinary.uploader.upload(image3.path);
    deleteImageFromServer(image3.path);

    const image4Result = await cloudinary.uploader.upload(image4.path);
    deleteImageFromServer(image4.path);

    const images = [
      { id: image1Result?.public_id, url: image1Result?.url },
      { id: image2Result?.public_id, url: image2Result?.url },
      { id: image3Result?.public_id, url: image3Result?.url },
      { id: image4Result?.public_id, url: image4Result?.url },
    ];

    const newData = [
      ...result.data,
      { size: { S: S, M: M, L: L }, color: color, stock: 0, images: images },
    ];

    result.data = newData;

    await result.save();
    await redisClient.deleteKey("allproducts");

    return res.status(200).json({
      status: "success",
      message: "Thêm data sản phẩm thành công",
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
