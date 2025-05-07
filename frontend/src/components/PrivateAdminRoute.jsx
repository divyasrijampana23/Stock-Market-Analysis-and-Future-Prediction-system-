import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const base64Url = token.split('.')[1];
    const decoded = JSON.parse(atob(base64Url));
    
    const isAdmin = decoded?.is_admin;

    if (!isAdmin) {
      return <Navigate to="/unauthorized" />;
    }

    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/login" />;
  }
};

export default PrivateAdminRoute;
