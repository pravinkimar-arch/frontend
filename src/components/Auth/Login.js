import React, { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });
      
      if (response.ok) {
        const token = response.headers.get('x-auth-token');
        localStorage.setItem('authToken', token);
        window.location.href = 'products';
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <div style={{ backgroundColor: '#f50057', borderRadius: '50%', padding: '10px', marginBottom: '20px' }}>
        <LockIcon style={{ color: 'white' }} />
      </div>
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address *"
            required
            style={{ width: '100%', padding: '10px', backgroundColor: '#f5f5f5' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password *"
            required
            style={{ width: '100%', padding: '10px', backgroundColor: '#f5f5f5' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '110%',
            padding: '10px',
            backgroundColor: '#3f51b5',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          SIGN IN
        </button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <a href="/signup" style={{ color: '#3f51b5', textDecoration: 'none' }}>
          Don't have an account? Sign Up
        </a>
      </div>
      <div style={{ marginTop: '50px', color: 'gray' }}>
        Copyright © upGrad 2021
      </div>
    </div>
  );
}

export default Login;
