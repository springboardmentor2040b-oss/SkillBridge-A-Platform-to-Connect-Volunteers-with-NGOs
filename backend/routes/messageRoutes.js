import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMessagesByConversation, sendMessage, deleteMessage, deleteConversation, markConversationAsRead} from "../controllers/messageController.js";
const router = express.Router(); 

router.get("/:conversationId", authMiddleware, getMessagesByConversation);
router.post("/", authMiddleware, sendMessage);
router.delete("/:messageId", authMiddleware, deleteMessage);
router.delete("/conversation/:conversationId", authMiddleware, deleteConversation);
router.patch("/conversation/:conversationId/read", authMiddleware, markConversationAsRead);

export default router;
