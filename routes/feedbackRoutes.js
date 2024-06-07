import { Router } from "express";
import feedbackController from "../controllers/feedbackController.js";
const router = Router();
//create cartItem
//http://localhost:8080/api/feedbacks
router.post("", feedbackController.addNewFeedback);
//http://localhost:8080/api/feedbacks/{productId}
router.get("/:id", feedbackController.getFeedBackByProductId);

export { router };
