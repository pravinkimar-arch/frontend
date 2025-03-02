import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Products from './components/Products/Products';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Order from './components/Order/Order';
import { ensureTokenExists, getAuthToken, isAuthenticated, setAuthToken } from './utils/authUtils';

// Define the PrivateRoute component
const PrivateRoute = ({ children }) => {
  // Ensure token exists using our utility function
  const token = ensureTokenExists();
  
  // Check if authenticated
  const isAuth = isAuthenticated();
  console.log('PrivateRoute - isAuthenticated:', isAuth);
  
  return isAuth ? children : <Navigate to="/login" />;
};

function App() {
  // Add this effect to ensure token exists on app load
  useEffect(() => {
    // Always set the token when the app loads (don't just check if it exists)
    const token = setAuthToken();
    console.log('App.js - Setting auth token on startup:', token ? 'Success' : 'Failed');
    
    // Check token every 15 seconds to ensure it's still there and valid
    const interval = setInterval(() => {
      const currentToken = getAuthToken();
      const isValid = isAuthenticated();
      console.log('Token check - token exists and valid:', isValid);
      
      // If token is missing or invalid, reset it
      if (!isValid) {
        console.log('Token invalid or missing, resetting...');
        setAuthToken();
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <NavigationBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/products" element={
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        } />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/order" element={
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
