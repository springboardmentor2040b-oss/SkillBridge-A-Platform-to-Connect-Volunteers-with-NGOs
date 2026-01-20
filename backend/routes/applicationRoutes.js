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
import { withdrawApplication } from "../controllers/applicationController.js";
import ngoOnly from "../middleware/ngoOnly.js"; 
import { getNgoApplicants } from "../controllers/applicationController.js";

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
/* GET APPLICATION STATISTICS */
router.get("/stats", authMiddleware, getApplicationStats);
router.get("/ngo-applicants", authMiddleware, getNgoApplicants);
router.get(
  "/volunteer-applications",
  authMiddleware,
  getVolunteerApplications
);
/* UPDATE APPLICATION STATUS (Accept/Reject) */
router.put("/:id/status", authMiddleware, ngoOnly, updateApplicationStatus);

/* VOLUNTEER WITHDRAW APPLICATION */
router.put(
  "/:id/withdraw",
  authMiddleware,
  volunteerOnly,
  withdrawApplication
);

/* GET SINGLE APPLICATION BY ID */
router.get("/by-id/:id", authMiddleware, getApplicationById);


export default router;
