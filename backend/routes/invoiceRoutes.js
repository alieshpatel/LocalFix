const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { createInvoice, getUserInvoices, payInvoice } = require("../controllers/invoiceController");

router.post("/", auth, createInvoice);
router.get("/", auth, getUserInvoices);
router.put("/:id/pay", auth, payInvoice);

module.exports = router;
