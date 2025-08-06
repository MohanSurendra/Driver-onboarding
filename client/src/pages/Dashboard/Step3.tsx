import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../App.css";

const Step3 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    license: "",
    experience: "",
    vehicleType: "",
    vehicleNumber: "",
  });

  const [errors, setErrors] = useState({
    license: "",
    experience: "",
    vehicleType: "",
    vehicleNumber: "",
  });

  const validate = () => {
    let isValid = true;
    const newErrors = {
      license: "",
      experience: "",
      vehicleType: "",
      vehicleNumber: "",
    };

    if (!formData.license.trim()) {
      newErrors.license = "Driving license number is required.";
      isValid = false;
    } else if (!/^[A-Z0-9]{8,15}$/.test(formData.license.trim())) {
      newErrors.license = "DL number must be alphanumeric (8–15 characters).";
      isValid = false;
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required.";
      isValid = false;
    } else if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      newErrors.experience = "Experience must be a non-negative number.";
      isValid = false;
    }

    if (!formData.vehicleType.trim()) {
      newErrors.vehicleType = "Vehicle type is required.";
      isValid = false;
    }

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required.";
      isValid = false;
    } else if (!/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/i.test(formData.vehicleNumber.trim())) {
      newErrors.vehicleNumber = "Format: KA01AB1234 (no spaces).";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const processedValue =
      name === "license" || name === "vehicleNumber" ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again.");
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/driver/vehicle-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();

      if (data.driverId) {
        localStorage.setItem("driverId", data.driverId);
      }

      console.log("Vehicle info submitted:", data);
      navigate("/dashboard/step4");
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container dashboard">
        <h2 className="form-heading">Step 3: Vehicle Information</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="license">Driving License Number</label>
          <input
            type="text"
            name="license"
            value={formData.license}
            onChange={handleChange}
            placeholder="DL12345678"
            className={errors.license ? "input-error" : ""}
          />
          {errors.license && <p className="error">{errors.license}</p>}

          <label htmlFor="experience">Driving Experience (Years)</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g. 2"
            min="0"
            className={errors.experience ? "input-error" : ""}
          />
          {errors.experience && <p className="error">{errors.experience}</p>}

          <label htmlFor="vehicleType">Vehicle Type</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className={errors.vehicleType ? "input-error" : ""}
          >
            <option value="">Select vehicle type</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
            <option value="Auto">Auto</option>
          </select>
          {errors.vehicleType && <p className="error">{errors.vehicleType}</p>}

          <label htmlFor="vehicleNumber">Vehicle Registration Number</label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            placeholder="AB17VK1818"
            className={errors.vehicleNumber ? "input-error" : ""}
          />
          {errors.vehicleNumber && <p className="error">{errors.vehicleNumber}</p>}

          <button type="submit" className="primary-btn">
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default Step3;
