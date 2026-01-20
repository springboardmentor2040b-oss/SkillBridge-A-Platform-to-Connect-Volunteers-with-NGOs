import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { socketAuth } from "./sockets/socketAuth.js";
import { messageSocket } from "./sockets/messageSocket.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


console.log("🔥 SERVER.JS FILE IS RUNNING");
dotenv.config();
const PORT = process.env.PORT || 8000;
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use("/api/opportunities", opportunityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("SkillBridge Backend Running");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  },
});
app.set("io", io);
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});
io.use(socketAuth);

io.on("connection", (socket) => {
  
  console.log("User:", socket.user);

  messageSocket(io, socket);
  if (socket.user && socket.user.id) {
    socket.join(socket.user.id);
  }

  socket.on("disconnect", () => {
    
  });
});