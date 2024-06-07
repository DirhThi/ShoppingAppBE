import { Order } from "../models/orderModel.js";
import { Feedback } from "../models/feedbackModel.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import mongoose from "mongoose";

const feedbackController = {
  addNewFeedback: async (req, res, next) => {
    try {
      const { orderId, data } = req.body;
      console.log(data);
      const orderExists = await Order.findOne({
        _id: orderId,
      }).populate({
        path: "cartItems",
      });
      if (!orderExists) {
        return res.status(404).json({ message: "order not exist" });
      }

      if (data.length < orderExists.cartItems.length) {
        return res
          .status(400)
          .json({ message: "you need more information to update" });
      }
      for (var i = 0; i < orderExists.cartItems.length; i++) {
        const rating = data[i].rating;
        const description = data[i].description;
        const dateCreate = new Date();
        const user = orderExists.user;
        const newFeedback = new Feedback({
          dateCreate,
          rating,
          description,
          user,
        });
        const savedFeedback = await newFeedback.save();

        const product = await Product.findById(
          orderExists.cartItems[i].product
        );
        const aggregationPipeline = [
          { $match: { _id: orderExists.cartItems[i].product } },
          { $project: { feedbackCount: { $size: "$feedbacks" } } },
        ];

        console.log(aggregationPipeline);
        const result = await Product.aggregate(aggregationPipeline);

        const newAvgRating =
          ((product.avgRating * result[0]?.feedbackCount || 0) + rating) /
          ((result[0]?.feedbackCount || 0) + 1);

        await product.updateOne({
          $push: { feedbacks: savedFeedback._id },
          $set: { avgRating: newAvgRating },
        });
      }

      await orderExists.updateOne(
        { $set: { isFeedback: true } },
        { new: true }
      );

      res.status(200).json("add feedback successful");
    } catch (error) {
      next(error);
    }
  },
  getFeedBackByProductId: async (req, res, next) => {
    const productExists = await Product.findOne({ _id: req.params.id });
    const { skip, limit } = req.query;

    if (!productExists) {
      return res.status(404).json({ message: "product not found" });
    }
    const feedbacks = await Product.findOne({ _id: req.params.id })
      .select("feedbacks")
      .populate({
        path: "feedbacks",
        options: {
          sort: { "dateCreate": -1 },
          skip: parseInt(skip),
          limit: parseInt(limit),
        },
        populate: [{ path: "user", select: "username" }],
      });

    const aggregationPipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      { $project: { feedbackCount: { $size: "$feedbacks" } } },
    ];
    const result = await Product.aggregate(aggregationPipeline);
    res
      .status(200)
      .json({ totalFeedbacks: result[0]?.feedbackCount || 0, data: feedbacks });
  },
};

export default feedbackController;
