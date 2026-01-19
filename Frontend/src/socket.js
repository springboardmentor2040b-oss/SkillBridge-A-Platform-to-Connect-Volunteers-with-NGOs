import { io } from "socket.io-client";

// connection 
const socket = io("http://localhost:4001", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Notification events
export const joinNotifications = (userId) => {
  socket.emit("join-notifications", { userId });
};

export const leaveNotifications = (userId) => {
  socket.emit("leave-notifications", { userId });
};

export default socket;

