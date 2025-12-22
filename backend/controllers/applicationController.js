import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";

/* APPLY TO OPPORTUNITY */
export const applyToOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.body;
    const volunteerId = req.user._id;

    // Check opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // ❌ Closed opportunities
    if (opportunity.status !== "Open") {
      return res
        .status(400)
        .json({ message: "Cannot apply to closed opportunities" });
    }

    // Create application
    const application = new Application({
      opportunity_id: opportunityId,
      volunteer_id: volunteerId,
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    // Duplicate apply error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already applied to this opportunity" });
    }

    res.status(500).json({ message: "Application failed" });
  }
};

/* CHECK IF VOLUNTEER ALREADY APPLIED */
export const hasApplied = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    const application = await Application.findOne({
      opportunity_id: opportunityId,
      volunteer_id: req.user._id,
    });

    res.json({ applied: !!application });
  } catch (error) {
    res.status(500).json({ message: "Failed to check application" });
  }
};
