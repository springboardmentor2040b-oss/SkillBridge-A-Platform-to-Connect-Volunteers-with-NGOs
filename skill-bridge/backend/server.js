import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import opportunityRoutes from "./routes/OpportunityRoutes.js";

dotenv.config();
const app = express();

/* ===================== CORS ===================== */
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ===================== DB ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🚀"))
  .catch((err) => console.error("MongoDB error:", err));

/* ===================== USER MODEL ===================== */
const userSchema = new mongoose.Schema(
  {
    username: String,
    fullName: String,
    email: String,
    password: String,
    userType: { type: String, enum: ["NGO", "Volunteer"] },
    location: String,
    organizationName: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

/* ===================== OPPORTUNITY MODEL ===================== */
const opportunitySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    skills: [String],
    duration: String,
    location: String,
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Opportunity =
  mongoose.models.Opportunity ||
  mongoose.model("Opportunity", opportunitySchema);

/* ===================== APPLICATION MODEL ===================== */
const applicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

/* ===================== AUTH MIDDLEWARE ===================== */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ===================== ROLE MIDDLEWARE (NGO ONLY) ===================== */
const ngoOnly = (req, res, next) => {
  if (req.user.role !== "NGO") {
    return res.status(403).json({ message: "NGO access only" });
  }
  next();
};

/* ===================== APPLY OPPORTUNITY ===================== */
app.post("/api/applications/apply", authMiddleware, async (req, res) => {
  try {
    const { opportunityId } = req.body;
    const userId = req.user.id;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (opportunity.status === "CLOSED") {
      return res.status(400).json({ message: "This opportunity is closed" });
    }

    if (opportunity.createdBy.toString() === userId) {
      return res
        .status(403)
        .json({ message: "You cannot apply to your own opportunity" });
    }

    const alreadyApplied = await Application.findOne({
      opportunity: opportunityId,
      volunteer: userId,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You already applied for this opportunity" });
    }

    const application = await Application.create({
      opportunity: opportunityId,
      volunteer: userId,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Failed to apply opportunity" });
  }
});

/* ===================== AUTH ROUTES ===================== */
app.post("/api/auth/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.create({ ...req.body, password: hashedPassword });
  res.json({ message: "Signup successful" });
});

app.post("/api/auth/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, user });
});

/* ===================== OPPORTUNITY ROUTES ===================== */
app.use(
  "/api/opportunities",
  opportunityRoutes(authMiddleware, ngoOnly)
);

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
