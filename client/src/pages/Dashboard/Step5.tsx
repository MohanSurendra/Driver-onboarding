import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../App.css";

const Step5: React.FC = () => {
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const driverId = localStorage.getItem("driverId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/driver/profile/${driverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch driver profile");
        }

        const data = await response.json();
        setDriverData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching driver data:", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [driverId, token]);

  const handleFinalSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/driver/final-submit/${driverId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit profile");
      }
      console.log("Profile submitted successfully");
      navigate("/");
    } catch (err: any) {
      console.error("Submission Error:", err);
      setSubmitError("Failed to submit profile. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-muted mt-4">Loading profile...</p>;
  if (!driverData) return <p className="text-center text-danger mt-4">No data found.</p>;

  const {
    firstName,
    lastName,
    email,
    contactNumber,
    aadhar,
    pan,
    license,
    experience,
    vehicleNumber,
    vehicleType,
    status,
  } = driverData;

  return (
    <div>
      <Navbar />
      <div className="container mt-4 mb-5 step-container">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="mb-3 text-success">Step 5: Final Submission</h2>
            <h4 className="mb-4 text-muted">Review Your Details:</h4>

            <p><span className="fw-bold">Name:</span> {firstName || ""} {lastName || ""}</p>
            <p><span className="fw-bold">Email:</span> {email || "Not Provided"}</p>
            <p><span className="fw-bold">Mobile:</span> {contactNumber || "Not Provided"}</p>
            <p><span className="fw-bold">Aadhaar:</span> {aadhar || "Not Provided"}</p>
            <p><span className="fw-bold">PAN:</span> {pan || "Not Provided"}</p>
            <p><span className="fw-bold">License:</span> {license || "Not Provided"}</p>
            <p><span className="fw-bold">Experience:</span> {experience || "Not Provided"}</p>
            <p><span className="fw-bold">Vehicle No.:</span> {vehicleNumber || "Not Provided"}</p>
            <p><span className="fw-bold">Vehicle Type:</span> {vehicleType || "Not Provided"}</p>
            <p><span className="fw-bold">Status:</span> <span className="text-capitalize">{status || "pending"}</span></p>

            {submitError && (
              <p className="text-danger mt-3">{submitError}</p>
            )}

            <button
              onClick={handleFinalSubmit}
              className="btn btn-success mt-4 px-4"
            >
              Submit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5;
