import React, { useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactNumber: formData.contactNumber
        })
      });

      if (response.ok) {
        alert('Signup successful! Please login with your credentials.');
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-icon">
        <LockIcon color="error" />
      </div>
      <h1>Sign up</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name *"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name *"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address *"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password *"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number *"
          value={formData.contactNumber}
          onChange={handleChange}
          required
        />

        <button type="submit" className="signup-button">
          SIGN UP
        </button>
      </form>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
  Already have an account? <a href="/login">Log In</a>
</div>

      <div className="copyright">
        Copyright © <a href="https://www.upgrad.com">upGrad</a> 2021
      </div>
    </div>
  );
}

export default Signup;
