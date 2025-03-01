import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Login from './components/Login/Login';
import Signup from './components/Auth/Signup';
import Products from './components/Products/Products';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Order from './components/Order/Order';
import { isAuthenticated, validateToken, clearAuthToken } from './utils/authUtils';
import { initializeAuthToken, getAuthToken } from './utils/authToken';

// Update the PrivateRoute component
const PrivateRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  console.log('PrivateRoute - isAuthenticated:', authenticated);
  
  return authenticated ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    // Initialize the token when the app starts
    initializeAuthToken();
    
    // Log the token to verify it's set
    const token = getAuthToken();
    console.log('App initialized with token:', token ? `${token.substring(0, 15)}...` : 'No token');
  }, []);

  // Add this effect to check token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('App.js - authToken in localStorage:', token ? 'Token exists' : 'Token is null');
  }, []);

  // Add this function to your App.js
  const ensureTokenConsistency = () => {
    const token = localStorage.getItem('authToken');
    console.log('App.js - Checking token consistency:', token ? 'Token exists' : 'Token is null');
    
    // If token exists in sessionStorage but not in localStorage, copy it
    if (!token) {
      const sessionToken = sessionStorage.getItem('authToken');
      if (sessionToken) {
        console.log('App.js - Copying token from sessionStorage to localStorage');
        localStorage.setItem('authToken', sessionToken);
      }
    }
  };

  // Call this function in your App component
  useEffect(() => {
    ensureTokenConsistency();
    
    // Set up an interval to periodically check token consistency
    const interval = setInterval(ensureTokenConsistency, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Add this to your App component
  useEffect(() => {
    const checkTokenValidity = async () => {
      const isValid = await validateToken();
      console.log('App.js - Token validation result:', isValid);
      
      if (!isValid) {
        console.log('App.js - Clearing invalid token');
        clearAuthToken();
      }
    };
    
    checkTokenValidity();
  }, []);

  return (
    <div>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Products />} />
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
