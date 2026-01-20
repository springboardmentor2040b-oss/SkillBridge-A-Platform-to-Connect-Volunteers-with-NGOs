import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const messageSocket = (io, socket) => {
  // Join a conversation room
  socket.on("joinConversation", async (conversationId) => {
    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) return;

      const isParticipant = conversation.participants.includes(socket.user.id);

      if (!isParticipant) return;

      socket.join(conversationId);
    } catch (err) {
      console.error("Join conversation error:", err.message);
    }
  });
  // Leave a conversation room
  socket.on("leaveConversation", (conversationId) => {
    try {
      socket.leave(conversationId);
    } catch (err) {
      console.error("Leave conversation error:", err.message);
    }
  });

// Broadcast message created via REST
socket.on("sendMessage", async (message) => {
  try {
    if (!message?.conversationId) return;

    const populatedMessage = await Message.findById(message._id).populate(
      "senderId",
      "fullName email role avatar"
    );

    io.to(message.conversationId).emit("receiveMessage", populatedMessage);
  } catch (err) {
    console.error("❌ Socket broadcast error:", err.message);
  }
});

};
