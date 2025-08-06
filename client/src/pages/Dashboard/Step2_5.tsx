import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";

const Step2_5 = () => {
  const [aadhaar, setAadhaar] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user } = useAuth();
  const storedAadhaar = user?.aadhaar || localStorage.getItem("aadhaar");

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
      setError("Please enter a valid 12-digit Aadhaar number.");
      return;
    }

    if (storedAadhaar && aadhaar !== storedAadhaar) {
      setError("Entered Aadhaar does not match with your profile.");
      return;
    }

    setOtpSent(true);
    setError("");
  };

  const handleOTPVerify = () => {
    if (otp === "123456") {
      console.log("OTP verified successfully");
      navigate("/dashboard/step3");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Step 2.5: Aadhaar Verification</h2>

      {!otpSent ? (
        <form onSubmit={handleAadhaarSubmit} className="onboarding-form">
          <label htmlFor="aadhaar">Aadhaar Number</label>
          <input
            type="text"
            id="aadhaar"
            name="aadhaar"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            placeholder="Enter 12-digit Aadhaar"
            className="input-field"
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <div className="onboarding-form">
          <p>OTP has been sent to your registered mobile number (mock: 123456)</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-field"
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button onClick={handleOTPVerify}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default Step2_5;
