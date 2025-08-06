const mongoose = require('mongoose');

const driverProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },

    // Step 1: Basic Personal Info
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      match: [/^\d{10}$/, 'Contact number must be 10 digits'],
    },

    // Step 2: Profile Info
    aadhar: {
      type: String,
      match: [/^\d{12}$/, 'Aadhar must be exactly 12 digits'],
      default: '',
    },
    pan: {
      type: String,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'PAN format is invalid'],
      default: '',
    },
    license: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return v === null || (v.length >= 10 && v.length <= 20);
        },
        message: 'License number must be between 10 and 20 characters',
      },
    },
    experience: {
      type: String,
      default: '',
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Bike', 'Auto'],
      default: null,
      validate: {
        validator: function (v) {
          return v === null || ['Car', 'Bike', 'Auto'].includes(v);
        },
        message: 'Invalid vehicle type',
      },
    },
    vehicleNumber: {
      type: String,
      match: [/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/i, 'Invalid vehicle number format'],
      default: '',
    },
    documents: {
      aadharImage: { type: String, default: '' },
      panImage: { type: String, default: '' },
      licenseImage: { type: String, default: '' },
      insuranceImage: { type: String, default: '' },
      pollutionImage: { type: String, default: '' },
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

driverProfileSchema.pre('save', function (next) {
  if (!this.fullName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

const DriverProfile = mongoose.model('DriverProfile', driverProfileSchema);

module.exports = DriverProfile;
