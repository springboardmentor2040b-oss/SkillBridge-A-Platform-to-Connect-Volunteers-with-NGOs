import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
    {
        ngo_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description:{
            type: String,
            required: true,
        },

        required_skills: {
            type: [String],
            required: true,
        },

        duration: {
            type: String,
        },

        location:{
            type: String,
        },

        status:{
            type: String,
            enum: ["open", "closed"],
            default: "open"
        },
    },
    { timestamps: true }
);

const Opportunity = mongoose.model("Opportunity", opportunitySchema);
export default Opportunity;