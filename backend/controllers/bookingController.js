const Booking = require("../models/Booking");
const User = require("../models/User");
const Invoice = require("../models/Invoice");

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, address, problemDescription, problemImage, scheduledDate } = req.body;
    const customer = await User.findOne({ clerkId: req.auth.userId });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    if (customer.role !== "customer") return res.status(403).json({ error: "Only customers can create bookings" });

    const booking = await Booking.create({
      customer: customer._id,
      service: serviceId,
      scheduledDate,
      address,
      problemDescription,
      problemImage,
      provider: req.body.providerId || undefined,
      price: 0,
      status: "pending"
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("service")
      .populate("customer", "name phone avatar email")
      .populate("provider", "name phone avatar reliabilityScore totalReviews");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept booking (provider only)
exports.acceptBooking = async (req, res) => {
  try {
    const provider = await User.findOne({ clerkId: req.auth.userId });
    if (!provider || provider.role !== "provider") return res.status(403).json({ error: "Only providers can accept bookings" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status !== "pending") return res.status(400).json({ error: "Booking is not pending" });

    const { estimatedPrice } = req.body;
    if (!estimatedPrice) return res.status(400).json({ error: "Estimated price is required" });

    booking.provider = provider._id;
    booking.price = estimatedPrice;
    booking.status = "quoted";
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm quote (customer only)
exports.confirmQuote = async (req, res) => {
  try {
    const customer = await User.findOne({ clerkId: req.auth.userId });
    if (!customer || customer.role !== "customer") return res.status(403).json({ error: "Only customers can confirm quotes" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status !== "quoted") return res.status(400).json({ error: "Booking is not in quoted status" });

    booking.status = "accepted";
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update status (provider only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    let updateData = { status };

    // Only generate invoice + warranty once when marking completed
    if (status === "completed" && booking.status !== "completed") {
      const warrantyDate = new Date();
      warrantyDate.setDate(warrantyDate.getDate() + 30);
      updateData.warrantyEndsAt = warrantyDate;

      // Auto-generate invoice (avoid duplicates)
      const existing = await Invoice.findOne({ booking: booking._id });
      if (!existing) {
        const tax = booking.price * 0.1;
        await Invoice.create({
          booking: booking._id,
          customer: booking.customer,
          provider: booking.provider,
          amount: booking.price + tax,
          breakdown: [
            { description: "Base Fee", cost: booking.price },
            { description: "Taxes (10%)", cost: tax }
          ]
        });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("service")
      .populate("customer", "name phone avatar")
      .populate("provider", "name phone avatar reliabilityScore");

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pay booking (customer only)
exports.payBooking = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user || user.role !== "customer") return res.status(403).json({ error: "Only customers can pay" });

    const bookingId = req.params.id;
    const booking = await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "paid" }, { new: true });
    await Invoice.findOneAndUpdate({ booking: bookingId }, { status: "paid", paidAt: new Date() });
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

    if (user.role === "provider") {
      const myJobs = await Booking.find({ 
          provider: user._id,
          status: { $ne: "pending" }
        })
        .populate("service")
        .populate("customer", "name phone avatar")
        .sort({ createdAt: -1 });

      const availableJobs = await Booking.find({ 
          status: "pending" 
        })
        .populate("service")
        .populate("customer", "name phone avatar")
        .sort({ createdAt: -1 });

      return res.json({ myJobs, availableJobs });
    }

    const bookings = await Booking.find({ customer: user._id })
      .populate("service")
      .populate("customer", "name phone avatar")
      .populate("provider", "name phone avatar reliabilityScore")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};