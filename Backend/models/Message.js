const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
    hiddenBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
