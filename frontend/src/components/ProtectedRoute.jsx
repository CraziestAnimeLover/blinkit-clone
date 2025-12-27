import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false,deliveryOnly }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;
   if (deliveryOnly && user.role !== "delivery") return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
