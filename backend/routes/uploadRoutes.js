const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImage, getAuthToken } = require("../controllers/uploadController");

const upload = multer({ storage: multer.memoryStorage() });

// Get authentication parameters for client-side upload
router.get("/auth", getAuthToken);

// Server-side image upload
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
