const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// socket
const http = require("http");
const { Server } = require("socket.io");

// routes and models
const UserModel = require("./models/User");
const opportunityRoutes = require("./routes/opportunityRoutes");
const userRoutes = require("./routes/userRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const MessageRoutes = require("./routes/MessageRoutes");
const messageRoutes = require("./routes/MessageRoutes");
const ApplicationModel = require("./models/Application");


const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/messages", messageRoutes);



//  DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// AUTH ROUTES
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

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      username,
      email,
      password: hashedPassword,
      fullName,
      role,
      location,
      bio,
    };

    if (role === "volunteer") {
      userData.skills = skills || [];
    }

    if (role === "ngo") {
      userData.organizationName = organizationName || "";
      userData.organizationUrl = organizationUrl || "";
    }

    const user = await UserModel.create(userData);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API ROUTES 
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);


// SOCKET.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-chat", ({ applicationId }) => {
    if (applicationId) {
      socket.join(applicationId);
      console.log(`User ${socket.id} joined room: ${applicationId}`);
    }
  });

  socket.on("leave-chat", ({ applicationId }) => {
    if (applicationId) {
      socket.leave(applicationId);
      console.log(`User ${socket.id} left room: ${applicationId}`);
    }
  });

  socket.on("join-notifications", async ({ userId }) => {
    if (userId) {
      socket.join(`notifications-${userId}`);
      console.log(`User ${userId} joined notifications room`);
    }
  });

  socket.on("leave-notifications", ({ userId }) => {
    if (userId) {
      socket.leave(`notifications-${userId}`);
      console.log(`User ${userId} left notifications room`);
    }
  });

  socket.on("send-message", async (data) => {
    // send ONLY to the other user in this application chat
    if (data.applicationId) {
      socket.to(data.applicationId).emit("receive-message", data);
      
      // Get the recipient user and send notification
      try {
        const application = await ApplicationModel.findById(data.applicationId)
          .populate({
            path: 'opportunity',
            populate: { path: 'ngo', select: 'fullName' }
          })
          .populate('volunteer', 'fullName');
        
        if (application && application.opportunity && application.opportunity.ngo && application.volunteer) {
          // Determine the recipient
          const senderId = data.senderId;
          const ngoId = application.opportunity.ngo._id.toString();
          const volunteerId = application.volunteer._id.toString();
          
          const isSenderNGO = ngoId === senderId;
          const recipientId = isSenderNGO ? volunteerId : ngoId;
          const senderName = isSenderNGO 
            ? application.opportunity.ngo.fullName 
            : application.volunteer.fullName;
          
          // Send notification to recipient
          socket.to(`notifications-${recipientId}`).emit("new-notification", {
            applicationId: data.applicationId,
            senderId,
            recipientId,
            senderName,
            text: data.text,
            createdAt: new Date()
          });
          
          console.log(`Notification sent from ${senderName} to ${recipientId}`);
        } else {
          console.log('Application or users not found:', { application });
        }
      } catch (err) {
        console.error("Error sending notification:", err);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


//SERVER 
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
