import express from "express";
import {
  applyToOpportunity,
  hasApplied,
  getVolunteerApplications,
  getNGOApplications,
  updateApplicationStatus,
  getApplicationStats,
  getApplicationById,
} from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import volunteerOnly from "../middleware/volunteerOnly.js";
import ngoOnly from "../middleware/ngoOnly.js"; // ADD THIS IMPORT

const router = express.Router();

/* APPLY */
router.post("/apply", authMiddleware, volunteerOnly, applyToOpportunity);

/* CHECK IF ALREADY APPLIED */
router.get(
  "/applied/:opportunityId",
  authMiddleware,
  volunteerOnly,
  hasApplied
);

/* =============================================== */
/* NEW ROUTES ADDED BELOW                         */
/* =============================================== */

/* GET VOLUNTEER'S APPLICATIONS */
router.get(
  "/my-applications",
  authMiddleware,
  volunteerOnly,
  getVolunteerApplications
);

/* GET NGO'S APPLICATIONS */
router.get("/ngo-applications", authMiddleware, ngoOnly, getNGOApplications);

/* UPDATE APPLICATION STATUS (Accept/Reject) */
router.put("/:id/status", authMiddleware, ngoOnly, updateApplicationStatus);

/* GET APPLICATION STATISTICS */
router.get("/stats", authMiddleware, getApplicationStats);

/* GET SINGLE APPLICATION BY ID */
router.get("/:id", authMiddleware, getApplicationById);

export default router;
