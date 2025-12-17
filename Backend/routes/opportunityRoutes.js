const express = require("express");
const Opportunity = require("../models/Opportunity");
const auth = require("../middleware/Auth");
const User = require("../models/User");
const router = express.Router();

// Create a new opportunity
router.post("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || user.role !== "ngo") {
    return res.status(403).json({ message: "Only NGOs can create opportunities" });
  }

  try {
    const opportunity = await Opportunity.create({
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      location: req.body.location,
      status: req.body.status || "Open",
      skills: req.body.requiredSkills || req.body.skills || [],
      ngo: user._id,
    });
    res.status(201).json(opportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all opportunities
router.get("/", async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate('ngo', 'organisationName fullName');
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single opportunity by ID
router.get("/:id", async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('ngo', 'organisationName fullName email');
    
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    
    res.json(opportunity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an opportunity by ID (only NGO who owns it)
router.put("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can update opportunities" });
    }

    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if the NGO owns this opportunity
    if (opportunity.ngo.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own opportunities" });
    }

    // Update the opportunity
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        location: req.body.location,
        status: req.body.status,
        skills: req.body.skills || req.body.requiredSkills || [],
      },
      { new: true, runValidators: true }
    );

    res.json(updatedOpportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an opportunity by ID (only NGO who owns it)
router.delete("/:id", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user || user.role !== "ngo") {
    return res.status(403).json({ message: "Only NGOs can delete opportunities" });
  }

  const opportunity = await Opportunity.findById(req.params.id);
  if (!opportunity) {
    return res.status(404).json({ message: "Opportunity not found" });
  }
  if (opportunity.ngo.toString() !== user._id.toString()) {
    return res.status(403).json({ message: "You can only delete your own opportunities" });
  }

  await Opportunity.findByIdAndDelete(req.params.id);
  res.json({ message: "Opportunity deleted" });
});

module.exports = router;