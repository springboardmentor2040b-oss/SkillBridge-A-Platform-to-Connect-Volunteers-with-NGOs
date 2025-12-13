import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();
const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cors()); // allow requests from React

// Logging middleware
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// ===== Connect to MongoDB =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully 🚀");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB();

// ===== User Schema =====
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: String,
  dateOfBirth: String,
  phoneNumber: String,
  city: String,
  place: String,
  pinCode: String,
});

const User = mongoose.model("User", userSchema);

// ===== JWT Middleware =====
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ===== Routes =====

// Home
app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

// Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      gender,
      dateOfBirth,
      phoneNumber,
      city,
      place,
      pinCode,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
      phoneNumber,
      city,
      place,
      pinCode,
    });

    await newUser.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Protected Route
app.get("/api/members", verifyToken, async (req, res) => {
  try {
    const members = await User.find({}, { password: 0 });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", url: req.url });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
