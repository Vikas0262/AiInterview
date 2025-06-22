import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ showLoginMessage = true }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [hasShownMessage, setHasShownMessage] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    const user = localStorage.getItem('user');
    const isAuth = !!user;
    setIsAuthenticated(isAuth);
    
    // Show login message if not authenticated and showLoginMessage is true
    if (!isAuth && showLoginMessage && !hasShownMessage) {
      toast.info('Please login to access this page', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setHasShownMessage(true);
    }
    
    setIsLoading(false);
  }, [location, showLoginMessage, hasShownMessage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, render the child routes
  // Otherwise, redirect to home page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace state={{ from: location }} />;
};

export default ProtectedRoute;
