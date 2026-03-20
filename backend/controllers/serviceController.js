const Service = require("../models/Service");

// Get all active services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new service (Admin)
exports.createService = async (req, res) => {
  try {
    const { name, category, description, basePrice, imageUrl } = req.body;
    
    // In a real app we'd check if user is admin based on role in Clerk or DB
    const service = await Service.create({
      name, category, description, basePrice, imageUrl
    });
    
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
