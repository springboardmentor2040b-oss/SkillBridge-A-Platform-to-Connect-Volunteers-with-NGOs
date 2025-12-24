const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    opportunity: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Opportunity",
      required: true 
    },
    volunteer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected"], 
      default: "pending" 
    },
    coverLetter: {
      type: String,
      default: ""
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate applications
applicationSchema.index({ opportunity: 1, volunteer: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);