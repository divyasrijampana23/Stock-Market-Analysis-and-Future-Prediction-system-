import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StockDetails from "./pages/StockDetails"; 
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CurrencyConverter from "./pages/CurrencyConverter";
import React from 'react';
import About from './pages/About'; 
import Contact from "./pages/Contact";
import AdminPanel from "./pages/AdminPanel";
import PrivateAdminRoute from "./components/PrivateAdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/currency-converter" element={<CurrencyConverter />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* ✅ Protected pages */}
        {/* Admin-protected route */}
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute>
              <AdminPanel />
            </PrivateAdminRoute>
          }
        />

        {/* Unauthorized fallback */}
        <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />

        {/* User-protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock/:symbol"
          element={
            <ProtectedRoute>
              <StockDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
