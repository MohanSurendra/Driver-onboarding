import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "../../App.css";

const Step2 = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    aadhar: "",
    pan: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "pan" ? value.toUpperCase() : value,
    });
  };

  const validateFields = () => {
    const { aadhar, pan } = formData;

    if (!/^\d{12}$/.test(aadhar)) {
      setError("Aadhar must be exactly 12 digits.");
      return false;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase())) {
      setError("PAN format is invalid (e.g., ABCDE1234F).");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateFields()) return;

    setLoading(true);
    try {
      const token = user?.token || localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated. Please login again.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/driver/aadhaar-pan",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profileId = res.data.profile._id;
      if (profileId) {
        localStorage.setItem("driverId", profileId);
      }

      console.log("Step 2 saved:", res.data);
      localStorage.setItem("aadhaar", formData.aadhar);
      navigate("/dashboard/step2_5");
    } catch (err: any) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container dashboard">
        <h2>Step 2: Identity Verification</h2>
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          <label htmlFor="aadhar">Aadhaar Number</label>
          <input
            type="text"
            id="aadhar"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            maxLength={12}
            required
            className="input-field"
            placeholder="Enter 12-digit Aadhaar"
          />

          <label htmlFor="pan">PAN Number</label>
          <input
            type="text"
            id="pan"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            maxLength={10}
            required
            className="input-field"
            placeholder="Enter PAN (e.g., ABCDE1234F)"
          />

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Verify Aadhaar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step2;
