import _ from "lodash";
import mongoose from "mongoose";
import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";
import Product from "../../Models/ProductModel/index.js";

export const getCart = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;
    const { cartId } = await User.findOne({ _id });

    const carts = await Cart.findOne({ _id: cartId });
    if (!carts) {
      throw new Error("Không tìm thấy giỏ hàng");
    }
    res.status(200).json({ status: 1, data: carts });
  } catch (error) {
    console.log(error.message);
    error.message = "Đăng nhập thất bại";
    next(error);
  }
};

export const getDataProInCart = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;
    const { cartId } = await User.findOne({ _id });
    const { carts } = await Cart.findOne({ _id: cartId });
    const listIdProInCarts = carts.map((item) => item.id);
    const listProInCart = await Product.find({
      _id: { $in: listIdProInCarts },
    });
    if (listProInCart.length === 0) {
      throw new Error("Lấy dữ liệu từ giỏ hàng thất bại");
    }
    res.status(200).json({ status: 1, data: listProInCart });
  } catch (error) {
    console.log(error.message);
    error.message = "Đăng nhập thất bại";
    next(error);
  }
};

export const addCart = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;
    const { id, data } = req.body;
    if (data && id) {
      const { cartId } = await User.findOne({ _id });

      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Thêm vào giỏ hàng thất bại");
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
    next(error);
  }
};

export const deleteOneProInCart = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;
    const { data } = req.body;

    const { cartId } = await User.findOne({ _id });
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Sản phẩm không tồn tại trong giỏ hàng");
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
    error.message = "Không có sản phẩm trong giỏ hàng";
    next(error);
  }
};

export const increaseCart = async (req, res, next) => {
  try {
    const { _id } = req.dataUser;
    const { data } = req.body;

    if (!Number.isSafeInteger(data?.quantity)) {
      throw new Error("Số lượng phải là số nguyên");
    }

    if (data && data?.quantity > 0) {
      const { cartId } = await User.findOne({ _id });

      if (!cartId) {
        throw new Error("Giỏ hàng không tồn tại");
      }

      const cart = await Cart.findById(cartId);

      if (!cart) {
        throw new Error("Giỏ hàng không tồn tại");
      }

      const { carts } = cart;
      const searchId = new mongoose.Types.ObjectId(data.id);
      const foundItem = _.find(carts, { _id: searchId });
      const product = await Product.findOne({
        _id: new mongoose.Types.ObjectId(foundItem.id),
      });

      if (foundItem) {
        if (
          data.quantity >
          product?.data[foundItem?.color]?.size?.[foundItem?.size]
        ) {
          throw new Error(
            "Số lượng nhiều hơn số lượng của sản phẩm vui lòng giảm lại số lượng"
          );
        }
        foundItem.quantity = parseInt(data.quantity);
      } else {
        throw new Error("Không tìm thấy sản phẩm này trong giỏ hàng");
      }

      cart.carts = carts;
      await cart.save();

      return res.status(200).json({
        status: 1,
        message: "Tăng số lượng thành công",
        data: foundItem,
      });
    } else {
      throw new Error("Số lượng sản phẩm phải từ 1");
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
