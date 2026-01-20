import express from "express";
import { signup, login } from "../controllers/authController.js";
import { getProfile, updateProfile, changePassword } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.patch("/change-password", authMiddleware, changePassword);

export default router;
