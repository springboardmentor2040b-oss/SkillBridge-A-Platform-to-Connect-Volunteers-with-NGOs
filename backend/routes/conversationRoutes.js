import express from "express";
import { getOrCreateConversation, getUserConversations, deleteConversation } from "../controllers/conversationController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();
router.post("/", authMiddleware, getOrCreateConversation);
router.get("/", authMiddleware, getUserConversations);
router.delete("/:conversationId", authMiddleware, deleteConversation);





export default router;
