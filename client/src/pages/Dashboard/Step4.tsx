import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../App.css";

const Step4 = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState({
    aadharImage: null as File | null,
    panImage: null as File | null,
    licenseImage: null as File | null,
    insuranceImage: null as File | null,
    pollutionImage: null as File | null,
  });

  const [errors, setErrors] = useState({
    aadharImage: "",
    panImage: "",
    licenseImage: "",
    insuranceImage: "",
    pollutionImage: "",
  });

  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  const maxSize = 2 * 1024 * 1024; // 2MB

  const validate = () => {
    const newErrors = { ...errors };
    let isValid = true;

    (Object.keys(files) as (keyof typeof files)[]).forEach((key) => {
      const file = files[key];
      if (!file) {
        newErrors[key] = "Required.";
        isValid = false;
      } else if (!allowedTypes.includes(file.type)) {
        newErrors[key] = "Only JPG, PNG, or PDF files allowed.";
        isValid = false;
      } else if (file.size > maxSize) {
        newErrors[key] = "Max file size is 2MB.";
        isValid = false;
      } else {
        newErrors[key] = "";
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      setFiles((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const driverId = localStorage.getItem("driverId");
    const token = localStorage.getItem("token");

    if (!driverId || !token) {
      alert("Missing driver ID or authentication token.");
      return;
    }

    const formData = new FormData();
    formData.append("aadharImage", files.aadharImage!);
    formData.append("panImage", files.panImage!);
    formData.append("licenseImage", files.licenseImage!);
    formData.append("insuranceImage", files.insuranceImage!);
    formData.append("pollutionImage", files.pollutionImage!);

    try {
      const res = await fetch(`http://localhost:5000/api/driver/upload-docs/${driverId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      console.log("Upload successful:", data);
      navigate("/dashboard/step5");
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-container dashboard">
        <h2>Step 4: Upload Documents</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(files).map((key) => (
            <div key={key} className="form-group">
              <label>
                {key.replace("Image", "").replace(/([A-Z])/g, " $1").toUpperCase()} (PDF or Image)
              </label>
              <input
                type="file"
                name={key}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              {errors[key as keyof typeof errors] && (
                <p className="error">{errors[key as keyof typeof errors]}</p>
              )}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Step4;
