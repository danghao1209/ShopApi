import _ from "lodash";
import mongoose from "mongoose";
import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";
import Product from "../../Models/ProductModel/index.js";

export const getCart = async (req, res) => {
  try {
    const { _id } = req.dataUser;
    const { cartId } = await User.findOne({ _id });
    const carts = await Cart.findOne({ _id: cartId });
    res.status(200).json({ status: 1, data: carts });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ status: 0, message: "Đăng nhập thất bại" });
  }
};
export const getDataProInCart = async (req, res) => {
  try {
    const { _id } = req.dataUser;
    const { cartId } = await User.findOne({ _id });
    const { carts } = await Cart.findOne({ _id: cartId });
    const listIdProInCarts = carts.map((item) => item.id);
    const listProInCart = await Product.find({
      _id: { $in: listIdProInCarts },
    });
    res.status(200).json({ status: 1, data: listProInCart });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ status: 0, message: "Đăng nhập thất bại" });
  }
};

export const addCart = async (req, res) => {
  try {
    const { _id } = req.dataUser;
    const { id, data } = req.body;
    if (data && id) {
      const { cartId } = await User.findOne({ _id });

      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res
          .status(404)
          .json({ status: 0, message: "Giỏ hàng không tồn tại" });
      }

      const { carts } = cart;

      const foundItem = _.find(carts, {
        id: id,
        color: data.color.toString(),
        size: data.size.toString(),
      });

      if (foundItem) {
        foundItem.quantity += 1;
      } else {
        carts.push({
          id: id,
          quantity: 1,
          color: data.color,
          size: data.size,
        });
      }
      cart.carts = carts;
      cart.totalQuanlity = carts.length;
      await cart.save();

      res.status(200).json({
        status: 1,
        message: "Thêm vào giỏ hàng thành công",
      });
    } else {
      throw new Error("Không có data trong product");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: 0, message: "Đã xảy ra lỗi" });
  }
};

export const deleteOneProInCart = async (req, res) => {
  try {
    const { _id } = req.dataUser;
    const { data } = req.body;

    const { cartId } = await User.findOne({ _id });
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res
        .status(404)
        .json({ status: 0, message: "Giỏ hàng không tồn tại" });
    }
    const { carts } = cart;
    const searchId = new mongoose.Types.ObjectId(data.id);
    //const foundItem = _.filter(carts, (item) => _.isEqual(item._id, searchId));
    const foundItem = _.find(carts, { _id: searchId });
    if (foundItem) {
      const newCarts = _.filter(carts, (item) => {
        return !_.isEqual(item._id, searchId);
      });
      cart.carts = newCarts;
      cart.totalQuanlity = newCarts.length;
      await cart.save();
      res.status(200).json({
        status: 1,
        message: "Xoá sản phẩm thành công",
        data: searchId,
      });
    } else {
      throw new Error("Lỗi");
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      status: 1,
      message: "Không có sản phẩm trong giỏ hàng",
    });
  }
};

export const increaseCart = async (req, res) => {
  try {
    const { _id } = req.dataUser;
    const { data } = req.body;
    if (data && data?.quantity > 0) {
      const { cartId } = await User.findOne({ _id });
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res
          .status(404)
          .json({ status: 0, message: "Giỏ hàng không tồn tại" });
      }
      const { carts } = cart;
      const searchId = new mongoose.Types.ObjectId(data.id);
      const foundItem = _.find(carts, { _id: searchId });
      if (foundItem) {
        foundItem.quantity = data.quantity;
      } else {
        throw new Error("Lỗi");
      }

      cart.carts = carts;
      await cart.save();

      return res.status(201).json({
        status: 1,
        message: "Tăng số lượng thành công",
        data: foundItem,
      });
    } else {
      return res
        .status(400)
        .json({ status: 1, message: "Số lượng sản phẩm phải từ 1", data: [] });
    }
  } catch (error) {
    return res.status(422).json({ status: 1, message: "Lỗi", data: [] });
  }
};
