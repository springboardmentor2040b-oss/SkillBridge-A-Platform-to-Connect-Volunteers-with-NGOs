import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (user) => {
  if (!user || socket) return;

  socket = io("http://localhost:8000", {
    auth: {
      token: localStorage.getItem("token"),
    },
  });
  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });


  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });
  
};



export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
