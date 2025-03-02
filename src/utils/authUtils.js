// Authentication utility functions

// Hardcoded authentication token
const HARDCODED_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBkZW1vLmNvbSIsImlhdCI6MTc0MDg5ODIxNCwiZXhwIjoxNzQwOTA2NjE0fQ.ExrxkLuuU1SOiaidkb2nAMZ-sDC0maJyhh8KJGaZA-CV3T9ZkwcaZsYMgsR94wihLm7fKCLJjNp9n0F4hhcLpw";

/**
 * Sets the authentication token in localStorage and sessionStorage
 * @param {string} [token] - Optional token to set (defaults to hardcoded token)
 * @returns {string} The token that was set
 */
export const setAuthToken = (token = HARDCODED_TOKEN) => {
  try {
    // Always use the hardcoded token for this application
    const tokenToUse = HARDCODED_TOKEN;
    
    localStorage.setItem('authToken', tokenToUse);
    sessionStorage.setItem('authToken', tokenToUse);
    console.log('Auth token set in storage');
    return tokenToUse;
  } catch (error) {
    console.error('Error setting auth token:', error);
    return HARDCODED_TOKEN; // Return hardcoded token even if storage fails
  }
};

/**
 * Gets the authentication token from localStorage or sets it if not present
 * @returns {string} The authentication token
 */
export const getAuthToken = () => {
  try {
    let token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('No token found in localStorage, setting hardcoded token');
      // If token is not in localStorage, set the hardcoded token
      token = setAuthToken();
    } else if (token !== HARDCODED_TOKEN) {
      // If token exists but doesn't match hardcoded token, update it
      console.log('Token in localStorage does not match hardcoded token, updating');
      token = setAuthToken();
    }
    
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return HARDCODED_TOKEN; // Return hardcoded token as fallback
  }
};

/**
 * Checks if the user is authenticated by verifying token existence
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return token === HARDCODED_TOKEN; // Specifically check it matches our hardcoded token
};

/**
 * Ensures the hardcoded token is set in storage
 * @returns {string} The token that was ensured
 */
export const ensureTokenExists = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token || token !== HARDCODED_TOKEN) {
      console.log('Token not found or does not match hardcoded token, setting hardcoded token');
      return setAuthToken();
    }
    return token;
  } catch (error) {
    console.error('Error ensuring token exists:', error);
    return setAuthToken(); // Set token as fallback
  }
};

/**
 * Clears authentication data (for logout)
 */
export const clearAuth = () => {
  try {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    console.log('Auth data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}; 