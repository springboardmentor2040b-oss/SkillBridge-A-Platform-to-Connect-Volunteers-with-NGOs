import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* SIGNUP*/
export const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      fullName,
      role,
      skills,
      organizationDescription,
    } = req.body;

    //  Role validation
    if (!role || !["Volunteer", "NGO", "volunteer", "ngo"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const normalizedRole = role.toLowerCase();

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: normalizedRole,
      skills: normalizedRole === "volunteer" ? skills : [],
      organizationDescription:
        normalizedRole === "ngo" ? organizationDescription : "",
    });

    await user.save();
    res.status(201).json({ message: "Signup Successful" });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/*  LOGIN  */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* GET PROFILE  */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/*  UPDATE PROFILE  */
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*  CHANGE PASSWORD  */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Password update failed" });
  }
};
