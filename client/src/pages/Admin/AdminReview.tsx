import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminReview = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();

  const [driver, setDriver] = useState<any>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/application/${driverId}`);
        setDriver(res.data);
        setStatus(res.data.status);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching driver:', err);
        setMessage('Driver not found or error fetching data');
        setLoading(false);
      }
    };

    if (driverId) fetchDriver();
  }, [driverId]);

  const handleStatusChange = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/application/${driverId}`, { status });
      setMessage('Status updated successfully');
      setDriver(res.data.driver);
    } catch (err) {
      console.error('Error updating status:', err);
      setMessage('Failed to update status');
    }
  };

  if (loading) return <div className="text-center mt-10 text-green-600">Loading driver details...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Review Driver Application</h2>
      {message && <p className="text-center mb-4 text-green-500 font-semibold">{message}</p>}

      {driver ? (
        <div className="space-y-4">
          <p><strong>Name:</strong> {driver.firstName} {driver.lastName}</p>
          <p><strong>Email:</strong> {driver.email}</p>
          <p><strong>Mobile:</strong> {driver.contactNumber}</p>
          <p><strong>Vehicle Type:</strong> {driver.vehicleType}</p>
          <p><strong>Vehicle Number:</strong> {driver.vehicleNumber}</p>
          <p><strong>Current Status:</strong> <span className="capitalize">{driver.status}</span></p>

          {driver.documents && (
            <div>
              <h3 className="text-lg font-semibold mt-6 mb-2">Uploaded Documents</h3>
              <ul className="list-disc list-inside space-y-1">
                {driver.documents.aadharImage && (
                  <li>
                    Aadhaar:{" "}
                    <a
                      href={`http://localhost:5000/${driver.documents.aadharImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline"
                    >
                      View
                    </a>
                  </li>
                )}
                {driver.documents.panImage && (
                  <li>
                    PAN:{" "}
                    <a
                      href={`http://localhost:5000/${driver.documents.panImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline"
                    >
                      View
                    </a>
                  </li>
                )}
                {driver.documents.licenseImage && (
                  <li>
                    License:{" "}
                    <a
                      href={`http://localhost:5000/${driver.documents.licenseImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline"
                    >
                      View
                    </a>
                  </li>
                )}
                {driver.documents.insuranceImage && (
                  <li>
                    Insurance Certificate:{" "}
                    <a
                      href={`http://localhost:5000/${driver.documents.insuranceImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline"
                    >
                      View
                    </a>
                  </li>
                )}
                {driver.documents.pollutionImage && (
                  <li>
                    Pollution Certificate:{" "}
                    <a
                      href={`http://localhost:5000/${driver.documents.pollutionImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline"
                    >
                      View
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <label className="block font-semibold mb-1">Update Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleStatusChange}
              className="btn-primary"
            >
              Update Status
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="btn-secondary"
            >
              Other Applications
            </button>
          </div>
        </div>
      ) : (
        <p className="text-red-500 text-center">Driver not found</p>
      )}
    </div>
  );
};

export default AdminReview;
