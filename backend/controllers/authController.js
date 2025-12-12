import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, email, password, fullName, organization, location, description, website } = req.body;

    // Email exists check
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      organization,
      location,
      description,
      website
    });

    await newUser.save();

    res.json({ message: "Signup Successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email or Password" });

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });

    // Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login Successful",
      token,
      user: {
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
