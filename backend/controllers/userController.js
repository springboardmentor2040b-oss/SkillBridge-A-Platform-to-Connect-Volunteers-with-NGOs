import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password?.trim();
    const role = req.body.role;

    const skills = req.body.skills;
    const location = req.body.location;
    const bio = req.body.bio;
    const organization_name = req.body.organization_name;
    const organization_description = req.body.organization_description;
    const website_url = req.body.website_url;

    console.log("REGISTER BODY:", { name, email, role });

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    if (role === "volunteer") {
      userData.skills = skills || [];
      userData.location = location || "";
      userData.bio = bio || "";
    } else if (role === "ngo") {
      userData.organization_name = organization_name || null;
      userData.organization_description = organization_description || null;
      userData.website_url = website_url || null;
      userData.location = location || "";
      userData.bio = bio || "";
    }

    const user = await User.create(userData);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  console.log("RAW LOGIN REQUEST BODY:", req.body);

  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password?.trim();

    console.log("LOGIN BODY:", { email, password });

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    console.log("USER FOUND:", user ? "YES" : "NO");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.email || req.body.role) {
      return res
        .status(400)
        .json({ message: "Email and Role cannot be updated" });
    }
    if (req.body.name) user.name = req.body.name;
    if (req.body.skills) user.skills = req.body.skills;
    if (req.body.location) user.location = req.body.location;
    if (req.body.bio) user.bio = req.body.bio;

    if (user.role === "ngo") {
      if (req.body.organization_name)
        user.organization_name = req.body.organization_name;

      if (req.body.organization_description)
        user.organization_description = req.body.organization_description;

      if (req.body.website_url) user.website_url = req.body.website_url;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
