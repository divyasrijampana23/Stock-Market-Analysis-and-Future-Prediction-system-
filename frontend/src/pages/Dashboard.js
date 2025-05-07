import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import logo from "../assets/logo.png";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";

const tickers = [
  "AAPL", "GOOGL", "TSLA", "MSFT", "AMZN", "NFLX", "META", "NVDA", "BABA", "V",
  "JPM", "DIS", "MA", "PEP", "KO", "T", "PFE", "MRK", "WMT", "HD"
];

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stock/details", {
          params: { tickers },
          paramsSerializer: params =>
            params.tickers.map(t => `tickers=${encodeURIComponent(t)}`).join("&"),
          headers: { Authorization: `Bearer ${token}` },
        });
        setStocks(response.data);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to fetch stock data.");
      }
    };

    fetchDetails();
    const interval = setInterval(fetchDetails, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <header className="navbar">
        <img src={logo} alt="ADFG Logo" className="logo" />
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/currency-converter">Currency Converter</Link>
          <Link to="/contact">Contact Us</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <div className="ticker-strip">
        <div className="ticker-content">
          {stocks.map((stock, idx) => (
            <span key={idx}>
              <strong>{stock.symbol}</strong> ${stock.price}{" "}
              <span className={stock.change >= 0 ? "green" : "red"}>
                {stock.change >= 0 ? `+${stock.change}` : stock.change} (
                {stock.percent_change >= 0 ? `+${stock.percent_change}` : stock.percent_change}%)
              </span>{" "}
              &nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <h2 className="dashboard-title">Live Stock Market Overview</h2>

      <input
        type="text"
        placeholder="Search by symbol or price..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="scroll-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Value</th>
              <th>Change</th>
              <th>% Change</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Prev</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {stocks
              .filter((stock) =>
                stock.symbol?.toUpperCase().includes(searchQuery)
              )
              .map((stock, idx) => (
                <tr key={idx} onClick={() => navigate(`/stock/${stock.symbol}`)} className="stock-row">
                  <td>{stock.symbol || "-"}</td>
                  <td>{stock.price !== null && stock.price !== undefined ? `$${stock.price}` : "N/A"}</td>
                  <td className={Number(stock.change) >= 0 ? "green" : "red"}>
                    {stock.change !== null && stock.change !== undefined
                      ? `${Number(stock.change) >= 0 ? "+" : ""}${stock.change}`
                      : "N/A"}
                  </td>
                  <td className={Number(stock.percent_change) >= 0 ? "green" : "red"}>
                    {stock.percent_change !== null && stock.percent_change !== undefined
                      ? `${Number(stock.percent_change) >= 0 ? "+" : ""}${stock.percent_change}%`
                      : "N/A"}
                  </td>
                  <td>{stock.open !== null ? `$${stock.open}` : "N/A"}</td>
                  <td>{stock.high !== null ? `$${stock.high}` : "N/A"}</td>
                  <td>{stock.low !== null ? `$${stock.low}` : "N/A"}</td>
                  <td>{stock.previous_close !== null ? `$${stock.previous_close}` : "N/A"}</td>
                  <td>
                    {Array.isArray(stock.history) && stock.history.length > 1 ? (
                      <Sparklines data={stock.history} width={100} height={30}>
                        <SparklinesLine
                          color={stock.history[0] < stock.history.at(-1) ? "lime" : "red"}
                        />
                      </Sparklines>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
