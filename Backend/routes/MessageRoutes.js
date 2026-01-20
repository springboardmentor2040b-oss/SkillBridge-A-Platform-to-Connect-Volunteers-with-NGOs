const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/Message");
const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const auth = require("../middleware/Auth");

// GET 
router.get("/:applicationId", auth, async (req, res) => {
  const messages = await Message.find({
    applicationId: req.params.applicationId,
    hiddenBy: { $ne: new mongoose.Types.ObjectId(req.user.id) }
  }).sort({ createdAt: 1 });

  res.json(messages);
});

// SEND 
router.post("/", auth, async (req, res) => {
  const { applicationId, text } = req.body;

  const message = await Message.create({
    applicationId,
    senderId: req.user.id,
    text,
  });

  res.json(message);
});

// GET unread message count
router.get("/unread/count", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all opportunities owned by this user (for NGOs)
    const myOpportunities = await Opportunity.find({ ngo: userId }).select('_id');
    const myOppIds = myOpportunities.map(o => o._id);

    // Get all applications where user is either volunteer OR NGO (via opportunity)
    const applications = await Application.find({
      $or: [
        { volunteer: userId },
        { opportunity: { $in: myOppIds } }
      ]
    });

    const applicationIds = applications.map(app => app._id);

    // Get count of all messages for these applications where sender is not the current user and not read
    const unreadCount = await Message.countDocuments({
      applicationId: { $in: applicationIds },
      senderId: { $ne: new mongoose.Types.ObjectId(userId) },
      read: false,
      hiddenBy: { $ne: new mongoose.Types.ObjectId(userId) }
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ error: "Failed to get unread count" });
  }
});

// Mark messages as read
router.put("/:applicationId/read", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { applicationId } = req.params;

    console.log(`Backend: Marking messages as read for app ${applicationId} by user ${userId}`);

    const result = await Message.updateMany(
      {
        applicationId: new mongoose.Types.ObjectId(applicationId),
        senderId: { $ne: new mongoose.Types.ObjectId(userId) },
        read: false
      },
      { read: true }
    );

    console.log(`Backend: Updated ${result.modifiedCount} messages to read: true`);

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
});

// Get recent messages for a user across all applications
router.get("/user/recent", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find opportunities owned by this user (if NGO)
    const myOpportunities = await Opportunity.find({ ngo: userId }).select('_id');
    const myOpportunityIds = myOpportunities.map(opp => opp._id);

    // Find applications where:
    // 1. User is the volunteer
    // 2. OR User is the NGO (via opportunity ownership)
    const applications = await Application.find({
      $or: [
        { volunteer: userId },
        { opportunity: { $in: myOpportunityIds } }
      ]
    }).select('_id');

    const appIds = applications.map(app => app._id);

    // Get all messages for these applications
    const allMessages = await Message.find({
      applicationId: { $in: appIds },
      hiddenBy: { $ne: new mongoose.Types.ObjectId(userId) }
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'fullName organizationName email')
      .populate({
        path: 'applicationId',
        populate: [
          { path: 'volunteer', select: 'fullName email' },
          { path: 'opportunity', populate: { path: 'ngo', select: 'organizationName fullName email' } }
        ]
      });

    // Group messages by application and get latest message FROM OTHERS + unread count
    const conversationMap = new Map();

    allMessages.forEach(msg => {
      const appId = msg.applicationId?._id?.toString() || msg.applicationId?.toString();
      if (!appId) return;

      const senderId = msg.senderId?._id?.toString() || msg.senderId?.toString();
      const isFromOther = senderId && senderId !== userId;

      // Only process messages from other users
      if (!isFromOther) return;

      if (!conversationMap.has(appId)) {
        conversationMap.set(appId, {
          latestMessage: msg,
          unreadCount: 0
        });
      }

      // Count unread messages from others
      if (!msg.read) {
        const conv = conversationMap.get(appId);
        conv.unreadCount++;
      }
    });

    // Convert to array and add unread count to latest message
    const recentMessages = Array.from(conversationMap.values())
      .map(conv => {
        const msg = conv.latestMessage;
        const app = msg.applicationId;
        let chatPartnerName = "User";

        if (app && typeof app === 'object') {
          const volId = app.volunteer?._id?.toString() || app.volunteer?.toString();
          if (volId === userId) {
            // Current user is volunteer, partner is NGO
            chatPartnerName = app.opportunity?.ngo?.organizationName ||
              app.opportunity?.ngo?.fullName ||
              app.opportunity?.title ||
              "NGO Partner";
          } else {
            // Current user is NGO, partner is Volunteer
            chatPartnerName = app.volunteer?.fullName || "Volunteer";
          }
        }

        return {
          ...msg.toObject(),
          chatPartnerName,
          unreadCount: conv.unreadCount,
          // Force applicationId to be the string ID for safe navigation
          applicationId: app?._id?.toString() || app?.toString() || msg.applicationId?.toString()
        };
      })
      .slice(0, 10);

    res.json(recentMessages);

  } catch (err) {
    console.error("Error fetching recent messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete all messages for an application (delete chat)
router.delete("/:applicationId", auth, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    // Verify user has access to this application
    const application = await Application.findById(applicationId).populate('opportunity');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user is either the volunteer or the NGO owner
    const isVolunteer = application.volunteer.toString() === userId;
    const isNGO = application.opportunity.ngo.toString() === userId;

    if (!isVolunteer && !isNGO) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Mark all existing messages as hidden for this user
    await Message.updateMany(
      { applicationId: new mongoose.Types.ObjectId(applicationId) },
      { $addToSet: { hiddenBy: new mongoose.Types.ObjectId(userId) } }
    );

    res.json({ message: "Chat deleted for you" });
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
