import express from "express";
import {
  applyToOpportunity,
  hasApplied,
} from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import volunteerOnly from "../middleware/volunteerOnly.js";

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

export default router;
