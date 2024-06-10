import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

let User = mongoose.model("user", userSchema);

class UserBuilder {
  constructor() {
    this.user = {};
  }

  setUsername(username) {
    this.user.username = username;
    return this;
  }

  setPassword(password) {
    this.user.password = password;
    return this;
  }

  async build() {
    const user = new User(this.user);
    return user;
  }
}

export { User, UserBuilder };
