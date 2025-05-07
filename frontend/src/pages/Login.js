import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import logo from "../assets/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", new URLSearchParams({
        username: formData.username,
        password: formData.password
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
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
            <Link to="/register" className="register-btn">Register</Link>
          </div>
        </div>
      </header>

      {/* ✅ Login Form Section */}
      <div className="login-wrapper">
        <div className="login-left">
          <img src={require("../assets/bitcoin-bg2.jpg")} alt="Bitcoin" />
        </div>

        <div className="login-right">
          <h1 className="login-heading">MEMBER <span>LOGIN</span></h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>USERNAME</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              required
            />

            <label>PASSWORD</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
            />

            <div className="login-options">
              <input type="checkbox" /> Keep Me Signed In
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">LOGIN</button>

            <div className="login-footer">
              <p>
                <Link to="/register">Register</Link> | <a href="#">Forgot your password?</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
