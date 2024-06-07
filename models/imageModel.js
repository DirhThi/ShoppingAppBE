import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imgUrl: {
    type: String,
    required: true,
  },
  description: {
    type: Number,
    required: true,
  },
});

let Image = mongoose.model("image", imageSchema);

export { Image };
