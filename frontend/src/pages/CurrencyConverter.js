import React, { useState } from "react";
import axios from "axios";
import "./CurrencyConverter.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Sparklines, SparklinesLine } from "react-sparklines";

const getSymbol = (code) => {
  const symbols = {
    USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥",
    AUD: "A$", CAD: "C$", CNY: "¥", CHF: "CHF", BRL: "R$",
    ZAR: "R", MXN: "$", SGD: "S$", HKD: "HK$", KRW: "₩",
    SEK: "kr", NOK: "kr", RUB: "₽", AED: "د.إ", SAR: "﷼"
  };
  return symbols[code] || code;
};

const currencyList = [
  { code: "USD", country: "United States Dollar", flag: "🇺🇸" },
  { code: "INR", country: "Indian Rupee", flag: "🇮🇳" },
  { code: "EUR", country: "Euro (EU)", flag: "🇪🇺" },
  { code: "GBP", country: "British Pound", flag: "🇬🇧" },
  { code: "JPY", country: "Japanese Yen", flag: "🇯🇵" },
  { code: "AUD", country: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", country: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CNY", country: "Chinese Yuan", flag: "🇨🇳" },
  { code: "CHF", country: "Swiss Franc", flag: "🇨🇭" },
  { code: "BRL", country: "Brazilian Real", flag: "🇧🇷" },
  { code: "ZAR", country: "South African Rand", flag: "🇿🇦" },
  { code: "MXN", country: "Mexican Peso", flag: "🇲🇽" },
  { code: "SGD", country: "Singapore Dollar", flag: "🇸🇬" },
  { code: "HKD", country: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "KRW", country: "South Korean Won", flag: "🇰🇷" },
  { code: "SEK", country: "Swedish Krona", flag: "🇸🇪" },
  { code: "NOK", country: "Norwegian Krone", flag: "🇳🇴" },
  { code: "RUB", country: "Russian Ruble", flag: "🇷🇺" },
  { code: "AED", country: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", country: "Saudi Riyal", flag: "🇸🇦" }
];

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleConvert = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    setLoading(true);
    setConverted(null);
    setError("");

    try {
      const response = await axios.get("http://localhost:8000/api/currency/convert", {
        params: {
          from_currency: fromCurrency,
          to_currency: toCurrency,
          amount: parseFloat(amount),
        },
      });

      // Simulated trend data (for animation)
      const trend = Array.from({ length: 10 }, () =>
        Number((response.data.rate * (0.95 + Math.random() * 0.1)).toFixed(4))
      );

      setConverted({
        ...response.data,
        trend
      });
    } catch (err) {
      setError("❌ Conversion failed. Please check inputs or try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="converter-container">
      <header className="navbar">
        <img src={logo} alt="ADFG Logo" className="logo" />
        <nav>
          <Link to={token ? "/dashboard" : "/"}>Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact Us</Link>
          {token ? (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <><Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link></>
          )}
        </nav>
      </header>

      <h2 style={{ marginTop: "120px" }}>🌍 Currency Converter</h2>

      <div className="input-section">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <div className="dropdowns">
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencyList.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.flag} {cur.country} ({cur.code})
              </option>
            ))}
          </select>

          <span>to</span>

          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencyList.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.flag} {cur.country} ({cur.code})
              </option>
            ))}
          </select>
        </div>

        <button className="swap-btn" onClick={handleSwap}>🔄 Swap</button>

        <button
          className="convert-btn"
          onClick={handleConvert}
          disabled={!amount || isNaN(amount) || parseFloat(amount) <= 0}
        >
          Convert
        </button>
      </div>

      {loading && <p className="loading">🔄 Converting...</p>}

      {converted && (
        <div className="result">
          <p>
            <strong>{converted.original_amount}</strong> {getSymbol(fromCurrency)} ={" "}
            <strong>{converted.converted_amount}</strong> {getSymbol(toCurrency)}
          </p>
          <p>💱 Rate: 1 {fromCurrency} = {converted.rate} {toCurrency}</p>

          {/* ✅ Trend chart with error protection */}
          {converted?.trend?.length > 1 && (
            <div className="trend-graph">
              <Sparklines data={converted.trend} width={100} height={30}>
                <SparklinesLine
                  color={
                    converted.trend[0] < converted.trend.at(-1)
                      ? "lime"
                      : "red"
                  }
                />
              </Sparklines>
            </div>
          )}
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CurrencyConverter;
