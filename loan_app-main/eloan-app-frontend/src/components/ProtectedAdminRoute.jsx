// src/components/ProtectedAdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  if (!token || !userString) {
    // No token or user data, redirect to main login
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);

  if (user.role !== 'admin') {
    // Logged in, but not an admin. Redirect to user dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  // Token exists and role is 'admin', render the admin content
  return <Outlet />;
};

export default ProtectedAdminRoute;