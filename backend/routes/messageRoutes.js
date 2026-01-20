import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessages);

export default router;
