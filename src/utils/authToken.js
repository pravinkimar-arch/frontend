// This file manages the authentication token

// Set this to the token you copied from Postman or browser network tab
const MANUAL_TOKEN = "YOUR_TOKEN_HERE"; // Keep your current token

// Get the authentication token
export const getAuthToken = () => {
  return MANUAL_TOKEN;
};

// Set the authentication token (this is now just for compatibility)
export const setAuthToken = (token) => {
  // Not storing in localStorage since we're using the manual token
};

// Clear the authentication token (for compatibility)
export const clearAuthToken = () => {
  // Not needed with manual approach
};

// Initialize with manual token (for compatibility)
export const initializeAuthToken = () => {
  // Not needed with direct approach
}; 