const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const Invoice = require("../models/Invoice");
const User = require("../models/User");

// Create a PaymentIntent — called just before showing the payment form
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.paymentStatus === "paid") return res.status(400).json({ error: "Already paid" });

    const totalCents = Math.round(booking.price * 1.1 * 100); // price + 10% tax, in cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "usd",
      metadata: { bookingId: bookingId.toString() },
      description: `LocalFix booking payment — Job #${bookingId.toString().slice(-8).toUpperCase()}`,
    });

    res.json({ clientSecret: paymentIntent.client_secret, amount: totalCents });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Confirm payment after successful Stripe charge
exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;

    // Optional: verify with Stripe that it actually succeeded
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment has not succeeded" });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: "paid" },
      { new: true }
    );
    await Invoice.findOneAndUpdate(
      { booking: bookingId },
      { status: "paid", paidAt: new Date() }
    );

    res.json({ success: true, booking });
  } catch (error) {
    console.error("Confirm payment error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
