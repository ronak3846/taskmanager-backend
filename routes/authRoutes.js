import express from "express";
import { loginUser } from "../controllers/authController.js";
import { register } from "../controllers/authController.js";

const router = express.Router();

// ✅ This is the route the frontend is calling
router.post("/login", loginUser);
router.post("/register", register);
export default router;
