const jwt = require("jsonwebtoken");
const Driver = require("../models/DriverProfile");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "admin@gmail.com" && password === "admin123") {
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });

      return res.status(200).json({
        message: "Admin login successful",
        token,
        admin: {
          email: "admin@gmail.com",
          role: "admin"
        }
      });
    } else {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Get all drivers ---
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.status(200).json(drivers);
  } catch (err) {
    console.error("Error fetching drivers:", err);
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};

// --- Update driver status ---
exports.updateDriverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      driver: updatedDriver
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
exports.getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json(driver);
  } catch (err) {
    console.error("Error fetching driver:", err);
    res.status(500).json({ message: "Failed to fetch driver" });
  }
};
