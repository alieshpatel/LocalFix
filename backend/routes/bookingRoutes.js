const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createBooking,
  acceptBooking,
  updateStatus,
  getMyBookings,
  payBooking,
  getBookingById,
  confirmQuote
} = require("../controllers/bookingController");

router.post("/", auth, createBooking);
router.get("/", auth, getMyBookings);
router.get("/:id", auth, getBookingById);
router.put("/:id/accept", auth, acceptBooking);
router.put("/:id/confirm-quote", auth, confirmQuote);
router.put("/:id/status", auth, updateStatus);
router.put("/:id/pay", auth, payBooking);

module.exports = router;