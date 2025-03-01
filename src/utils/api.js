// Create a new file for API utilities
import { getAuthToken, logout } from './auth';

// Base URL for all API requests
const API_BASE_URL = 'https://dev-project-ecommerce.upgrad.dev/api';

// Helper function for authenticated API requests
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'x-auth-token': token,
    ...options.headers
  };
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized errors
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please log in again.');
    }
    
    return response;
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
};

// Common API functions
export const getAddresses = async () => {
  const response = await apiRequest('/addresses', { method: 'GET' });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch addresses: ${errorText}`);
  }
  
  return response.json();
};

export const addAddress = async (addressData) => {
  const response = await apiRequest('/addresses', {
    method: 'POST',
    body: JSON.stringify(addressData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add address: ${errorText}`);
  }
  
  return response.json();
};

export const placeOrder = async (orderData) => {
  const response = await apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to place order: ${errorText}`);
  }
  
  return response.json();
}; 