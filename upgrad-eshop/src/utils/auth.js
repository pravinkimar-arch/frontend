// Create a new file for authentication utilities

// Store the auth token with an expiration time
export const setAuthToken = (token) => {
  if (!token) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    return;
  }
  
  // Set token expiry to 24 hours from now (adjust as needed)
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  
  localStorage.setItem('authToken', token);
  localStorage.setItem('tokenExpiry', expiry.toISOString());
};

// Get the auth token, checking if it's expired
export const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  const expiryStr = localStorage.getItem('tokenExpiry');
  
  if (!token || !expiryStr) {
    return null;
  }
  
  // Check if token is expired
  const expiry = new Date(expiryStr);
  const now = new Date();
  
  if (now > expiry) {
    // Token expired, clear it
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    return null;
  }
  
  return token;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Log out user
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('isAdmin');
  // Clear any other user-related data
};

// Add this function to your auth.js utility file
export const checkTokenValidity = async () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return false;
  }
  
  try {
    // Make a simple request to check if the token is valid
    const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
}; 