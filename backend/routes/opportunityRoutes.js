import express from "express";
import {
  createOpportunity,
  getAllOpportunities,
  getOpenOpportunities,
  getClosedOpportunities,  
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  getMyOpportunities
} from "../controllers/opportunityController.js";
import { protect } from "../middleware/authMiddleware.js";
import { filterOpportunities } from "../controllers/opportunityController.js";

const router = express.Router();

router.post("/", protect, createOpportunity);        
router.get("/", getAllOpportunities);                
router.get("/open", getOpenOpportunities);           
router.get("/closed", getClosedOpportunities);       
router.get("/my", protect, getMyOpportunities);      
router.get("/:id", getOpportunityById);              
router.patch("/:id", protect, updateOpportunity);   
router.delete("/:id", protect, deleteOpportunity);   
router.post("/filter/search", filterOpportunities);

export default router;
