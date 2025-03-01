import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

function AuthDebug() {
  const [authToken, setAuthToken] = useState('');
  const [tokenStatus, setTokenStatus] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token || 'No token found');
  }, []);
  
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setTokenStatus('No auth token found');
        return;
      }
      
      setTokenStatus('Checking token...');
      
      // Try to make a simple authenticated request
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        setTokenStatus('Token is valid! Status: ' + response.status);
        const data = await response.json();
        console.log('Addresses:', data);
      } else {
        setTokenStatus(`Token is invalid! Status: ${response.status}`);
        const errorText = await response.text();
        console.error('Auth check error:', errorText);
      }
    } catch (error) {
      setTokenStatus('Error checking auth: ' + error.message);
      console.error('Auth check error:', error);
    }
  };
  
  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    setAuthToken('Token cleared');
    setTokenStatus('');
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, m: 2, maxWidth: '600px' }}>
      <Typography variant="h6">Auth Debug</Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 1 }}>
        <strong>Token:</strong> {authToken}
      </Typography>
      {tokenStatus && (
        <Typography variant="body2" sx={{ color: tokenStatus.includes('valid') ? 'green' : 'red', mb: 1 }}>
          <strong>Status:</strong> {tokenStatus}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={checkAuth} sx={{ mr: 1 }}>
          Check Auth
        </Button>
        <Button variant="outlined" color="error" onClick={clearAuth}>
          Clear Auth
        </Button>
      </Box>
    </Paper>
  );
}

export default AuthDebug; 