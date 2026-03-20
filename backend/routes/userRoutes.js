const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { syncUser, getCurrentUser, updateProfile, getProviders } = require("../controllers/userController");

router.post("/sync", syncUser); // Called from frontend after login
router.get("/me", auth, getCurrentUser);
router.put("/profile", auth, updateProfile);
router.get("/providers", getProviders);

module.exports = router;