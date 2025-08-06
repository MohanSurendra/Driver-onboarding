import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "../../App.css"; 
const Step1 = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "Male",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidDOB = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    if (birthDate > today) return false;
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    return age > 18 || (age === 18 && (m > 0 || (m === 0 && d >= 0)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, dob, phone, gender } = formData;

    if (!firstName || !lastName || !dob || !phone || !gender) {
      setError("All fields are required.");
      return;
    }

    if (!/^[a-zA-Z\s]{2,}$/.test(firstName)) {
      setError("First name must be at least 2 letters.");
      return;
    }

    if (!/^[a-zA-Z\s]{1,}$/.test(lastName)) {
      setError("Last name must be at least 2 letters.");
      return;
    }

    if (!isValidDOB(dob)) {
      setError("Driver must be at least 18 years old.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Contact number must be 10 digits.");
      return;
    }

    if (!user) {
      setError("User not authenticated. Please login again.");
      return;
    }

    if (
      user.firstName.trim().toLowerCase() !== firstName.trim().toLowerCase() ||
      user.lastName.trim().toLowerCase() !== lastName.trim().toLowerCase()
    ) {
      setError("Entered name doesn't match your signup details.");
      return;
    }

    setLoading(true);

    try {
      const token = user?.token ?? localStorage.getItem("token") ?? "";

      const payload = {
        firstName,
        lastName,
        phone,
        dob,
        gender,
      };

      const res = await axios.post(
        "http://localhost:5000/api/driver/basic-info",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Step 1 saved:", res.data);
      navigate("/dashboard/step2");
    } catch (err: any) {
      console.error("Step 1 submission error:", err);
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <Navbar />
      <h2>Step 1: Personal Details</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="onboarding-form">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />

        <label htmlFor="dob">Date of Birth</label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />

        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="phone">Mobile Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="10-digit Mobile Number"
          pattern="[0-9]{10}"
          maxLength={10}
          value={formData.phone}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Next"}
        </button>
      </form>
    </div>
  );
};

export default Step1;
