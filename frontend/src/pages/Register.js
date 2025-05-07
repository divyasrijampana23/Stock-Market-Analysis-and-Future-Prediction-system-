import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import logo from "../assets/logo.png";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000); // Redirect after 2s

    } catch (err) {
      const message = err.response?.data?.detail || "Registration failed";
      setError(message);
    }
  };

  return (
    <div className="register-page">
      {/* ✅ Navbar */}
      <header className="navbar">
        <img src={logo} alt="ADFG Logo" className="logo" />
        <div className="nav-links">
          <nav>
            <Link to={token ? "/dashboard" : "/"}>Home</Link>
            <Link to="/currency-converter">Currency Converter</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </div>
      </header>

      {/* ✅ Register Form */}
      <div className="register-wrapper">
        <div className="register-left">
          <img src={require("../assets/bitcoin-bg.jpg")} alt="Bitcoin" />
        </div>

        <div className="register-right">
          <h1 className="register-heading">CREATE <span>ACCOUNT</span></h1>

          <form className="register-form" onSubmit={handleSubmit}>
            <label>USERNAME</label>
            <input type="text" name="username" onChange={handleChange} required />

            <label>EMAIL</label>
            <input type="email" name="email" onChange={handleChange} required />

            <label>PASSWORD</label>
            <input type="password" name="password" onChange={handleChange} required />

            <label>CONFIRM PASSWORD</label>
            <input type="password" name="confirmPassword" onChange={handleChange} required />

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "limegreen" }}>{success}</p>}

            <button type="submit">REGISTER</button>

            <div className="register-footer">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
