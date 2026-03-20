const Booking = require("../models/Booking");
const User = require("../models/User");

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, address, price, scheduledDate } = req.body;

    const customer = await User.findOne({ clerkId: req.auth.userId });
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    // Optional: assign provider later, or assign dummy if 'no provider available'
    const booking = await Booking.create({
      customer: customer._id,
      service: serviceId,
      scheduledDate,
      address,
      price,
      status: "pending"
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept booking
exports.acceptBooking = async (req, res) => {
  try {
    const provider = await User.findOne({ clerkId: req.auth.userId });
    if (!provider || provider.role !== "provider") return res.status(403).json({ error: "Only providers can accept" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    
    booking.provider = provider._id;
    booking.status = "accepted";
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my bookings 
exports.getMyBookings = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    let filter = { customer: user._id };
    if (user.role === "provider") {
      filter = { provider: user._id }; // or $or if we want them to fetch all pending
    }

    const bookings = await Booking.find(filter)
      .populate("service")
      .populate("customer", "name phone avatar")
      .populate("provider", "name phone avatar reliabilityScore")
      .sort({ createdAt: -1 });

    // If provider, also fetch "pending" bookings that they could accept
    if (user.role === "provider") {
      const availableJobs = await Booking.find({ status: "pending" })
        .populate("service")
        .populate("customer", "name phone avatar");
      
      return res.json({ myJobs: bookings, availableJobs });
    }

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};