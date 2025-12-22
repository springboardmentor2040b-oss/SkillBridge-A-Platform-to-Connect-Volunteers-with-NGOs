import express from "express";
import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunityController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ngoOnly from "../middleware/ngoOnly.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getOpportunities);
router.get("/:id", getOpportunityById);

/* NGO ONLY */
router.post("/", authMiddleware, ngoOnly, createOpportunity);
router.put("/:id", authMiddleware, ngoOnly, updateOpportunity);
router.delete("/:id", authMiddleware, ngoOnly, deleteOpportunity);

export default router;
