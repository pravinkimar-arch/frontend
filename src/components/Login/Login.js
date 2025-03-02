import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../utils/auth';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      console.log('Login successful, token received');
      
      // Store the token in localStorage
      localStorage.setItem('authToken', data.token);
      console.log('Token stored in localStorage:', data.token);
      
      // Also store in sessionStorage as backup
      sessionStorage.setItem('authToken', data.token);
      console.log('Token stored in sessionStorage:', data.token);
      
      // Verify the token was stored correctly
      const storedToken = localStorage.getItem('authToken');
      console.log('Verification - token in localStorage:', storedToken);
      
      // Set user info
      setUserInfo(data.user);
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Render your login form here */}
    </div>
  );
};

export default Login; 