import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// added routes only
router.get("/profile", protect, getUserProfile);
router.patch("/profile", protect, updateUserProfile);
router.patch("/change-password", protect, changePassword);

export default router;
