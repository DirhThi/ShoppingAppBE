import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  dateCreate: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cartItem",
    },
  ],
  isFeedback: {
    type: Boolean,
    required: true,
    default: false,
  },
  total: {
    type: Number,
    required: true,
  },
});

let Order = mongoose.model("order", orderSchema);

export { Order };
