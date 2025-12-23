import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";

/**
 * APPLY FOR OPPORTUNITY
 */
export const applyForOpportunity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    // NGO applying to own opportunity ❌
    if (opportunity.createdBy.toString() === userId) {
      return res.status(400).json({
        message: "You cannot apply to an opportunity created by you.",
      });
    }

    if (opportunity.status === "CLOSED") {
      return res
        .status(400)
        .json({ message: "This opportunity is closed." });
    }

    // Prevent duplicate applications
    const alreadyApplied = await Application.findOne({
      opportunity: opportunityId,
      volunteer: userId,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You already applied for this opportunity." });
    }

    const application = await Application.create({
      opportunity: opportunityId,
      volunteer: userId,
    });

    res.status(201).json(application);
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET APPLICATIONS FOR NGO
 */
export const getApplicationsForNGO = async (req, res) => {
  try {
    const ngoId = req.user.id;

    const applications = await Application.find()
      .populate({
        path: "opportunity",
        match: { createdBy: ngoId },
      })
      .populate("volunteer", "fullName email");

    const filtered = applications.filter((a) => a.opportunity);

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE STATUS
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
