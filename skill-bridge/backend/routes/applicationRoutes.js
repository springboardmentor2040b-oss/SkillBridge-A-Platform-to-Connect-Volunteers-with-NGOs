import express from "express";
import {
  applyForOpportunity,
  getApplicationsForNGO,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

export default function applicationRoutes(authMiddleware) {
  const router = express.Router();

  router.post("/apply/:opportunityId", authMiddleware, applyForOpportunity);
  router.get("/ngo", authMiddleware, getApplicationsForNGO);
  router.put("/:id", authMiddleware, updateApplicationStatus);

  return router;
}
