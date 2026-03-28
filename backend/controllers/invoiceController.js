const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Create an invoice
exports.createInvoice = async (req, res) => {
  try {
    const { bookingId, amount, breakdown } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const invoice = await Invoice.create({
      booking: bookingId,
      customer: booking.customer,
      provider: booking.provider,
      amount,
      breakdown
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get invoices for user
exports.getUserInvoices = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    let filter = { customer: user._id };

    if (user.role === "provider") {
      // Providers only see invoices that have been PAID by their customers
      filter = { provider: user._id, status: "paid" };
    }

    if (req.query.bookingId) {
      filter.booking = req.query.bookingId;
    }

    const invoices = await Invoice.find(filter)
      .populate("customer", "name avatar")
      .populate("provider", "name avatar")
      .populate("booking", "scheduledDate address")
      .sort({ paidAt: -1, createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pay invoice
exports.payInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    invoice.status = "paid";
    invoice.paidAt = new Date();
    await invoice.save();
    await Booking.findByIdAndUpdate(invoice.booking, { paymentStatus: "paid" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
