import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: true,
  },
  isActived: {
    type: Boolean,
    default:true
  },
  dateUpdate: {
    type: Date,
    required: true,
  },
});

let cartItem = mongoose.model("cartItem", cartItemSchema);

export { cartItem };
