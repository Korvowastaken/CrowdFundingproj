import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';

const ProtectedRoute = ({ isAuthenticated, onLogin, children }) => {
  if (!isAuthenticated) {
    return <AdminLogin onLogin={onLogin} />;
  }

  return children;
};

export default ProtectedRoute;

