import Product from "../../Models/ProductModel/index.js";

export const searchPro = async (req, res, next) => {
  try {
    const { namePro } = req.body;
    const similarProducts = await Product.find({
      title: { $regex: namePro, $options: "i" },
    });

    if (similarProducts.length === 0) {
      throw new Error("Không tìm thấy");
    }
    res.status(200).json({ status: 1, data: similarProducts });
  } catch (error) {
    console.log(error.message);
    error.message = "Tìm kiếm thất bại";
    next(error);
  }
};
