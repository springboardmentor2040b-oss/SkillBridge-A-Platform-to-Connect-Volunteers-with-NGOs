import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    duration: String,
    location: String,
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Pre-save hook to ensure status is uppercase
opportunitySchema.pre("save", function (next) {
  if (this.status) {
    this.status = this.status.toUpperCase();
  }
  next();
});

export default mongoose.model("Opportunity", opportunitySchema);
