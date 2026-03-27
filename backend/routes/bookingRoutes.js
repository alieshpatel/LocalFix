const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createBooking,
  acceptBooking,
  updateStatus,
  getMyBookings,
  payBooking,
  getBookingById
} = require("../controllers/bookingController");

router.post("/", auth, createBooking);
router.get("/", auth, getMyBookings);
router.get("/:id", auth, getBookingById);
router.put("/:id/accept", auth, acceptBooking);
router.put("/:id/status", auth, updateStatus);
router.put("/:id/pay", auth, payBooking);

module.exports = router;