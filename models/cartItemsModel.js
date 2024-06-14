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

let CartItem = mongoose.model("cartItem", cartItemSchema);

export { CartItem };

class CartItemBuilder {
  constructor() {
    this.cartItem = {};
  }

  setUser(user) {
    this.cartItem.user = user;
    return this;
  }

  setProduct(product) {
    this.cartItem.product = product;
    return this;
  }

  setQuantity(quantity) {
    this.cartItem.quantity = quantity;
    return this;
  }

  setIsSelected(isSelected) {
    this.cartItem.isSelected = isSelected;
    return this;
  }

  setIsActived(isActived) {
    this.cartItem.isActived = isActived;
    return this;
  }

  setDateUpdate(dateUpdate) {
    this.cartItem.dateUpdate = dateUpdate;
    return this;
  }

  async build() {
    const cartItem = new CartItem(this.cartItem);
    return cartItem;
  }
}

export { CartItemBuilder };
