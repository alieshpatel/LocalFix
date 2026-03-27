const User = require("../models/User");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Invoice = require("../models/Invoice");
const Review = require("../models/Review");

// Sync or save user after login
exports.syncUser = async (req, res) => {
  try {
    const { id: clerkId, firstName, lastName, emailAddresses, imageUrl } = req.body;
    
    // Auto-generate email placeholder if missing to prevent duplicate key constraint on empty string
    const email = emailAddresses && emailAddresses.length > 0 ? emailAddresses[0].emailAddress : `${clerkId}@localfix.placeholder.com`;
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
    const filter = { role: "provider" };

    // Filter by online status
    if (req.query.online === "true") {
      filter.isAvailable = true;
    }

    // Filter by skill keyword (case-insensitive)
    if (req.query.skill) {
      filter.skills = { $elemMatch: { $regex: req.query.skill, $options: "i" } };
    }

    const providers = await User.find(filter).select("-clerkId");
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setRole = async (req, res) => {
  try {
    const { clerkId, role } = req.body;
    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: { role } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const user = await User.findOneAndUpdate(
      { clerkId: req.auth.userId },
      { $set: { isAvailable } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProviderProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId });
    if (!user) return res.status(404).json({ error: "Provider not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProviderProfile = async (req, res) => {
  try {
    const { clerkId, bio, hourlyRate, skills, experienceYears } = req.body;
    
    if (!clerkId) return res.status(400).json({ error: "Missing clerkId" });

    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: { bio, hourlyRate, skills, experienceYears } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateTestData = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    let service = await Service.findOne();
    if (!service) {
      service = await Service.create({ name: "Dummy Repair", category: "General", description: "Test", basePrice: 50 });
    }

    if (user.role === "customer") {
      let dummyProvider = await User.findOne({ email: "dummyprovider@localfix.com" });
      if (!dummyProvider) {
        dummyProvider = await User.create({
          clerkId: "dummy_provider_" + Date.now(),
          name: "Pro Fixer John",
          email: "dummyprovider@localfix.com",
          role: "provider",
          bio: "Expert with 10 years experience",
          reliabilityScore: 4.8,
          totalReviews: 12
        });
      }

      // Create a completed booking and invoice
      const b1 = await Booking.create({
        customer: user._id,
        provider: dummyProvider._id,
        service: service._id,
        scheduledDate: new Date(),
        address: "123 Test Street",
        price: 150,
        status: "completed",
        paymentStatus: "pending"
      });

      await Invoice.create({
        booking: b1._id,
        customer: user._id,
        provider: dummyProvider._id,
        amount: 165,
        breakdown: [{ description: "Base", cost: 150 }, { description: "Tax", cost: 15 }]
      });

      // Create a pending booking
      await Booking.create({
        customer: user._id,
        service: service._id,
        scheduledDate: new Date(Date.now() + 86400000),
        address: "456 Future Ave",
        price: 80,
        status: "pending"
      });

      res.json({ message: "Customer test data generated!" });
    } else {
      let dummyCustomer = await User.findOne({ email: "dummycust@localfix.com" });
      if (!dummyCustomer) {
        dummyCustomer = await User.create({
          clerkId: "dummy_cust_" + Date.now(),
          name: "Alice Smith",
          email: "dummycust@localfix.com",
          role: "customer"
        });
      }

      // Create a pending booking for provider to accept
      await Booking.create({
        customer: dummyCustomer._id,
        service: service._id,
        scheduledDate: new Date(Date.now() + 86400000),
        address: "789 Client Blvd",
        price: 120,
        status: "pending"
      });

      // Create an active job
      await Booking.create({
        customer: dummyCustomer._id,
        provider: user._id,
        service: service._id,
        scheduledDate: new Date(),
        address: "321 Active Way",
        price: 90,
        status: "accepted"
      });

      res.json({ message: "Provider test data generated!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};