// ✅ ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ message: "You need to login first!" }} />;
  }

  return children;
};

export default ProtectedRoute;
