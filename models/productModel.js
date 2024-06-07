import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  viewed: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  dateCreate: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  images: [
    {
      imageUrl: {
        type: String,
        required: true,
      },
      imageDescription: {
        type: String,
      },
    },
  ],
  feedbacks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "feedback",
    },
  ],
  avgRating: {
    type: Number,
    required:true
  },
  searchIdea: {
    type: String,
  }
});

let Product = mongoose.model("product", productSchema);

export { Product };
