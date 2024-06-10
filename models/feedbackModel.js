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

class FeedbackBuilder {
  constructor() {
    this.feedback = {};
  }

  setDateCreate(dateCreate) {
    this.feedback.dateCreate = dateCreate;
    return this;
  }

  setUser(user) {
    this.feedback.user = user;
    return this;
  }

  setDescription(description) {
    this.feedback.description = description;
    return this;
  }

  setRating(rating) {
    this.feedback.rating = rating;
    return this;
  }

  async build() {
    const feedback = new Feedback(this.feedback);
    return feedback;
  }
}

export { FeedbackBuilder };
