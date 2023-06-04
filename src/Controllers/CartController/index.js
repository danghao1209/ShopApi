import User from "../../Models/UserModel/index.js";
import Cart from "../../Models/CartModel/index.js";

export const addCart = async (req, res) => {
  try {
    const { id } = req.dataUser;
    const { idProduct, color, size, image } = req.body;
    const { cartId } = await User.findOne({ id });
    const { carts } = await Cart.findOne({ id: cartId });

    const indexPro = carts.findIndex((item) => item.id === idProduct);
    let cartsCopy = [...carts];

    if (indexPro !== -1) {
      cartsCopy[indexPro].quantity += 1;
    } else {
      cartsCopy.push({
        id: idProduct,
        quantity: 1,
        color: color,
        size: size,
        image: image,
      });
    }

    await Cart.findByIdAndUpdate(
      { id: cartId },
      { carts: cartsCopy },
      { new: true }
    );

    res
      .status(200)
      .json({ status: 1, message: "Thêm vào giỏ hàng thành công" });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ status: 0, message: "Đăng nhập thất bại" });
  }
};

export const deleteOneProInCart = async (req, res) => {
  try {
    const { id } = req.dataUser;
    const { idProduct } = req.body;
    const { cartId } = await User.findOne({ id });
    const { carts } = await Cart.findOne({ id: cartId });

    let cartsCopy = [...carts];

    cartsCopy = cartsCopy.filter((item) => item.id !== idProduct);

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
    const { id } = req.dataUser;
    const { idProduct, quantity } = req.body;
    if (quantity > 0) {
      const { cartId } = await User.findOne({ id });
      const { carts } = await Cart.findOne({ id: cartId });

      let cartsCopy = [...carts];
      const indexPro = carts.findIndex((item) => item.id === idProduct);

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
