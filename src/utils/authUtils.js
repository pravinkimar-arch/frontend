// Create a new file src/utils/authUtils.js

// Get the authentication token from storage
export const getAuthToken = () => {
  // Try localStorage first
  let token = localStorage.getItem('authToken');
  
  // Check if token is null or the string "null"
  if (!token || token === 'null') {
    // Try sessionStorage
    token = sessionStorage.getItem('authToken');
    
    // If found in sessionStorage, update localStorage
    if (token && token !== 'null') {
      localStorage.setItem('authToken', token);
    } else {
      // No valid token found
      return null;
    }
  }
  
  return token;
};

// Set the authentication token in storage
export const setAuthToken = (token) => {
  if (!token) {
    // Clear token if null or empty
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    return;
  }
  
  localStorage.setItem('authToken', token);
  sessionStorage.setItem('authToken', token);
};

// Clear the authentication token from storage
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token && token !== 'null';
};

// Validate token by making a test API call
export const validateToken = async () => {
  const token = getAuthToken();
  
  if (!token || token === 'null') {
    return false;
  }
  
  try {
    const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}; 