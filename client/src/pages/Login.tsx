import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login form submitted");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        emailOrMobile,
        password,
      });

      console.log("Login response:", res.data);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("firstName", user.firstName);
      localStorage.setItem("lastName", user.lastName);
      localStorage.setItem("mobile", user.mobile);

      if (user.aadhaar) localStorage.setItem("aadhaar", user.aadhaar);
      if (user.pan) localStorage.setItem("pan", user.pan);
      if (user.license) localStorage.setItem("license", user.license);

      login(user, token);
      navigate("/dashboard", { state: { message: "Login Successful" } });
    } catch (err: any) {
      console.log("Login error");
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Login failed");
      } else {
        setError("Unknown error occurred");
      }
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card p-4 shadow-sm">
        <h2 className="text-success text-center mb-4">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Email or Mobile"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              name="emailOrMobile"
              autoComplete="username"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>

        <p className="text-center text-muted mt-3">
          New user?{" "}
          <button type="button" onClick={handleSignupRedirect} className="link-button">
            Sign up here
          </button>

        </p>
      </div>
    </div>
  );
};

export default Login;
