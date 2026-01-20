import express from "express";
import {
  applyForOpportunity,
  getMyApplications,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyForOpportunity);
router.get("/my", protect, getMyApplications);

export default router;
