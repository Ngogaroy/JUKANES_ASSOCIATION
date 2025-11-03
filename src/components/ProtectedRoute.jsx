import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Show a loading spinner while Firebase checks auth
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-[#20a39e]" />
      </div>
    );
  }

  if (!currentUser) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/admin-login" replace />;
  }

  // If user is logged in, show the child page (e.g., AdminLayout)
  return <Outlet />;
};

export default ProtectedRoute;