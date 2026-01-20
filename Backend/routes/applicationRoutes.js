const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");
const User = require("../models/User");
const Message = require("../models/Message");
const auth = require("../middleware/Auth");


router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can apply for opportunities" });
    }

    const { opportunityId, coverLetter } = req.body;

    // Check if opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if opportunity is open
    if (opportunity.status !== "Open") {
      return res.status(400).json({ message: "This opportunity is not open for applications" });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      opportunity: opportunityId,
      volunteer: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this opportunity" });
    }

    // Create application
    const application = await Application.create({
      opportunity: opportunityId,
      volunteer: req.user.id,
      coverLetter: coverLetter || "",
      status: "pending"
    });

    // Add applicant to opportunity's applicants array
    await Opportunity.findByIdAndUpdate(
      opportunityId,
      { $addToSet: { applicants: req.user.id } }
    );

    const populatedApplication = await Application.findById(application._id)
      .populate('opportunity', 'title description location')
      .populate('volunteer', 'fullName email skills');

    res.status(201).json({
      message: "Application submitted successfully",
      application: populatedApplication
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already applied for this opportunity" });
    }
    res.status(500).json({ message: err.message });
  }
});

// Get all applications for a volunteer
router.get("/volunteer", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({ volunteer: req.user.id })
      .populate('opportunity', 'title description location duration status')
      .populate({
        path: 'opportunity',
        populate: {
          path: 'ngo',
          select: 'organizationName fullName email'
        }
      })
      .sort({ createdAt: -1 });

    // Add unread message count and last message info for each application
    const applicationsWithUnread = await Promise.all(applications.map(async (app) => {
      const lastMessage = await Message.findOne({
        applicationId: app._id,
        hiddenBy: { $ne: new mongoose.Types.ObjectId(req.user.id) }
      }).sort({ createdAt: -1 });

      const unreadCount = await Message.countDocuments({
        applicationId: app._id,
        senderId: { $ne: new mongoose.Types.ObjectId(req.user.id) },
        read: false,
        hiddenBy: { $ne: new mongoose.Types.ObjectId(req.user.id) }
      });

      return {
        ...app.toObject(),
        unreadCount,
        lastMessageText: lastMessage ? lastMessage.text : null,
        lastMessageTime: lastMessage ? lastMessage.createdAt : null
      };
    }));

    res.json(applicationsWithUnread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all applications for an NGO's opportunities
router.get("/ngo", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "ngo") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find all opportunities created by this NGO
    const opportunities = await Opportunity.find({ ngo: req.user.id });
    const opportunityIds = opportunities.map(opp => opp._id);

    // Find all applications for these opportunities
    const applications = await Application.find({
      opportunity: { $in: opportunityIds }
    })
      .populate('opportunity', 'title description location duration status skills')
      .populate('volunteer', 'fullName email skills location bio')
      .sort({ createdAt: -1 });

    // Add unread message count and last message info for each application
    const applicationsWithUnread = await Promise.all(applications.map(async (app) => {
      const lastMessage = await Message.findOne({
        applicationId: app._id,
        hiddenBy: { $ne: new mongoose.Types.ObjectId(req.user.id) }
      }).sort({ createdAt: -1 });

      const unreadCount = await Message.countDocuments({
        applicationId: app._id,
        senderId: { $ne: new mongoose.Types.ObjectId(req.user.id) },
        read: false,
        hiddenBy: { $ne: new mongoose.Types.ObjectId(req.user.id) }
      });

      return {
        ...app.toObject(),
        unreadCount,
        lastMessageText: lastMessage ? lastMessage.text : null,
        lastMessageTime: lastMessage ? lastMessage.createdAt : null
      };
    }));

    res.json(applicationsWithUnread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applications for a specific opportunity (NGO only)
router.get("/opportunity/:opportunityId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can view opportunity applications" });
    }

    const opportunity = await Opportunity.findById(req.params.opportunityId);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if the NGO owns this opportunity
    if (opportunity.ngo.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You can only view applications for your own opportunities" });
    }

    const applications = await Application.find({
      opportunity: req.params.opportunityId
    })
      .populate('volunteer', 'fullName email skills location bio')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update application status (NGO only - accept/reject)
router.patch("/:applicationId/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGOs can update application status" });
    }

    const { status } = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.applicationId)
      .populate('opportunity');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the NGO owns the opportunity
    if (application.opportunity.ngo.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You can only update applications for your own opportunities" });
    }

    application.status = status;
    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate('opportunity', 'title description location')
      .populate('volunteer', 'fullName email skills');

    res.json({
      message: "Application status updated successfully",
      application: updatedApplication
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete/Withdraw application (Volunteer only)
router.delete("/:applicationId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can withdraw applications" });
    }

    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the volunteer owns this application
    if (application.volunteer.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You can only withdraw your own applications" });
    }

    // Remove applicant from opportunity's applicants array
    await Opportunity.findByIdAndUpdate(
      application.opportunity,
      { $pull: { applicants: req.user.id } }
    );

    await Application.findByIdAndDelete(req.params.applicationId);

    res.json({ message: "Application withdrawn successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single application details
router.get("/:applicationId", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('opportunity', 'title description location duration status')
      .populate('volunteer', 'fullName email skills location bio')
      .populate({
        path: 'opportunity',
        populate: {
          path: 'ngo',
          select: 'organizationName fullName email'
        }
      });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const user = await User.findById(req.user.id);

    // Check if user has permission to view this application
    const isVolunteer = application.volunteer._id.toString() === req.user.id;
    const isNGO = application.opportunity.ngo._id.toString() === req.user.id;

    if (!isVolunteer && !isNGO) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;