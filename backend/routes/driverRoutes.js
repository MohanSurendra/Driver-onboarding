const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  addDriverBasicInfo,
  saveAadhaarPan,
  saveVehicleInfo,
  getDriverProfile,
  updateDriverProfile,
  getDashboard,
  getAllDriverProfiles,
  deleteProfile,
  uploadDriverDocuments,
  updateDriverStatus,
  finalizeDriverProfile,
} = require('../controllers/driverController');

const DriverProfile = require('../models/DriverProfile'); 
const { protect } = require('../middleware/authMiddleware');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});

const upload = multer({ storage });

// Step 1 - Basic Info
router.post('/basic-info', protect, addDriverBasicInfo);

// Step 2 - Aadhaar & PAN
router.post('/aadhaar-pan', protect, saveAadhaarPan);

// Step 3 - Vehicle Info
router.post('/vehicle-info', protect, saveVehicleInfo);

// Step 4 - Upload Documents
router.post(
  '/upload-docs/:id',
  protect,
  upload.fields([
    { name: 'aadharImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'insuranceImage', maxCount: 1 },
    { name: 'pollutionImage', maxCount: 1 },
  ]),
  uploadDriverDocuments
);

// Step 5 - Finalize Profile
router.get('/profile/:id', getDriverProfile);
router.post('/final-submit/:id', protect, finalizeDriverProfile);

// Profile Management
router.post('/profile', protect);
router.get('/profile', protect, getDriverProfile);
router.put('/profile', protect, updateDriverProfile);
router.delete('/profile', protect, deleteProfile);

// Admin Routes
router.put('/status/:id', protect, updateDriverStatus);
router.get('/dashboard', protect, getDashboard);
router.get('/all-profiles', protect, getAllDriverProfiles);

// Check Driver Status
router.post('/check-status', async (req, res) => {
  const { email } = req.body;

  try {
    const driver = await DriverProfile.findOne({ email });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    res.status(200).json({ status: driver.status });
  } catch (err) {
    console.error('Status check error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
