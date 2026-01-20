import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";

export const applyForOpportunity = async (req,res) => {
    try{
        if(req.user.role !== "volunteer"){
            return res.status(403).json({ message: "Only volunteers can apply for opportunities"})
        }
        const { opportunityId} = req.body;

        const opportunity = await Opportunity.findById(opportunityId);

        if(!opportunity){
            return res.status(404).json({ message:"Opportunity not found" });
        }
        if(opportunity.status !== "open"){
            return res.status(400).json({ message:"Cannot apply to a closed opportunity" });
        }
        const alreadyApplied = await Application.findOne({
            opportunity_id: opportunityId,
            volunteer_id: req.user._id,
        });

        if(alreadyApplied){
            return res.status(400).json({ message:"You have already applied for this opportunity" });
        }
        const application  = await Application.create({
            opportunity_id: opportunityId,
            volunteer_id: req.user._id,
        });
        res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error){
        res.status(500).json({ message: "Server error"});
    }
};

export const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find({
      volunteer_id: req.user._id,
    })
      .populate({
        path: "opportunity_id",
        populate: {
          path: "ngo_id",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      _id: app._id,
      status: app.status,
      createdAt: app.createdAt,
      opportunity_title: app.opportunity_id?.title,
      ngo_name: app.opportunity_id?.ngo_id?.name,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
