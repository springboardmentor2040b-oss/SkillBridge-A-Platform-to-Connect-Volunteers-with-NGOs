import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
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

    organization_name: {
      type: String,
      default: null,
    },

    organization_description: {
      type: String,
      default: null,
    },

    website_url: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
