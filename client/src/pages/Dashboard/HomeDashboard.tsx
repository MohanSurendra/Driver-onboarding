import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";

const HomeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Redirect if accessed without login
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleStart = () => {
    navigate("/dashboard/step1");
  };

  const successMessage = location.state?.message;

  return (
    <div className="form-container">
      <Navbar />
      <div className="dashboard">
        <h2>
          Welcome, {user.firstName} {user.lastName}!
        </h2>

        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}

        <p className="info-text">
          Thank you for registering. To complete your onboarding process,
          please provide your personal, identity, and vehicle information
          through a step-by-step process.
        </p>

        <ol className="dashboard-steps">
          <li>Personal Details (Name, DOB, Contact)</li>
          <li>Identity Verification (Aadhaar, PAN)</li>
          <li>Aadhaar Verification (via OTP)</li>
          <li>Vehicle Information (DL No., Experience, Vehicle Type, Vehicle Number)</li>
          <li>Upload Documents (Aadhaar, Pan, Insurance and Pollution Certificates)</li>
          <li>Final Submission and Confirmation</li>
        </ol>

        <button className="start-button" onClick={handleStart}>
          Start Registration
        </button>
      </div>
    </div>
  );
};

export default HomeDashboard;
