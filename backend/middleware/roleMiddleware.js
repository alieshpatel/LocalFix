const User = require("../models/User");

const checkRole = (role) => async (req, res, next) => {
  const user = await User.findOne({ clerkId: req.auth.userId });

  if (!user || user.role !== role) {
    return res.status(403).json({ message: "Access Denied" });
  }

  req.user = user;
  next();
};

module.exports = checkRole;