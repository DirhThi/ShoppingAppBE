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

class ProductBuilder {
  constructor() {
    this.product = {};
  }

  setProductName(productName) {
    this.product.productName = productName;
    return this;
  }

  setPrice(price) {
    this.product.price = price;
    return this;
  }

  setViewed(viewed) {
    this.product.viewed = viewed;
    return this;
  }

  setSold(sold) {
    this.product.sold = sold;
    return this;
  }

  setDescription(description) {
    this.product.description = description;
    return this;
  }

  setIsDeleted(isDeleted) {
    this.product.isDeleted = isDeleted;
    return this;
  }

  setDateCreate(dateCreate) {
    this.product.dateCreate = dateCreate;
    return this;
  }

  setUser(user) {
    this.product.user = user;
    return this;
  }

  setImages(images) {
    this.product.images = images;
    return this;
  }

  setFeedbacks(feedbacks) {
    this.product.feedbacks = feedbacks;
    return this;
  }

  setAvgRating(avgRating) {
    this.product.avgRating = avgRating;
    return this;
  }

  setSearchIdea(searchIdea) {
    this.product.searchIdea = searchIdea;
    return this;
  }

  async build() {
    const product = new Product(this.product);
    return product;
  }
}

export { ProductBuilder };