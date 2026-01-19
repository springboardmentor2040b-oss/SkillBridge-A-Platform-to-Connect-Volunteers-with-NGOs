const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Application = require("../models/Application");
const auth = require("../middleware/Auth");

// GET 
router.get("/:applicationId", auth, async (req, res) => {
  const messages = await Message.find({
    applicationId: req.params.applicationId,
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
    
    // Get all applications where user is either NGO or volunteer
    const applications = await Application.find({
      $or: [
        { ngo: userId },
        { volunteer: userId }
      ]
    });

    const applicationIds = applications.map(app => app._id);

    // Get all messages for these applications where sender is not the current user
    const unreadCount = await Message.countDocuments({
      applicationId: { $in: applicationIds },
      senderId: { $ne: userId },
      read: false
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
    
    await Message.updateMany(
      {
        applicationId: req.params.applicationId,
        senderId: { $ne: userId },
        read: false
      },
      { read: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
});

module.exports = router;
