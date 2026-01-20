import Opportunity from "../models/Opportunity.js";

export const createOpportunity = async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res
        .status(403)
        .json({ message: "Only NGOs can create opportunities." });
    }
    const { title, description, required_skills, duration, location, status } =
      req.body;

    if (!title || !description || !required_skills) {
      return res
        .status(400)
        .json({
          message: "Title, description, and required skills are mandatory.",
        });
    }
    const opportunity = await Opportunity.create({
      ngo_id: req.user._id,
      title,
      description,
      required_skills,
      duration,
      location,
      status,
    });
    res
      .status(201)
      .json({ message: "Opportunity created successfully", opportunity });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("ngo_id", "name organization_name")
      .sort({ createdAt: -1 });

    res.status(200).json({ opportunities });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOpenOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ status: "open" })
      .populate("ngo_id", "name organization_name")
      .sort({ createdAt: -1 });

    res.status(200).json({ opportunities });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getClosedOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ status: "closed" })
      .populate("ngo_id", "name organization_name")
      .sort({ createdAt: -1 });

    res.status(200).json({ opportunities });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "ngo_id",
      "name organization_name"
    );

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    res.status(200).json({ opportunity });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (
      req.user.role !== "ngo" ||
      opportunity.ngo_id.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this opportunity." });
    }
    const { title, description, required_skills, duration, location, status } =
      req.body;

    if (title) opportunity.title = title;
    if (description) opportunity.description = description;
    if (required_skills) opportunity.required_skills = required_skills;
    if (duration) opportunity.duration = duration;
    if (location) opportunity.location = location;
    if (status) opportunity.status = status;

    await opportunity.save();
    res
      .status(200)
      .json({ message: "Opportunity updated successfully", opportunity });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    if (
      req.user.role !== "ngo" ||
      opportunity.ngo_id.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this opportunity." });
    }
    await opportunity.deleteOne();
    res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyOpportunities = async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ message: "Access denied" });
    }
    const opportunities = await Opportunity.find({
      ngo_id: req.user._id,
    })
      .populate("ngo_id", "name organization_name")
      .sort({ createdAt: -1 });

    res.status(200).json({ opportunities });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const filterOpportunities = async (req,res) =>{
  try{
    const filter = {};

    if(req.query.status){
      filter.status = req.query.status;
    }
    if(req.query.location){
      filter.location = req.query.location;
    }
    if(req.query.skilll){
      filter.required_skills = { $in: [req.query.skill] };
    }
    const opportunities = await Opportunity.find(filter)
    .populate("ngo_id", "name organization_name")
    .sort({ createdAt: -1 });
    res.status(200).json({ opportunities})
  } catch (error){
    res.status(500).json({message: "Server error" });
  }
};