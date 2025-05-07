import React, { useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Home = () => {
  // ✅ Automatically logout user when they visit Home
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const token = localStorage.getItem("token");

  return (
    <div className="home-container">
      <header className="navbar">
        <img src={logo} alt="ADFG Logo" className="logo" />
        <div className="nav-links">
          <nav>
            <Link to={token ? "/dashboard" : "/"}>Home</Link>
            <Link to="/about">About</Link>
            <Link to="/currency-converter">Currency Converter</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-overlay">
          <h1>STOCK MARKET PREDICTION</h1>
          <p>WELCOME TO THE FUTURE OF INVESTING!</p>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat"><h2>10K+</h2><p>Worldwide Users</p></div>
        <div className="stat"><h2>100%</h2><p>Secure</p></div>
        <div className="stat"><h2>3,400+</h2><p>Companies</p></div>
      </section>

      <section className="services-section">
        <h2>OUR SERVICES</h2>
        <div className="services">
          <div>✅ Trusted</div>
          <div>📈 Accurate Predictions</div>
          <div>👨‍💼 Qualified Employees</div>
          <div>💰 Earn Money</div>
          <div>🔒 Secure</div>
          <div>🕒 Real Time Stocks</div>
        </div>
      </section>

      <section className="clients-section">
        <h2>THE CLIENTS WE WORK FOR</h2>
        <div className="clients">
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" />
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-info">
          <h2>GET IN TOUCH WITH US</h2>
          <form>
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Message" />
            <button type="submit">SEND MESSAGE</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 ADFG. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
