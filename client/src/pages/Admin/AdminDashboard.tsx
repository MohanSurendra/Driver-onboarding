import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/api";

interface Driver {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/drivers");
        setDrivers(res.data);
      } catch (err) {
        console.error("Error fetching drivers", err);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className="admin-page-container">
      <h1 className="admin-heading">Driver Applications</h1>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.fullName}</td>
                <td>{driver.email}</td>
                <td>{new Date(driver.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${driver.status}`}>
                    {driver.status}
                  </span>
                </td>
                <td>
                  <button
                    className="link-button"
                    onClick={() => navigate(`/admin/review/${driver._id}`)}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
