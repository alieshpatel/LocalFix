const express = require("express");
const router = express.Router();

const { getAllServices, createService } = require("../controllers/serviceController");
// We can protect createService if we want
router.get("/", getAllServices);
router.post("/", createService); // In real app: insert admin middleware here

module.exports = router;
