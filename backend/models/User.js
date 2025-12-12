import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  organization: { type: String },
  location: { type: String },
  description: { type: String },
  website: { type: String },
});

export default mongoose.model("User", userSchema);
