import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, applicationId, text } = req.body;

    let conversation;

    /* ----------------------------------------------------
       1️⃣ FIND OR CREATE CONVERSATION
    ---------------------------------------------------- */
    if (!conversationId) {
      if (!receiverId || !applicationId) {
        return res.status(400).json({
          message: "receiverId and applicationId are required for new conversation",
        });
      }

      conversation = await Conversation.findOne({ applicationId });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, receiverId],
          applicationId,
        });
      }
    } else {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      return res.status(400).json({ message: "Conversation not found" });
    }

    /* ----------------------------------------------------
       2️⃣ CREATE MESSAGE
    ---------------------------------------------------- */
    const message = await Message.create({
      conversationId: conversation._id,
      senderId: req.user._id,
      senderRole: req.user.role,
      text,
    });

    /* ----------------------------------------------------
       3️⃣ UPDATE LAST MESSAGE + UNREAD COUNTS
    ---------------------------------------------------- */
    const senderId = req.user._id.toString();

    if (!conversation.unreadCounts) {
      conversation.unreadCounts = new Map();
    }

    conversation.participants.forEach((participantId) => {
      const pid = participantId.toString();

      if (pid !== senderId) {
        const currentCount = conversation.unreadCounts.get(pid) || 0;
        conversation.unreadCounts.set(pid, currentCount + 1);
      }
    });

    conversation.lastMessage = message._id;
    await conversation.save();
    // ✅ Populate participants so frontend can show names immediately
const populatedConversation = await Conversation.findById(conversation._id)
  .populate({
    path: "participants",
    select: "fullName username role organizationName",
  });

    /* ----------------------------------------------------
       4️⃣ SOCKET EMITS
    ---------------------------------------------------- */
    const io = req.app.get("io");

    if (io) {
      conversation.participants.forEach((participantId) => {
        const pid = participantId.toString();

        if (pid !== senderId) {
          const messagePayload = {
            ...message.toObject(),
            conversationParticipants: populatedConversation.participants,
          };

          // 🔵 A) MESSAGE LEVEL (right panel, first message case)
          io.to(pid).emit("receiveMessage",{
            ...messagePayload,
            unreadCounts: Object.fromEntries(conversation.unreadCounts),
          });

          // 🔵 B) CONVERSATION LEVEL (left panel sync)
          io.to(pid).emit("conversationUpdated", {
            conversationId: conversation._id,
            lastMessage: messagePayload,
            unreadCounts: Object.fromEntries(conversation.unreadCounts),
          });
        }
      });
    }

    /* ----------------------------------------------------
       5️⃣ RESPONSE TO SENDER
    ---------------------------------------------------- */
    res.status(201).json({
      message,
      conversationId: conversation._id,
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};


export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        read: false,
      },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete their message
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await message.deleteOne();

    res.json({ message: "Message deleted" });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ message: "Failed to delete message" });
  }
};
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // 🔍 Find conversation first (we need data)
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const participants = conversation.participants;
    const applicationId = conversation.applicationId;

    // ❌ Delete messages + conversation
    await Message.deleteMany({ conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    const io = req.app.get("io");

    if (io) {
      // 🔔 Notify BOTH users (user rooms, not conversation room)
      participants.forEach((userId) => {
        io.to(userId.toString()).emit("conversationDeleted", {
          conversationId,
          participants,
          applicationId,
        });
      });
    }

    return res.json({ message: "Conversation deleted successfully" });
  } catch (err) {
    console.error("Delete conversation error:", err);
    return res.status(500).json({ message: "Failed to delete conversation" });
  }
};

export const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.unreadCounts) {
      conversation.unreadCounts = new Map();
    }

    // Reset unread only for current user
    conversation.unreadCounts.set(userId, 0);

    await conversation.save();
    const io = req.app.get("io");

if (io) {
  io.to(userId).emit("conversationRead", {
    conversationId,
    userId,
  });
}
 

    res.json({ message: "Conversation marked as read" });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};
