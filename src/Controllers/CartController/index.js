import _ from "lodash";
import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";

export const getCart = async (req, res) => {
  try {
    const { _id } = req.dataUser;
    const { cartId } = await User.findOne({ _id });
    const { carts } = await Cart.findOne({ _id: cartId });

    res.status(200).json({ status: 1, data: carts });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ status: 0, message: "Đăng nhập thất bại" });
  }
};

export const addCart = async (req, res) => {
  try {
    const { _id } = req.dataUser;
    const { idProduct, data } = req.body;
    if (data) {
      const { cartId } = await User.findOne({ _id });

      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res
          .status(404)
          .json({ status: 0, message: "Giỏ hàng không tồn tại" });
      }

      const { carts } = cart;
      //const indexPro = carts.findIndex((item) => item.id === idProduct);
      const foundItem = _.find(carts, {
        id: idProduct,
        color: data.color.toString(),
        size: data.size.toString(),
      });

      if (foundItem) {
        foundItem.quantity += 1;
      } else {
        carts.push({
          id: idProduct,
          quantity: 1,
          color: data.color,
          size: data.size,
        });
      }
      cart.carts = carts;
      cart.totalQuanlity = carts.length;
      await cart.save();

      res
        .status(200)
        .json({ status: 1, message: "Thêm vào giỏ hàng thành công" });
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
    const { idProduct } = req.body;
    const { cartId } = await User.findOne({ _id });
    const { carts } = await Cart.findOne({ _id: cartId });

    let cartsCopy = [...carts];

    cartsCopy = cartsCopy.filter((item) => item._id !== idProduct);

    await Cart.findByIdAndUpdate(
      { id: cartId },
      { carts: cartsCopy },
      { new: true }
    );
    res.status(200).json({ status: 1, message: "Xoá sản phẩm thành công" });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 1, message: "Đăng nhập thất bại" });
  }
};

export const increaseCart = async (req, res) => {
  try {
    const { _id } = req.dataUser;
    const { idProduct, quantity } = req.body;
    if (quantity > 0) {
      const { cartId } = await User.findOne({ _id });
      const { carts } = await Cart.findOne({ _id: cartId });

      let cartsCopy = [...carts];
      const indexPro = carts.findIndex((item) => item._id === idProduct);

      if (indexPro !== -1) {
        cartsCopy[indexPro].quantity = quantity;
      } else {
        return res
          .status(401)
          .json({ status: 1, message: "Tăng số lượng thất bại" });
      }

      await Cart.findByIdAndUpdate(
        { id: cartId },
        { carts: cartsCopy },
        { new: true }
      );

      return res
        .status(200)
        .json({ status: 1, message: "Tăng số lượng thành công" });
    } else {
      return res
        .status(401)
        .json({ status: 1, message: "Số lượng sản phẩm phải từ 1" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ status: 1, message: "Đăng nhập thất bại" });
  }
};
