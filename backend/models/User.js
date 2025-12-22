// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  fullName: String,

  role: {
    type: String,
    enum: ["volunteer", "ngo"], // ✅ LOWERCASE ONLY
    required: true,
  },

  skills: [String],
  organizationDescription: String,
});

export default mongoose.model("User", userSchema);
