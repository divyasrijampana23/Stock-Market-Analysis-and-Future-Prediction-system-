import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Contact.css';
import logo from '../assets/logo.png';
import TeamSection from '../components/TeamSection';

function Contact() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="contact-container">
      <header className="navbar">
        <img src={logo} alt="App Logo" className="logo" />
        <div className="nav-links">
          <nav>
            <Link to={token ? "/dashboard" : "/"}>Home</Link>
            <Link to="/currency-converter">Currency Converter</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact Us</Link>
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

      <main className="contact-content">
        <h1>Contact Us</h1>
        {/* Your existing form or message box can be added here */}
        <TeamSection />
      </main>
    </div>
  );
}

export default Contact;
