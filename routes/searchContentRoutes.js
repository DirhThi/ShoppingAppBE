import { Router } from "express";
import searchContentController from "../controllers/searchContentController.js";
const router = Router();
//http://localhost:8080/api/searchContents
router.post("", searchContentController.addSearchContent);
router.get("",searchContentController.getTopSearchContents)
export { router };
