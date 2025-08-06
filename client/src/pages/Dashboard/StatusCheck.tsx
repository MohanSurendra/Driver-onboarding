import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const MOCK_OTP = '123456';

const StatusCheck: React.FC = () => {
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState(false);
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setSentOtp(true);
    setError('');
  };

  const handleVerifyOtp = async () => {
    if (otp !== MOCK_OTP) {
      setError('Invalid OTP');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/driver/check-status', { email });
      setStatus(response.data.status);
      setVerified(true);
      setError('');
    } catch (err) {
      setError('Driver not found or server error');
    }
  };

  const handleGoHome = () => {
    navigate('/'); // ✅ Replace with your actual homepage route if different
  };

  return (
    <div className="status-container">
      <h2 className="status-title">Check Application Status</h2>

      {!sentOtp ? (
        <>
          <input
            className="status-input"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="status-button" onClick={handleSendOtp}>Send OTP</button>
        </>
      ) : !verified ? (
        <>
          <p className="otp-info">OTP sent to your email (use mock OTP: {MOCK_OTP})</p>
          <input
            className="status-input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="status-button" onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      ) : (
        <>
          <h3 className="status-result">Status: {status}</h3>
          <button className="status-button" onClick={handleGoHome}>Go to Homepage</button>
        </>
      )}

      {error && <p className="status-error">{error}</p>}
    </div>
  );
};

export default StatusCheck;
