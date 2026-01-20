import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
