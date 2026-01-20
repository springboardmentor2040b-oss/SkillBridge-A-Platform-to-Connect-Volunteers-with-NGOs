import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

import opportunityRoutes from "./routes/OpportunityRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { authMiddleware, ngoOnly } from "./middleware/authMiddleware.js";

import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();

console.log("🔥 SERVER.JS IS RUNNING 🔥");


/* ===================== CORS ===================== */
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


/* ===================== TEST ROUTE ===================== */
app.get("/test", (req, res) => {
  res.send("SERVER TEST OK");
});


/* ===================== DB CONNECTION ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🚀"))
  .catch((err) => console.error("MongoDB error:", err));


/* ===================== USER MODEL ===================== */
const userSchema = new mongoose.Schema(
  {
    username: String,
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    userType: { type: String, enum: ["NGO", "Volunteer"] },
    location: String,
    organizationName: String,
    organizationDescription: String,
    websiteUrl: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);


/* ===================== CHAT MODEL (FIXED) ===================== */
const chatSchema = new mongoose.Schema(
  {
    roomId: { type: String, index: true },

    senderId: String,
    senderName: String,
    senderType: String,   // NGO / Volunteer

    ngoId: { type: String, index: true },
    volunteerId: { type: String, index: true },

    text: String,
    time: String,

    seen: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const ChatMessage =
  mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", chatSchema);


/* ===================== AUTH ROUTES ===================== */

// SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        userType: user.userType,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.password = undefined;

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});


// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.password = undefined;

    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});


/* ===================== API ROUTES ===================== */

app.use("/api/opportunities", opportunityRoutes(authMiddleware, ngoOnly));
app.use("/api/applications", applicationRoutes);


/* ============ SOCKET + CHAT ============ */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
  },
});

io.on("connection", (socket) => {

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const msg = new ChatMessage({
        roomId: data.roomId,

        senderId: data.senderId,
        senderName: data.senderName,
        senderType: data.senderType,

        ngoId: data.ngoId,
        volunteerId: data.volunteerId,

        text: data.text,
        time: data.time,
      });

      await msg.save();

      io.to(data.roomId).emit("receiveMessage", msg);

    } catch (err) {
      console.error("Socket save error:", err);
    }
  });

});


// Load chat history for a room
app.get("/api/chat/:roomId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      roomId: req.params.roomId,
    }).sort({ createdAt: 1 });   // oldest → newest

    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: "Failed to load chat" });
  }
});


// Get inbox for a user
app.get("/api/chat/user/:userId", async (req, res) => {

  try {
    const userId = req.params.userId;

    const chats = await ChatMessage.find({
      $or: [
        { ngoId: userId },
        { volunteerId: userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(chats);

  } catch (err) {
    res.status(500).json({ message: "Failed to load inbox" });
  }

});


/* ===================== START SERVER ===================== */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT} 🚀`)
);
