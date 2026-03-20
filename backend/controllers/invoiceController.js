const Invoice = require("../models/Invoice");
const Booking = require("../models/Booking");

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
    // Assuming we pass user's db ID in the token or we lookup using clerkId first.
    // For simplicity, we'll fetch via a query parameter or from a controller that knows the user.
    res.status(200).json({ message: "Not fully implemented yet" });
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

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
