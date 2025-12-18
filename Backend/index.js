const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("./models/User");
const opportunityRoutes = require("./routes/opportunityRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Error:", err));


app.post("/api/signup", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      fullName,
      role,
      location,
      bio,
      skills,
      organizationName,
      organizationUrl,
    } = req.body;

    // Check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData = {
      username,
      email,
      password: hashedPassword,
      fullName,
      role,
      location,
      bio,
    };

    // Add role-specific fields
    if (role === "volunteer" && skills) {
      userData.skills = Array.isArray(skills) ? skills : [];
    }

    if (role === "ngo") {
      userData.organizationName = organizationName || "";
      userData.organizationUrl = organizationUrl || "";
    }

    // Create user
    const user = await UserModel.create(userData);

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.use("/api/opportunities", opportunityRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});