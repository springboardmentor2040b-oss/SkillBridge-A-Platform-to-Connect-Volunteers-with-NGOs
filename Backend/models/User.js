const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["volunteer", "ngo"],
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
    },

    bio: {
      type: String,
    },

    // NGO-only
    organizationName: {
      type: String,
    },

    organizationUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
