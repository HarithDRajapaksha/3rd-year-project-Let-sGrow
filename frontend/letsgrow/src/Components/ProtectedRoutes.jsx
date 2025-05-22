import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, allowedRoles, userRole, children }) => {
  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect to unauthorized page if the user's role is not allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;