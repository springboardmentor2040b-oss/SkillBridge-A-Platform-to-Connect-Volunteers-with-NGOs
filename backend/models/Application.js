import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
    {
        opportunity_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Opportunity",
            required: true,
        },

        volunteer_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;