import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  dateCreate: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  description: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    required: true,
  },
});

let Feedback = mongoose.model("feedback", feedbackSchema);

export { Feedback };
