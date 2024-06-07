import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";
import { connectToDB, disconnectFromDB } from "../config/connectDB.js";
import { cartItem } from "../models/cartItemsModel.js";
import axios from "axios";
import { query } from "express";
import diacritics from "diacritics";
const productController = {
  //[POST] /api/product
  addNewProduct: async (req, res, next) => {
    try {
      //connectToDB();
      const { productName, price, description, user, images } = req.body;
      const viewed = 0;
      const sold = 0;
      const avgRating = 0;
      const dateCreate = new Date();
      if (!productName && !price && !description && !user && !images) {
        return res
          .status(400)
          .json({ message: "you need more information to add new product" });
      }
      if (isNaN(price)) {
        return res.status(400).json({ message: "the price must be number" });
      }
      const userExists = await User.findOne({ _id: user });
      if (!userExists) {
        return res.status(404).json({ message: "user not found" });
      }

      const newProduct = new Product({
        productName,
        price,
        viewed,
        sold,
        description,
        dateCreate,
        user,
        images,
        avgRating,
      });
      const savedNewProduct = await newProduct.save();
      res.status(200).json(savedNewProduct);
      //      disconnectFromDB();
    } catch (error) {
      next(error);
    }
  },

  //[GET] /api/product/:productId
  getProductByProductId: async (req, res, next) => {
    try {
      //connectToDB();
      const product = await Product.findOne({
        _id: req.params.id,
        isDeleted: false,
      })
        .select("-feedbacks")
        .select("-searchIdea")
        .populate({ path: "user", select: "username" });

      if (!product) {
        return res.status(404).json({ message: "product not exist" });
      }
      res.status(200).json(product);
      //disconnectFromDB();
    } catch (error) {
      next(error);
    }
  },
  //[GET] /api/product/user/:userId
  getProductByUserId: async (req, res, next) => {
    try {
      //connectToDB();
      const { skip, limit } = req.query;
      const userExists = await User.findOne({ _id: req.params.id });
      if (!userExists) {
        return res.status(404).json({ message: "user not found" });
      }
      const sortQuery = {};
      sortQuery["dateCreate"] = -1;

      const product = await Product.find({
        user: req.params.id,
        isDeleted: false,
      })
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .select("-feedbacks")
        .select("-searchIdea")
        .populate({ path: "user", select: "username" });

      if (!product) {
        return res.status(404).json({ message: "product not exist" });
      }
      const totalProduct = await Product.countDocuments({
        user: req.params.id,
        isDeleted: false,
      });
      res.status(200).json({ totalProduct: totalProduct, data: product });
      //disconnectFromDB();
    } catch (error) {
      next(error);
    }
  },

  //[GET] /api/product?sorting=&skip=&limit=
  getProductSorting: async (req, res, next) => {
    try {
      //connectToDB();
      const { sorting, limit, skip } = req.query;
      const sortQuery = {};
      if (sorting) {
        const sortFields = sorting.split(",");
        for (const field of sortFields) {
          const [fieldName, sortOrder] = field.split(":");
          sortQuery[fieldName] = sortOrder === "desc" ? -1 : 1;
        }
        sortQuery["_id"] = 1;
      }
      const product = await Product.find({ isDeleted: false })
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .select("-feedbacks")
        .select("-searchIdea")
        .populate({ path: "user", select: "username" });
      if (!product) {
        return res.status(404).json({ message: "product not exist" });
      }
      const totalProduct = await Product.countDocuments({ isDeleted: false });
      res.status(200).json({ totalProduct: totalProduct, data: product });
      //disconnectFromDB();
    } catch (error) {
      next(error);
    }
  },

  //[PUT] /products/:id
  updateProduct: async (req, res, next) => {
    try {
      //await connectToDB();
      const productId = req.params.id;
      const { viewed, sold } = req.body;

      // Kiểm tra xem dữ liệu được cung cấp có hợp lệ hay không
      //Kiểm tra tồn tại
      if (!viewed && !sold) {
        return res
          .status(400)
          .json({ message: "you need more information to update" });
      }
      //Kiểm tra dữ liệu vào phải là kiểu số
      if (isNaN(viewed) || isNaN(sold)) {
        return res
          .status(400)
          .json({ message: "view and sold must be number" });
      }

      // Tìm sản phẩm theo id và cập nhật viewed và sold
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: req.body },
        { new: true }
      );

      // Kiểm tra xem sản phẩm đã được cập nhật thành công hay không
      if (!updatedProduct) {
        return res.status(404).json({ message: "product not exist" });
      }
      // Trả về thông tin sản phẩm đã được cập nhật
      res.status(200).json({
        message: "update product success",
        updatedProduct: updatedProduct,
      });
      //disconnectFromDB();
    } catch (error) {
      next(error);
      res.status(500).json({ message: "update product fail" });
    }
  },
  //[DELETE] /products/:id
  deleteProduct: async (req, res, next) => {
    try {
      // Kết nối đến cơ sở dữ liệu
      //await connectToDB();

      // Lấy ID của sản phẩm từ yêu cầu
      const productId = req.params.id;
      console.log("product id là ", productId);
      // Tìm và xóa sản phẩm từ cơ sở dữ liệu bằng ID
      const deletedProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: { isDeleted: true } },
        { new: true }
      );
      // Kiểm tra nếu không tìm thấy sản phẩm
      if (!deletedProduct) {
        console.log("chạy vào đây");
        return res.status(404).json({ message: "product not exist" });
      }

      // Phản hồi với thông báo xóa thành công
      res.status(200).json({ message: "product already deletes" });

      // Ngắt kết nối từ cơ sở dữ liệu
      //disconnectFromDB();
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ message: "delete product fail" });
    }
  },
  searchProducts: async (req, res, next) => {
    try {
      let { keyword, skip, limit } = req.query;

      keyword = diacritics.remove(keyword.trim().toLowerCase());

      const skipValue = skip ? parseInt(skip) : 0;
      const limitValue = limit ? parseInt(limit) : 10;

      const words = keyword.split(/\s+/);

      const fullPhraseRegex = new RegExp(keyword, "i");
      const wordRegexes = words.map((word) => ({
        searchIdea: { $regex: new RegExp(word, "i") },
      }));

      const searchCondition = {
        $or: [{ searchIdea: fullPhraseRegex }, ...wordRegexes],
      };

      const totalProducts = await Product.countDocuments(searchCondition);

      const products = await Product.find(searchCondition)
        .skip(skipValue)
        .limit(limitValue)
        .select("-feedbacks")
        .select("-searchIdea")
        .populate({ path: "user", select: "username" });

      return res.status(200).json({
        total: totalProducts,
        products,
      });
    } catch (error) {
      next(error);
    }

    //   //đoạn code này dùng để cập nhật thêm trường mới
    //   // try {
    //   //   const products = await Product.find();

    //   //   if (!products || products.length === 0) {
    //   //     return res.status(404).json({ message: "No products found" });
    //   //   }

    //   //   // Duyệt qua từng sản phẩm và cập nhật trường searchIdea
    //   //   for (let product of products) {
    //   //     const searchIdea = diacritics.remove(
    //   //       `${product.productName} ${product.description}`
    //   //     );
    //   //     product.searchIdea = searchIdea;
    //   //     await product.save();
    //   //   }

    //   //   return res
    //   //     .status(200)
    //   //     .json({ message: "All search ideas updated successfully" });
    //   // } catch (error) {
    //   //   next(error);
    //   // }
    //   //kết thúc đoạn code dùng để cập nhật thêm trường mới
    // },
  },
};

export default productController;
