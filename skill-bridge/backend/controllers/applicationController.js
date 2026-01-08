import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";

/* =========================
   VOLUNTEER APPLY
========================= */
export const applyToOpportunity = async (req, res) => {
  try {
    const { opportunityId, motivation, availability, skills } = req.body;

    if (!req?.user?.id)
      return res.status(401).json({ message: "Unauthorized user" });

    const volunteerId = req.user.id;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    if (opportunity.status === "CLOSED")
      return res.status(400).json({ message: "Opportunity is closed" });

    if (opportunity.createdBy.toString() === volunteerId) {
      return res
        .status(403)
        .json({ message: "You cannot apply to your own opportunity" });
    }

    const existing = await Application.findOne({
      opportunity: opportunityId,
      volunteer: volunteerId,
    });

    if (existing)
      return res
        .status(400)
        .json({ message: "Already applied for this opportunity" });

    const application = await Application.create({
      opportunity: opportunityId,
      volunteer: volunteerId,
      ngo: opportunity.createdBy,
      motivation,
      availability,
      skills,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

/* =========================
   VOLUNTEER APPLICATIONS + STATUS
========================= */
export const getMyApplicationsWithStatus = async (req, res) => {
  try {
    if (!req?.user?.id)
      return res.status(401).json({ message: "Unauthorized user" });

    const volunteerId = req.user.id;

    const applications = await Application.find({ volunteer: volunteerId })
      .populate("opportunity", "title location date")
      .select("status opportunity createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Fetch application status error:", err);
    res.status(500).json({ message: "Failed to fetch application status" });
  }
};

/* =========================
   NGO APPLICATIONS
========================= */
export const getApplicationsForNGO = async (req, res) => {
  try {
    if (!req?.user?.id)
      return res.status(401).json({ message: "Unauthorized user" });

    const ngoId = req.user.id;

    const applications = await Application.find({ ngo: ngoId })
      .populate("volunteer", "fullName email")
      .populate("opportunity", "title location")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Fetch NGO applications error:", err);
    res.status(500).json({ message: "Failed to fetch NGO applications" });
  }
};

/* =========================
   DASHBOARD
========================= */
export const getApplicationsForDashboard = async (req, res) => {
  try {
    const { id, userType } = req.user;
    let applications = [];

    if (userType === "NGO") {
      applications = await Application.find({ ngo: id })
        .populate("volunteer", "fullName email")
        .populate("opportunity", "title")
        .sort({ createdAt: -1 });
    }

    if (userType === "Volunteer") {
      applications = await Application.find({ volunteer: id })
        .populate("ngo", "organizationName")
        .populate("opportunity", "title")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(applications);
  } catch (err) {
    console.error("Fetch dashboard applications error:", err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

/* =========================
   ACCEPT / REJECT
========================= */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!["ACCEPTED", "REJECTED"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const application = await Application.findById(applicationId);

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    if (application.ngo.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    application.status = status;
    await application.save();

    res.status(200).json({
      message: `Application ${status.toLowerCase()}`,
      application,
    });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update application status" });
  }
};
