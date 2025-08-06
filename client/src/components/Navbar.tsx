// src/components/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  isAdmin?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin = false }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Driver Portal</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link">Signup</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/login" className="nav-link">Admin Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/status-check" className="nav-link">Application Status</Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link">Review Drivers</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
