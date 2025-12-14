const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/Auth");
const bcrypt = require("bcryptjs");

/**
 * GET LOGGED-IN USER PROFILE
 */
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/**
 * PATCH PROFILE (PARTIAL UPDATE)
 */
router.patch("/profile", auth, async (req, res) => {
  try {
    const allowedFields = [
      "fullName",
      "skills",
      "location",
      "bio",
      "organisationName",
      "organizationUrl",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
});

/**
 * CHANGE PASSWORD
 */
router.put("/change-password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
});

module.exports = router;
