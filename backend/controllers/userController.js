const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
};