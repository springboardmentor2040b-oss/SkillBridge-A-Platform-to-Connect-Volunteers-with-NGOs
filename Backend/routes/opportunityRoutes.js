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
      ...req.body,
      ngo: user._id, // link opportunity to NGO
      skills: req.body.requiredSkills || [], // fix for your frontend field
    });
    res.status(201).json(opportunity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ message: err.message });
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