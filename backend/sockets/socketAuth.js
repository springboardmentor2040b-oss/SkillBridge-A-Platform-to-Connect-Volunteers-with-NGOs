import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
};
