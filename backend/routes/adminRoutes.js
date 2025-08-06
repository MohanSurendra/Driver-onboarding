const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getAllDrivers,
  updateDriverStatus,
  getDriverById 
} = require("../controllers/adminController");

// Admin login
router.post("/login", adminLogin);

// Get all drivers
router.get("/drivers", getAllDrivers);

// Get a single driver by ID
router.get("/application/:id", getDriverById);

// Update status
router.put("/application/:id", updateDriverStatus);

module.exports = router;
