import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";

/* ===================================== */
/* APPLY TO OPPORTUNITY (VOLUNTEER)       */
/* ===================================== */
export const applyToOpportunity = async (req, res) => {
  try {
    const { opportunityId, coverLetter } = req.body;
    const volunteerId = req.user._id;

    // Check opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Prevent applying to closed opportunities
    if (opportunity.status !== "Open" && opportunity.status !== "In Progress") {
      return res
        .status(400)
        .json({ message: "Cannot apply to closed opportunities" });
    }

    // Create application
    const application = new Application({
      opportunity_id: opportunityId,
      volunteer_id: volunteerId,
      coverLetter: coverLetter || "",
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    // Duplicate application
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already applied to this opportunity" });
    }

    res.status(500).json({ message: "Application failed" });
  }
};

/* ===================================== */
/* CHECK IF VOLUNTEER ALREADY APPLIED     */
/* ===================================== */
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

/* ===================================== */
/* GET VOLUNTEER APPLICATIONS (FIXED)    */
/* ===================================== */
export const getVolunteerApplications = async (req, res) => {
  try {
    const volunteer_id = req.user._id;

    const applications = await Application.find({ volunteer_id })
      .populate({
        path: "opportunity_id",
        select:
          "title description location duration skillsRequired ngoName status createdAt",
        populate: {
          path: "createdBy",
          select: "fullName email",
        },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get volunteer apps error:", error);
    res.status(500).json({ message: "Failed to load applications" });
  }
};

/* ===================================== */
/* GET NGO APPLICATIONS                  */
/* ===================================== */
export const getNGOApplications = async (req, res) => {
  try {
    const ngo_id = req.user._id;

    // Find NGO opportunities
    const opportunities = await Opportunity.find({ createdBy: ngo_id });
    const opportunityIds = opportunities.map((opp) => opp._id);

    const applications = await Application.find({
      opportunity_id: { $in: opportunityIds },
    })
      .populate({
        path: "opportunity_id",
        select: "title description status createdAt skillsRequired",
      })
      .populate({
        path: "volunteer_id",
        select: "fullName email skills",
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get NGO apps error:", error);
    res.status(500).json({ message: "Failed to load applications" });
  }
};

/* ===================================== */
/* UPDATE APPLICATION STATUS (NGO)       */
/* ===================================== */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ngo_id = req.user._id;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const opportunity = await Opportunity.findById(application.opportunity_id);

    if (
      !opportunity ||
      opportunity.createdBy.toString() !== ngo_id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

/* ===================================== */
/* GET APPLICATION STATISTICS             */
/* ===================================== */
export const getApplicationStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let stats = { total: 0, pending: 0, accepted: 0, rejected: 0 };

    if (userRole === "volunteer") {
      stats.total = await Application.countDocuments({
        volunteer_id: userId,
      });
      stats.pending = await Application.countDocuments({
        volunteer_id: userId,
        status: "pending",
      });
      stats.accepted = await Application.countDocuments({
        volunteer_id: userId,
        status: "accepted",
      });
      stats.rejected = await Application.countDocuments({
        volunteer_id: userId,
        status: "rejected",
      });
    }

    if (userRole === "ngo") {
      const opportunities = await Opportunity.find({ createdBy: userId });
      const opportunityIds = opportunities.map((opp) => opp._id);

      stats.total = await Application.countDocuments({
        opportunity_id: { $in: opportunityIds },
      });
      stats.pending = await Application.countDocuments({
        opportunity_id: { $in: opportunityIds },
        status: "pending",
      });
      stats.accepted = await Application.countDocuments({
        opportunity_id: { $in: opportunityIds },
        status: "accepted",
      });
      stats.rejected = await Application.countDocuments({
        opportunity_id: { $in: opportunityIds },
        status: "rejected",
      });
    }

    res.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Failed to load statistics" });
  }
};

/* ===================================== */
/* GET SINGLE APPLICATION BY ID           */
/* ===================================== */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate({
        path: "opportunity_id",
        populate: {
          path: "createdBy",
          select: "fullName email",
        },
      })
      .populate("volunteer_id", "fullName email skills");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ message: "Failed to load application" });
  }
};
