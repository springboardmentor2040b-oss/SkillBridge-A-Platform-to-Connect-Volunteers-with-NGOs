import Conversation from "../models/Conversation.js";
import Application from "../models/Application.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

export const getOrCreateConversation = async (req, res) => {
  try {
    const { applicationId } = req.body;
    const userId = req.user._id;

    // Check application exists
    const application = await Application.findById(applicationId)
      .populate("volunteer_id")
      .populate("opportunity_id");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Participants
    const volunteerId = application.volunteer_id._id;
    const ngoId = application.opportunity_id.createdBy;
    // Ensure requester is a participant
    // Authorization check
    const isAllowed =
      volunteerId.toString() === userId.toString() ||
      ngoId.toString() === userId.toString();

    if (!isAllowed) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check existing conversation
    let conversation = await Conversation.findOne({
      applicationId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [volunteerId, ngoId],
        applicationId,
      });
    }

    res.json(conversation);
  } catch (err) {
    console.error("Conversation error:", err);
    res.status(500).json({ message: "Failed to get conversation" });
  }
};
// Get all conversations for the logged-in user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
  participants: userId,
})
  .sort({ updatedAt: -1 })
  .populate({
    path: "participants",
    select: "fullName username organizationName role",
  })
  .populate({
    path: "lastMessage",
    select: "text senderId createdAt",
    populate: {
      path: "senderId",
      select: "fullName username role",
    },
  });
    const conversationsWithUnread = conversations.map((conv) => ({
  ...conv.toObject(),
  unreadCounts: conv.unreadCounts || {},
}));

res.json(conversationsWithUnread);

  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Only participants can delete
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete all messages of this conversation
    await Message.deleteMany({ conversationId });

    // Delete the conversation itself
    await conversation.deleteOne();

    res.json({ message: "Conversation deleted" });
  } catch (err) {
    console.error("Delete conversation error:", err);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};

export const resetUnreadCount = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Conversation.findByIdAndUpdate(conversationId, {
      unreadCount: 0,
    });

    res.json({ message: "Unread count reset" });
  } catch (err) {
    console.error("Reset unread error:", err);
    res.status(500).json({ message: "Failed to reset unread count" });
  }
};
