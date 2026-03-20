const User = require("../models/User");

// Sync or save user after login
exports.syncUser = async (req, res) => {
  try {
    const { id: clerkId, firstName, lastName, emailAddresses, imageUrl } = req.body;
    
    const email = emailAddresses && emailAddresses.length > 0 ? emailAddresses[0].emailAddress : "";
    const name = `${firstName || ""} ${lastName || ""}`.trim() || "User";

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({ 
        clerkId, 
        name, 
        email, 
        avatar: imageUrl || "",
        role: "pending" 
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findOneAndUpdate(
      { clerkId: req.auth.userId },
      { $set: updates },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" }).select("-clerkId");
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};