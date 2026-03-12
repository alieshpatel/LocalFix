const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createService,
  getServices
} = require("../controllers/serviceController");

router.post("/",protect,createService);
router.get("/",protect,getServices);

module.exports = router;