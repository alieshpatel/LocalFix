const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { 
  syncUser, 
  getCurrentUser, 
  updateProfile, 
  getProviders, 
  setRole,
  getProviderProfile,
  updateProviderProfile,
  setAvailability,
  generateTestData
} = require("../controllers/userController");

router.post("/sync", syncUser); // Called from frontend after login
router.put("/role", setRole); // Set role during onboarding, bypassing auth middleware due to missing keys

router.get("/provider-profile/:clerkId", getProviderProfile);
router.put("/provider-profile", updateProviderProfile);

router.get("/me", auth, getCurrentUser);
router.post("/seed-test-data", auth, generateTestData);
router.put("/profile", auth, updateProfile);
router.put("/availability", auth, setAvailability);
router.get("/providers", getProviders);

module.exports = router;