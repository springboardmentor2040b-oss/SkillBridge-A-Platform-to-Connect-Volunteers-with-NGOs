import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    skills: { type: [String], required: true },
    duration: { type: String, trim: true },
    location: { type: String, trim: true },
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

export default mongoose.models.Opportunity || mongoose.model("Opportunity", opportunitySchema);
