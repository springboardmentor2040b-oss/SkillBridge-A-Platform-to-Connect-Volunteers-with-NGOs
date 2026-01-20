import mongoose from "mongoose";
import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res
        .status(400)
        .json({ message: "receiverId and content required" });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid receiverId" });
    }

    const message = await Message.create({
      sender_id: req.user._id,
      receiver_id: receiverId,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender_id: req.user._id, receiver_id: req.params.userId },
        { sender_id: req.params.userId, receiver_id: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
