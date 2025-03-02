import { getAuthToken, setAuthToken } from '../utils/authUtils';

const API_BASE_URL = 'https://dev-project-ecommerce.upgrad.dev/api';

// Helper function to ensure token is available for API calls
const ensureTokenForRequest = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn('No token found for API request, setting token');
    return setAuthToken();
  }
  return token;
};

const apiService = {
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        // Instead of getting token from headers, use our hardcoded token
        const token = setAuthToken();
        console.log('Login successful, token set');
        return await response.json();
      }
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const token = ensureTokenForRequest();
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: { 'x-auth-token': token }
      });
      
      if (response.status === 401) {
        console.error('Unauthorized response when fetching products');
        // Try to refresh token
        setAuthToken();
        throw new Error('Session expired. Please try again.');
      }
      
      if (response.ok) return await response.json();
      throw new Error('Failed to fetch products');
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Signup failed');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  getProductDetails: async (productId) => {
    try {
      const token = ensureTokenForRequest();
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        headers: { 'x-auth-token': token }
      });
      
      if (response.status === 401) {
        console.error('Unauthorized response when fetching product details');
        // Try to refresh token
        setAuthToken();
        throw new Error('Session expired. Please try again.');
      }
      
      if (response.ok) return await response.json();
      throw new Error('Failed to fetch product details');
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },
  
  getAddresses: async () => {
    try {
      const token = ensureTokenForRequest();
      const response = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      if (response.status === 401) {
        console.error('Unauthorized response when fetching addresses');
        // Try to refresh token
        setAuthToken();
        throw new Error('Session expired. Please try again.');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch addresses: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },
  
  placeOrder: async (orderData) => {
    try {
      const token = ensureTokenForRequest();
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify(orderData)
      });
      
      if (response.status === 401) {
        console.error('Unauthorized response when placing order');
        // Try to refresh token
        setAuthToken();
        throw new Error('Session expired. Please try again.');
      }
      
      if (response.ok) return await response.json();
      throw new Error('Failed to place order');
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }
};

export default apiService;
