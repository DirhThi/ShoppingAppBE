import { Router } from "express";
import orderController from "../controllers/orderController.js";
const router = Router();
//create cartItem
//http://localhost:8080/api/orders
router.post("", orderController.addNewOrder);
//http://localhost:8080/api/orders/{userId}
router.get("/:userId", orderController.getOrdersByUserId);
//http://localhost:8080/api/orders/{orderId}
router.put("/:orderId", orderController.updateOrder);
export { router };
