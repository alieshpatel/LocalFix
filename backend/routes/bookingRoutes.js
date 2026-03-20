const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createBooking,
  acceptBooking,
  updateStatus,
  getMyBookings
} = require("../controllers/bookingController");

router.post("/", auth, createBooking);
router.get("/", auth, getMyBookings);
router.put("/:id/accept", auth, acceptBooking);
router.put("/:id/status", auth, updateStatus);

module.exports = router;