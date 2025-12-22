import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

console.log("🔥 SERVER.JS FILE IS RUNNING");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.get("/api/opportunities/test", (req, res) => {
  res.send("OPPORTUNITY ROUTE TEST WORKS");
});
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("SkillBridge Backend Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running on Port ${PORT}`);
});
