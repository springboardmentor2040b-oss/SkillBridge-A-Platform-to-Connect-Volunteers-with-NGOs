const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  roomId: String,
  sender: String,
  text: String,
  time: String
});

module.exports = mongoose.model("ChatMessage", ChatSchema);
