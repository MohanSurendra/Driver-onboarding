// src/pages/LandingPage.tsx
import React from "react";
import Navbar from "../components/Navbar";
import "../App.css";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow-sm p-4 bg-light">
          <h2 className="text-success mb-3">Welcome to the Driver Onboarding Portal</h2>
          <p className="info-text lead text-muted mb-4">
            This portal allows drivers to register and complete their onboarding
            in a step-by-step process. Admins can review and verify applications.
          </p>
          <ul className="dashboard-steps list-group list-group-flush">
            <li className="list-group-item">✔ Register and Login</li>
            <li className="list-group-item">✔ Complete identity and vehicle details</li>
            <li className="list-group-item">✔ Upload required documents</li>
            <li className="list-group-item">✔ Check status of your application anytime</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
