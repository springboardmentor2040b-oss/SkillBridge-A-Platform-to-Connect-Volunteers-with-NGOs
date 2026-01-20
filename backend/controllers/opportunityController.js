import Opportunity from "../models/Opportunity.js";

const getUserId = (req) => req.user?.id || req.user?._id;

/* =========================
   CREATE OPPORTUNITY
   ========================= */
export const createOpportunity = async (req, res) => {
  try {
    const opportunity = new Opportunity({
      ...req.body,
      status: req.body.status?.toUpperCase() || "OPEN", // normalize status
      createdBy: getUserId(req),
    });

    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (err) {
    console.error("Create opportunity error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL OPPORTUNITIES
   ========================= */
export const getAllOpportunities = async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};

    if (filter === "OPEN") query.status = "OPEN";
    if (filter === "CLOSED") query.status = "CLOSED";
    if (filter === "MY_NGO") query.createdBy = getUserId(req);

    console.log("Fetching opportunities with filter:", filter);

    const opportunities = await Opportunity.find(query)
      .populate("createdBy", "username organizationName")
      .sort({ createdAt: -1 });

    res.status(200).json(opportunities);
  } catch (err) {
    console.error("Fetch opportunities error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET OPPORTUNITY BY ID
   ========================= */
export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate("createdBy", "username organizationName");

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json(opportunity);
  } catch (err) {
    console.error("Get opportunity error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE OPPORTUNITY
   ========================= */
export const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.createdBy.toString() !== getUserId(req)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.body.status) {
      req.body.status = req.body.status.toUpperCase(); // normalize
    }

    const updated = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update opportunity error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE OPPORTUNITY
   ========================= */
export const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.createdBy.toString() !== getUserId(req)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await opportunity.deleteOne();
    res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (err) {
    console.error("Delete opportunity error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
