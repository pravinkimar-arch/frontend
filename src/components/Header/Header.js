import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, InputBase, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin - force this to true for testing
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    console.log('Admin status from localStorage:', adminStatus);
    setIsAdmin(adminStatus);
    
    // For testing, you can force it to true
    // setIsAdmin(true);
    
    // Listen for admin status updates from other components
    const handleUserStatusCheck = (event) => {
      if (event.detail && event.detail.isAdmin !== undefined) {
        setIsAdmin(event.detail.isAdmin);
      }
    };
    
    window.addEventListener('userStatusChecked', handleUserStatusCheck);
    
    return () => {
      window.removeEventListener('userStatusChecked', handleUserStatusCheck);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    localStorage.setItem('searchQuery', e.target.value);
    window.dispatchEvent(new Event('searchUpdated'));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchEvent = new CustomEvent('searchSubmitted', {
      detail: { query: searchQuery }
    });
    window.dispatchEvent(searchEvent);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#3f51b5' }}>
      <Toolbar>
        {/* Logo and Shop Name */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'white' }}
          >
            upGrad E-Shop
          </Typography>
        </Box>
        
        {/* Search Bar */}
        <Box 
          component="form"
          onSubmit={handleSearchSubmit}
          role="search"
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 1,
            px: 1,
            mx: 'auto',
            maxWidth: 400,
            width: '100%'
          }}
        >
          <SearchIcon sx={{ color: 'white', mr: 1 }} />
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ color: 'white', width: '100%' }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>
        
        {/* Navigation Links */}
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ color: 'white' }}
          >
            Home
          </Button>
          
          {/* Add Product button - always visible for testing */}
          <Button 
            color="inherit" 
            component={Link} 
            to="/add-product"
            sx={{ 
              ml: 1,
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            Add Product
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/logout"
            sx={{ 
              bgcolor: '#f44336',
              '&:hover': { bgcolor: '#d32f2f' },
              ml: 1
            }}
          >
            LOGOUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header; 