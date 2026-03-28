const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createPaymentIntent, confirmPayment } = require("../controllers/paymentController");

router.post("/create-intent", auth, createPaymentIntent);
router.post("/confirm", auth, confirmPayment);

module.exports = router;
