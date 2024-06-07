import { Router } from "express";
import cartItemController from "../controllers/cartItemController.js";
const router = Router();
//create cartItem
//http://localhost:8080/api/cartItems
router.post("", cartItemController.addNewCartItem);
//get cartItem
//http://localhost:8080/api/cartItems
router.get("/:userId", cartItemController.getCartItemByUserId);
//purchase cartItem
//http://localhost:8080/api/cartItems/purchase/
router.put("/purchase/", cartItemController.purchaseCartItem);
//update the quantity
//http://localhost:8080/api/cartItems/{cartItemId}
router.put("/:cartItemId", cartItemController.updateCartItemQuantity);
//delete cartItem
//http://localhost:8080/api/cartItems/{cartItemId}
router.delete("/:cartItemId", cartItemController.deleteCartItem);
//http://localhost:8080/api/cartItems/buyagain/{orderId}
router.post("/buyagain/:orderId", cartItemController.buyAgain);


export { router };
