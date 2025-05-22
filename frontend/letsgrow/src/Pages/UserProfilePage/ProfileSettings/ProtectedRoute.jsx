import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Add debug logging
  console.log('Checking authentication...');
  const token = localStorage.getItem('token');
  console.log('Token exists:', !!token);
  
  if (!token) {
    console.log('Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Rendering protected content');
  return <Outlet />;
};

export default ProtectedRoute;