import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: String,
    duration: String,
    location: String,

    status: {
      type: String,
      enum: ["Open", "Closed", "In Progress"],
      default: "Open",
    },

    // 🔑 SNAPSHOT NGO NAME (STATIC OR DYNAMIC)
    ngoName: {
      type: String,
      default: "Community Support Organization",
    },

    // 🔑 PRESENT ONLY FOR NGO-CREATED OPPORTUNITIES
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Opportunity", opportunitySchema);
