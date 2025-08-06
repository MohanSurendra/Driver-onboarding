import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../app.css";

const DriverProfileForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    aadhar: "",
    pan: "",
    license: "",
    experience: "",
    vehicleType: "",
    vehicleNumber: "",
  });

  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("User not logged in");
      return;
    }

    if (
      formData.firstName.trim().toLowerCase() !== user.firstName.trim().toLowerCase() ||
      formData.lastName.trim().toLowerCase() !== user.lastName.trim().toLowerCase() ||
      formData.email.trim().toLowerCase() !== user.email.trim().toLowerCase()
    ) {
      setError("Entered name or email doesn't match our records.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/driver/profile",
        { aadhar: formData.aadhar, pan: formData.pan },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Step 1 submitted:", response.data);
      setCompletedSteps((prev) => ({ ...prev, 1: true }));
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Step 1 submission failed");
    }
  };

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[A-Z0-9]{8,15}$/i.test(formData.license)) {
      setError("License number must be alphanumeric and 8–15 characters long.");
      return;
    }

    if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      setError("Driving experience must be a valid non-negative number.");
      return;
    }

    if (!formData.vehicleType) {
      setError("Vehicle type must be selected.");
      return;
    }

    if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/i.test(formData.vehicleNumber)) {
      setError("Vehicle number must follow format like AB17VK1818.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/driver/profile",
        {
          license: formData.license,
          experience: formData.experience,
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("Step 2 submitted:", response.data);
      setCompletedSteps((prev) => ({ ...prev, 2: true }));
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.message || "Step 2 submission failed");
    }
  };

  return (
    <form
      onSubmit={
        step === 1
          ? handleSubmitStep1
          : step === 2
          ? handleSubmitStep2
          : undefined
      }
      className="form-container"
    >
      {error && <div className="alert alert-danger">{error}</div>}

      {step === 1 && (
        <>
          <div className="mb-3">
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="aadhar"
              className="form-control"
              placeholder="Aadhar Number"
              value={formData.aadhar}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="pan"
              className="form-control"
              placeholder="PAN Number"
              value={formData.pan}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2">Next</button>
        </>
      )}

      {step === 2 && completedSteps[1] && (
        <>
          <div className="mb-3">
            <input
              type="text"
              name="license"
              className="form-control"
              placeholder="License Number"
              value={formData.license}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="experience"
              className="form-control"
              placeholder="Driving Experience (in years)"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <select
              name="vehicleType"
              className="form-select"
              value={formData.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Auto">Auto</option>
            </select>
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="vehicleNumber"
              className="form-control"
              placeholder="Vehicle Number (e.g., KA01AB1234)"
              value={formData.vehicleNumber}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2">Next</button>
        </>
      )}

      {step === 3 && completedSteps[2] && (
        <>
          <h3 className="mt-4 mb-3">Step 3: Aadhaar Verification</h3>
          <p>This is where your Aadhaar verification component will go.</p>
        </>
      )}
    </form>
  );
};

export default DriverProfileForm;
