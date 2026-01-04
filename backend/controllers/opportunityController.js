import Opportunity from "../models/Opportunity.js";

/* CREATE OPPORTUNITY (NGO only) */
export const createOpportunity = async (req, res) => {
  try {
    const opportunity = new Opportunity({
      ...req.body,
      createdBy: req.user._id,
      ngoName: req.user.fullName, // ✅ NGO name from user profile
    });

    await opportunity.save();

    res.status(201).json({
      message: "Opportunity created successfully",
      opportunity,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create opportunity" });
  }
};

/* GET ALL OPPORTUNITIES */
export const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("createdBy", "fullName email role")
      .select(
        "title description status createdAt skillsRequired location duration ngoName"
      ) // ✔ FIX
      .sort({ createdAt: -1 });

    res.status(200).json(opportunities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch opportunities" });
  }
};

/* GET SINGLE OPPORTUNITY BY ID */
export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate("createdBy", "fullName email role")
      .select(
        "title description status createdAt skillsRequired location duration ngoName"
      );

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch opportunity" });
  }
};

/* UPDATE OPPORTUNITY */
export const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // 🔒 Ownership check (skip static opportunities)
    if (
      opportunity.createdBy &&
      opportunity.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this opportunity" });
    }

    Object.assign(opportunity, req.body);
    const updated = await opportunity.save();

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update opportunity" });
  }
};

/* DELETE OPPORTUNITY */
export const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (
      opportunity.createdBy &&
      opportunity.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this opportunity" });
    }

    await opportunity.deleteOne();
    res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete opportunity" });
  }
};
