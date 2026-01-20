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
   location: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  }
});

export default mongoose.model("User", userSchema);
