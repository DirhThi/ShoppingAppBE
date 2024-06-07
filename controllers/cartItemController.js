import { cartItem } from "../models/cartItemsModel.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import { Order } from "../models/orderModel.js";

const cartItemController = {
  //[POST] /api/cartItems
  addNewCartItem: async (req, res, next) => {
    try {
      //connectToDB();
      const { user, product, quantity } = req.body;
      const dateUpdate = new Date();
      const isSelected = false;
      if (!product && !quantity && !user) {
        return res
          .status(400)
          .json({ message: "you need more information to add new cart item" });
      }
      if (isNaN(quantity)) {
        return res.status(400).json({ message: "quantity must be number" });
      }
      const userExists = await User.findOne({ _id: user });
      if (!userExists) {
        return res.status(404).json({ message: "user not found" });
      }
      const productExists = await Product.findOne({ _id: product });
      if (!productExists) {
        return res.status(404).json({ message: "product not exist" });
      }
      const cartItemExist = await cartItem.findOne({
        user: user,
        product: product,
        isActived: true,
      });
      if (cartItemExist) {
        const updatedCartItem = await cartItem.findByIdAndUpdate(
          cartItemExist._id,
          {
            quantity:
              parseInt(cartItemExist.quantity, 10) + parseInt(quantity, 10),
            dateUpdate: new Date(),
          },
          { new: true }
        );
        res.status(200).json({ updated: true });
      } else {
        const newCartItem = new cartItem({
          user,
          product,
          quantity,
          dateUpdate,
          isSelected,
        });
        await newCartItem.save();
        res.status(200).json({ updated: false });
      }
      //      disconnectFromDB();
    } catch (error) {
      next(error);
    }
  },

  //PUT-API/cartItems/{cartItemId}
  updateCartItemQuantity: async (req, res, next) => {
    try {
      const itemId = req.params.cartItemId;
      const { newQuantity, isSelected } = req.body;
      if (!newQuantity && isSelected === undefined) {
        return res
          .status(400)
          .json({ message: "you need more information to update" });
      }
      if (newQuantity && isNaN(newQuantity)) {
        return res.status(400).json({ message: "quantity must be number" });
      }

      const updateFields = {};
      if (newQuantity !== undefined) {
        updateFields.quantity = newQuantity;
      }
      if (isSelected !== undefined) {
        updateFields.isSelected = isSelected;
      }

      const updatedCartItem = await cartItem.findByIdAndUpdate(
        itemId,
        { $set: { ...updateFields, dateUpdate: new Date() } },
        { new: true } // giá trị trả về sẽ là giá trị mới nhất sau khi cập nhật
      );

      if (!updatedCartItem) {
        return res.status(404).json({ message: "CartItem not found" });
      }
      res.status(200).json(updatedCartItem);
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteCartItem: async (req, res, next) => {
    try {
      const { cartItemId } = req.params;
      const deleteCartItem = await cartItem.findByIdAndUpdate(
        cartItemId,
        { $set: { isActived: false } },
        { new: true }
      );

      if (!deleteCartItem) {
        return res.status(404).json({ message: "CartItem not found" });
      }

      res
        .status(200)
        .json({ message: "CartItem marked as deleted successfully" });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //[get] /api/cartItems/:userId
  getCartItemByUserId: async (req, res, next) => {
    try {
      //connectToDB();
      const userExists = await User.findOne({ _id: req.params.userId });
      console.log(req.params.userId);
      if (!userExists) {
        return res.status(404).json({ message: "user not found" });
      }
      const sortQuery = {};
      sortQuery["dateUpdate"] = -1;
      const cartItems = await cartItem
        .find({ user: req.params.userId, isActived: true })
        .sort(sortQuery)
        .populate({
          path: "product",
          populate: [{ path: "user", select: "username" }],
        });
      if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({ message: "the item not found in cart" });
      }
      res.status(200).json(cartItems);
      //disconnectFromDB();
    } catch (error) {
      next(error);
    }
  },

  //[PUT] /api/cartItems/purchase/
  purchaseCartItem: async (req, res, next) => {
    try {
      const { cartItemId } = req.body;
      cartItemId.forEach(async (element) => {
        const deletedCartItem = await cartItem.findByIdAndUpdate(
          element,
          { $set: { isActived: false } },
          { new: true }
        );
        if (!deletedCartItem) {
          return res.status(404).json({ message: "CartItem not found" });
        }
        const productExists = await Product.findOne({
          _id: deletedCartItem.product,
        });
        if (!productExists) {
          return res.status(404).json({ message: "product not exist" });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
          deletedCartItem.product,
          {
            sold:
              parseInt(productExists.sold, 10) +
              parseInt(deletedCartItem.quantity, 10),
          },
          { new: true }
        );
      });

      res.status(200).json({ message: "CartItem purchase successfully" });
    } catch (error) {
      console.error("Error purchase cart item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  buyAgain: async (req, res, next) => {
    try {
      //connectToDB();
      const orderId = req.params.orderId;

      if (!orderId) {
        return res
          .status(400)
          .json({ message: "you need more information to add new cart item" });
      }
      const orderItem = await Order.findOne({ _id: orderId }).populate({
        path: "cartItems",
        populate: [
          {
            path: "product",
          },
        ],
      });
      if (!orderItem) {
        return res.status(404).json({ message: "order not exist" });
      }
      var promise = new Promise(async function (resolve, reject) {
        await cartItem.updateMany(
          { user: orderItem.user },
          { $set: { isSelected: false } },
          { new: true } // giá trị trả về sẽ là giá trị mới nhất sau khi cập nhật
        );

        const dateUpdate = new Date();
        const isSelected = true;
        const user = orderItem.user;
        orderItem.cartItems.forEach(async function (currentValue, index) {
          const product = currentValue.product._id;
          const quantity = currentValue.quantity;
          const newCartItem = new cartItem({
            user,
            product,
            quantity,
            dateUpdate,
            isSelected,
          });
          await newCartItem.save();
          if (index + 1 == orderItem.cartItems.length) {
            resolve();
          }
        });
      });
      promise.then(async () => {
        const sortQuery = {};
        sortQuery["dateUpdate"] = -1;
        const cartItems = await cartItem
          .find({ user: orderItem.user, isActived: true })
          .sort(sortQuery)
          .populate({
            path: "product",
            populate: [{ path: "user", select: "username" }],
          });
        if (!cartItems || cartItems.length === 0) {
          return res
            .status(404)
            .json({ message: "the item not found in cart" });
        }
        res.status(200).json(cartItems);
      });

      //      disconnectFromDB();
    } catch (error) {
      next(error);
    }
  },
};

export default cartItemController;
