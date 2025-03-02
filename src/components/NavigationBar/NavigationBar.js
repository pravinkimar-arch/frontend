import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { clearAuth } from '../../utils/authUtils';

function NavigationBar() {
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <Box sx={{ width: '100%', margin: 0 , p: 0 }}>
    <AppBar position="static" sx={{ bgcolor: '#3f51b5', p: 0 }}>
      <Toolbar>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <ShoppingCartIcon sx={{ mr: 1, color: 'white' }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              textDecoration: 'none', 
              color: 'white',
            }}
          >
            upGrad E-Shop
          </Typography>
        </Box>

        {/* Search Bar - Only show if authenticated */}
        {!isAuthPage && (
          <Box sx={{ 
            flexGrow: 1, 
            mx: 2,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 1,
              px: 2,
              width: '40%'
            }}>
              <SearchIcon sx={{ color: 'white' }} />
              <InputBase
                placeholder="Search..."
                sx={{ 
                  ml: 1,
                  flex: 1,
                  color: 'white',
                  '& input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              />
            </Box>
          </Box>
        )}

        {/* Navigation Links */}
        {isAuthPage ? (
          // Auth page navigation
          <Box>
          <Button 
            color="inherit"
            component={Link}
            to="/login"
            sx={{ textTransform: 'none' }}
          >
            Login
          </Button>
          <Button 
            color="inherit"
            component={Link}
            to="/signup"
            sx={{ textTransform: 'none' }}
          >
            Sign Up
          </Button>
        </Box>
        ) : (
          // Authenticated navigation
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="inherit"
              component={Link}
              to="/products"
            >
              Home
            </Button>
            
            {isAdmin && (
              <Button 
                color="inherit"
                component={Link}
                to="/add-product"
              >
                Add Product
              </Button>
            )}

            <Button 
              sx={{ 
                ml: 1,
                bgcolor: '#f50057',
                '&:hover': {
                  bgcolor: '#c51162'
                }
              }}
              onClick={handleLogout}
            >
              LOGOUT
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
    </Box>
  );
}

export default NavigationBar;
