import express from "express";
import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  getActiveOpportunitiesCount,
} from "../controllers/opportunityController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ngoOnly from "../middleware/ngoOnly.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getOpportunities);

router.get("/test", (req, res) => {
  res.send("opportunity routes working");
});
/* NGO ONLY – SPECIFIC ROUTES FIRST */
router.get(
  "/ngo/active-count",
  authMiddleware,
  ngoOnly,
  getActiveOpportunitiesCount
);

/* GENERIC PARAM ROUTE LAST */
router.get("/:id", getOpportunityById);

/* NGO CRUD */
router.post("/", authMiddleware, ngoOnly, createOpportunity);
router.put("/:id", authMiddleware, ngoOnly, updateOpportunity);
router.delete("/:id", authMiddleware, ngoOnly, deleteOpportunity);



export default router;
