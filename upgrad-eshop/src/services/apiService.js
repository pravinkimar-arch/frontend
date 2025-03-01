const API_BASE_URL = 'https://dev-project-ecommerce.upgrad.dev/api';

const apiService = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (response.ok) {
      const token = response.headers.get('x-auth-token');
      localStorage.setItem('authToken', token);
      return await response.json();
    }
    throw new Error('Login failed');
  },

  getProducts: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: { 'x-auth-token': token }
    });
    if (response.ok) return await response.json();
    throw new Error('Failed to fetch products');
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Signup failed');
  }
};
export default apiService;
