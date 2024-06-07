import { User } from "../models/userModel.js";
import { connectToDB, disconnectFromDB } from "../config/connectDB.js";
import ResError from "../utils/ResError.js";

const authController = {
  //[POST] /api/user
  register: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      // Check if user with email already exists
      const userExists = await User.findOne({ username });
      if (userExists) {
        throw new ResError(401, "Email already exists");
      }
      // Create a new user
      const newUser = new User({ username, password });
      await newUser.save();
      const resUser = newUser.toObject();
      delete resUser.password;
      res.status(201).json({ ...resUser });
    } catch (error) {
      next(error);
    }
  },

  //[POST] /api/login
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        throw new ResError(401, "Wrong email");
      }
      // Check if the password is correct
      const isPasswordValid = password === user.password;
      if (!isPasswordValid) {
        // res.send(401, "Mật khẩu không chính xác");
        throw new ResError(401, "Wrong password");
      }
      const resUser = user.toObject();
      delete resUser.password;
      res.status(200).json({
        ...resUser,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
