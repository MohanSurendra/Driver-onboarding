const DriverProfile = require('../models/DriverProfile');
const User = require('../models/User');

// Step 1 - Save Basic Driver Info
exports.addDriverBasicInfo = async (req, res) => {
  try {
    const { firstName, lastName, phone, dob, gender } = req.body;
    const userId = req.userId;
    console.log('Received userId in controller:', req.userId);

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (!firstName || !lastName || !phone || !dob || !gender)
      return res.status(400).json({ message: 'All fields are required' });

    const existing = await DriverProfile.findOne({ userId });
    if (existing)
      return res.status(400).json({ message: 'Info already submitted' });

    const driver = new DriverProfile({
      userId,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: user.email,
      contactNumber: phone,
      dob,
      gender,
      status: 'pending',
    });

    await driver.save();
    res.status(201).json({ message: 'Basic info saved successfully', driver });
  } catch (err) {
    console.error('Error saving basic info:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 2 - Save Aadhaar & PAN
exports.saveAadhaarPan = async (req, res) => {
  try {
    const { aadhar, pan } = req.body;
    const userId = req.userId;

    if (!aadhar || !pan) {
      return res.status(400).json({ message: 'Aadhaar and PAN are required' });
    }

    const profile = await DriverProfile.findOne({ userId });
    if (!profile)
      return res.status(404).json({ message: 'Basic info not submitted yet' });

    profile.aadhar = aadhar;
    profile.pan = pan;

    await profile.save();
    res.status(200).json({ message: 'Aadhaar & PAN saved', profile });
  } catch (err) {
    console.error('Error saving Aadhaar/PAN:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 3 - Save Vehicle Info
exports.saveVehicleInfo = async (req, res) => {
  try {
    const { license, experience, vehicleType, vehicleNumber } = req.body;
    const userId = req.userId;

    if (!license || !experience || !vehicleType || !vehicleNumber) {
      return res.status(400).json({ message: 'All vehicle fields are required' });
    }

    const profile = await DriverProfile.findOne({ userId });
    if (!profile)
      return res.status(404).json({ message: 'Profile not found' });

    profile.license = license;
    profile.experience = experience;
    profile.vehicleType = vehicleType;
    profile.vehicleNumber = vehicleNumber;

    await profile.save();
    res.status(200).json({ message: 'Vehicle info saved', profile });
  } catch (err) {
    console.error('Error saving vehicle info:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 4 - Upload Documents
exports.uploadDriverDocuments = async (req, res) => {
  try {
    const driverId = req.params.id;
    const files = req.files;

    if (
      !files?.aadharImage?.[0] ||
      !files?.panImage?.[0] ||
      !files?.licenseImage?.[0] ||
      !files?.insuranceImage?.[0] ||
      !files?.pollutionImage?.[0]
    ) {
      return res.status(400).json({ message: 'All documents are required' });
    }

    const driver = await DriverProfile.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.documents = {
      aadharImage: files.aadharImage[0].path,
      panImage: files.panImage[0].path,
      licenseImage: files.licenseImage[0].path,
      insuranceImage: files.insuranceImage[0].path,
      pollutionImage: files.pollutionImage[0].path,
    };

    driver.status = 'pending';
    await driver.save();

    res.status(200).json({ message: 'Documents uploaded', driver });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Step 5 - Final Submission
exports.finalizeDriverProfile = async (req, res) => {
  try {
    const driver = await DriverProfile.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    if (driver.status !== 'pending') {
      return res.status(400).json({ message: 'Profile is already finalized' });
    }

    driver.status = 'pending';
    driver.submittedAt = new Date();

    await driver.save();
    res.status(200).json({ message: 'Driver profile submitted successfully', driver });
  } catch (err) {
    console.error('Final submission error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Driver Profile
exports.getDriverProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const profile = await DriverProfile.findById(id);

    if (!profile)
      return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile
exports.updateDriverProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedProfile = await DriverProfile.findOneAndUpdate(
      { userId: req.userId },
      updates,
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json({ message: 'Profile updated', updatedProfile });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
  try {
    const deleted = await DriverProfile.findOneAndDelete({ userId: req.userId });
    if (!deleted)
      return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json({ message: 'Profile deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      message: `Welcome ${user?.name || 'User'} to the Driver Dashboard`,
      userId: req.userId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Profiles
exports.getAllDriverProfiles = async (req, res) => {
  try {
    const profiles = await DriverProfile.find();
    res.status(200).json(profiles);
  } catch (err) {
    console.error('Error fetching profiles:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Driver Status
exports.updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const driver = await DriverProfile.findById(req.params.id);

    if (!driver)
      return res.status(404).json({ message: 'Driver not found' });

    if (!['pending', 'approved', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    driver.status = status;
    await driver.save();

    res.status(200).json({ message: 'Status updated', driver });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
