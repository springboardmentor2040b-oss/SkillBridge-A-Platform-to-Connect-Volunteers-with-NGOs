import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    let token = authHeader;

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id || decoded._id,
      userType:
        decoded.userType === "NGO"
          ? "NGO"
          : decoded.userType === "Volunteer"
          ? "Volunteer"
          : decoded.role || null,
      email: decoded.email || null,
    };

    if (!req.user.id) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    next();
  } catch (err) {
    console.error("JWT error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, login again" });
    }

    return res.status(401).json({ message: "Unauthorized token" });
  }
};

export const ngoOnly = (req, res, next) => {
  if (req.user?.userType !== "NGO") {
    return res
      .status(403)
      .json({ message: "Access denied. NGO users only." });
  }
  next();
};
