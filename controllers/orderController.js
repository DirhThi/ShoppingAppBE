import { Order, OrderBuilder } from "../models/orderModel.js";
import { CartItem as cartItem } from "../models/cartItemsModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import moment from "moment";
import axios from "axios";
import CryptoJS from "crypto-js";

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

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

        const newOrder = await new OrderBuilder()
          .setDateCreate(dateCreate)
          .setUser(user)
          .setCartItems(cartItems)
          .setIsFeedback(isFeedback)
          .setTotal(total)
          .build();

        const savedOrder = await newOrder.save();
        req.total = total;
        next();
        // res.status(200).json(savedOrder);
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

  createPayment: async (req, res, next) => {
    const embed_data = {
      //sau khi hoàn tất thanh toán sẽ đi vào link này
      redirecturl: "http://localhost:3000/",
    };

    const items = [
      {
        name: "Hat dieu",
        quantity: 1,
        price: 60000,
      },
      {
        name: "Hat sen",
        quantity: 2,
        price: 30000,
      },
    ];
    const transID = Math.floor(Math.random() * 1000000);

    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: req.total,
      //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình

      description: `Payment for the order #${transID}`,
      bank_code: "",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const result = await axios.post(config.endpoint, null, { params: order });

      return res.status(200).json(result.data);
    } catch (error) {
      console.log(error);
    }
  },
};

export default orderController;
