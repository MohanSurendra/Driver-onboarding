import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      const { token, admin } = res.data;
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminEmail", admin.email);

      navigate("/admin/dashboard");
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Login failed");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-heading">Admin Login</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleLogin} className="form-stack">
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="submit-button w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
