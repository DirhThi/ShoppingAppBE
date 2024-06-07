import { Router } from "express";
import productController from "../controllers/productController.js";
const router = Router();

//add new product
//http://localhost:8000/api/products
router.post("/", productController.addNewProduct);
//get product by product id
//http://localhost:8000/api/products/:productId
router.get("/:id", productController.getProductByProductId);
//get product by user id
//http://localhost:8000/api/products/user/:userId
router.get("/user/:id", productController.getProductByUserId);
//get product sorting
//http://localhost:8000/api/products?sorting=price:asc
router.get("/", productController.getProductSorting);

//update Product Detail
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
//http://localhost:8080/api/products/search/searchProduct
router.get("/search/searchProduct", productController.searchProducts);
export { router };
