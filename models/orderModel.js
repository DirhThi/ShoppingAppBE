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

class OrderBuilder {
  constructor() {
    this.order = {};
  }

  setDateCreate(dateCreate) {
    this.order.dateCreate = dateCreate;
    return this;
  }

  setUser(user) {
    this.order.user = user;
    return this;
  }

  setCartItems(cartItems) {
    this.order.cartItems = cartItems;
    return this;
  }

  setIsFeedback(isFeedback) {
    this.order.isFeedback = isFeedback;
    return this;
  }

  setTotal(total) {
    this.order.total = total;
    return this;
  }

  async build() {
    const order = new Order(this.order);
    return order;
  }
}

export { OrderBuilder };
