// const ngoOnly = (req, res, next) => {
//   if (req.userData.role !== "NGO") {
//     return res
//       .status(403)
//       .json({ message: "Access denied. NGO only." });
//   }
//   next();
// };

// export default ngoOnly;

const ngoOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "ngo") {
    return res.status(403).json({
      message: "Access denied. Only NGOs can create opportunities.",
    });
  }

  next();
};

export default ngoOnly;
