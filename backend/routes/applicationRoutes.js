import express from "express";
import mongoose from "mongoose";
import Application from "../models/Application.js";
import {
  applyToOpportunity,
  getMyApplicationsWithStatus,
  getApplicationsForNGO,
  updateApplicationStatus,
  getApplicationsForDashboard,
} from "../controllers/applicationController.js";
import { authMiddleware, ngoOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   DASHBOARD (NGO + VOLUNTEER)
========================= */
router.get("/", authMiddleware, getApplicationsForDashboard);

/* =========================
   VOLUNTEER ROUTES
========================= */
router.post("/apply", authMiddleware, applyToOpportunity);
router.get("/my-status", authMiddleware, getMyApplicationsWithStatus);

/* =========================
   NGO ROUTES
========================= */
router.get("/ngo", authMiddleware, ngoOnly, getApplicationsForNGO);
router.put("/:id/status", authMiddleware, ngoOnly, updateApplicationStatus);

/* =========================
   GET SINGLE APPLICATION
   Safe with ObjectId validation
========================= */
router.get("/view/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await Application.findById(id)
      .populate("opportunity", "title")
      .populate("volunteer", "fullName email")
      .populate("ngo", "organizationName");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (err) {
    console.error("Fetch application error:", err);
    res.status(500).json({ message: "Failed to fetch application" });
  }
});

export default router;
