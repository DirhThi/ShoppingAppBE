import { Order } from "../models/orderModel.js";
import { cartItem } from "../models/cartItemsModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
const orderController = {
  addNewOrder: async (req, res, next) => {
    try {
      const { cartItemId, user } = req.body;
      var total = 0;
      var promise = new Promise(function (resolve, reject) {
        cartItemId.forEach(async function (currentValue, index) {
          const deletedCartItem = await cartItem.findByIdAndUpdate(
            currentValue,
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
          total +=
            parseInt(productExists.price, 10) *
            parseInt(deletedCartItem.quantity, 10);
          const updatedProduct = await Product.findByIdAndUpdate(
            deletedCartItem.product,
            {
              sold:
                parseInt(productExists.sold, 10) +
                parseInt(deletedCartItem.quantity, 10),
            },
            { new: true }
          );
          if (index + 1 == cartItemId.length) {
            resolve(total);
          }
        });
      });
      promise.then(async () => {
        const dateCreate = new Date();
        const isFeedback = false;
        const cartItems = [...cartItemId];
        const newOrder = new Order({
          dateCreate,
          user,
          cartItems,
          isFeedback,
          total,
        });
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
      });
    } catch (error) {
      next(error);
    }
  },
  getOrdersByUserId: async (req, res, next) => {
    try {
      //connectToDB();
      const userExists = await User.findOne({ _id: req.params.userId });
      const { skip, limit } = req.query;
      console.log(req.params.userId);
      if (!userExists) {
        return res.status(404).json({ message: "user not found" });
      }
      const sortQuery = {};
      sortQuery["dateCreate"] = -1;
      const orderItems = await Order.find({ user: req.params.userId })
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate({
          path: "cartItems",
          populate: [
            {
              path: "product",
              populate: [{ path: "user", select: "username" }],
            },
          ],
        });
      if (!orderItems || orderItems.length === 0) {
        return res.status(404).json({ message: "order not found" });
      }
      const totalOrder = await Order.countDocuments({
        user: req.params.userId,
      });
      res.status(200).json({ totalOrder: totalOrder, data: orderItems });
      //disconnectFromDB();
    } catch (error) {
      next(error);
    }
  },
  updateOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const updateOrder = await Order.findByIdAndUpdate(
        orderId,
        { $set: { isFeedback: true } },
        { new: true }
      );

      if (!updateOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order feedback successfully" });
    } catch (error) {
      console.error("Error updating Order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default orderController;
