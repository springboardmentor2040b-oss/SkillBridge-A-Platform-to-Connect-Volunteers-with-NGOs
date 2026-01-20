const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String }],
    duration: { type: String },
    location: { type: String },
    status: { type: String, enum: ["Open", "Closed", "In Progress"], default: "Open" },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);