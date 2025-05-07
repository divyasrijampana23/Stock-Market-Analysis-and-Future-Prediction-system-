import React from 'react';
import './About.css';
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function About() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="about-container">
      <header className="navbar">
        <img src={logo} alt="App Logo" className="logo" />
        <div className="nav-links">
          <nav>
            <Link to={token ? "/dashboard" : "/"}>Home</Link>
            <Link to="/currency-converter">Currency Converter</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="auth-buttons">
            {!token ? (
              <>
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/register" className="register-btn">Register</Link>
              </>
            ) : (
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      </header>

      <main className="about-content">
        <h1>About This Application</h1>
        <p>
          This web application leverages real-time stock market data and machine learning algorithms to predict stock prices for the next 7 days. It combines financial news sentiment with ARIMA, LSTM, and Linear Regression models to help users make informed decisions.
        </p>
        <p>
          Users can register, log in, track stocks, get predictions, read financial news, and convert currencies. Admins can manage users and send email alerts.
        </p>
        <p>
          Built with <strong>FastAPI</strong>, <strong>React</strong>, and <strong>Machine Learning</strong>.
        </p>
      </main>
    </div>
  );
}
