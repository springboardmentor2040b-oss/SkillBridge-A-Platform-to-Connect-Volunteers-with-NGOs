import express from "express";
import mongoose from "mongoose";

const opportunityRoutes = (authMiddleware, ngoOnly) => {
  const router = express.Router();
  const Opportunity = mongoose.model("Opportunity");

  /* ================= CREATE OPPORTUNITY (NGO ONLY) ================= */
  router.post("/", authMiddleware, ngoOnly, async (req, res) => {
    try {
      const opportunity = await Opportunity.create({
        ...req.body,
        createdBy: req.user.id,
      });

      res.status(201).json(opportunity);
    } catch (err) {
      console.error("Create opportunity error:", err);
      res.status(500).json({ message: "Failed to create opportunity" });
    }
  });

  /* ================= GET ALL OPPORTUNITIES ================= */
  router.get("/", authMiddleware, async (req, res) => {
    try {
      const opportunities = await Opportunity.find()
        .populate("createdBy", "organizationName userType")
        .sort({ createdAt: -1 });

      res.json(opportunities);
    } catch (err) {
      console.error("Fetch opportunities error:", err);
      res.status(500).json({ message: "Failed to fetch opportunities" });
    }
  });

  /* ================= UPDATE OPPORTUNITY (OWNER ONLY) ================= */
  router.put("/:id", authMiddleware, async (req, res) => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);

      if (!opportunity) {
        return res.status(404).json({ message: "Opportunity not found" });
      }

      if (opportunity.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      Object.assign(opportunity, req.body);
      await opportunity.save();

      res.json(opportunity);
    } catch (err) {
      console.error("Update opportunity error:", err);
      res.status(500).json({ message: "Failed to update opportunity" });
    }
  });

  /* ================= DELETE OPPORTUNITY (OWNER ONLY) ================= */
  router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const opportunity = await Opportunity.findById(req.params.id);

      if (!opportunity) {
        return res.status(404).json({ message: "Opportunity not found" });
      }

      if (opportunity.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await opportunity.deleteOne();
      res.json({ message: "Opportunity deleted successfully" });
    } catch (err) {
      console.error("Delete opportunity error:", err);
      res.status(500).json({ message: "Failed to delete opportunity" });
    }
  });

  return router;
};

export default opportunityRoutes;
