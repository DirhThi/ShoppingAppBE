import { Router } from "express";
import authController from "../controllers/authController.js";
const router = Router();
//register account
//http://localhost:8000/api/user
router.post("/user", authController.register);
//login
//http://localhost:8000/api/login
router.put("/login", authController.login);
export { router };

