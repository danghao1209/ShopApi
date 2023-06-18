import Product from "../../Models/ProductModel/index.js";

export const searchPro = async (req, res) => {
  try {
    const { namePro } = req.body;
    const similarProducts = await Product.find({
      title: { $regex: namePro, $options: "i" },
    });

    res.status(200).json({ status: 1, data: similarProducts });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ status: 0, message: "Đăng nhập thất bại" });
  }
};
