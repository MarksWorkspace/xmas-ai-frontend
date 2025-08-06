import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;