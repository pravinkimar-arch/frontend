import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Chip
} from '@mui/material';
import { getAuthToken } from '../../utils/authToken';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch product details when component mounts
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`https://dev-project-ecommerce.upgrad.dev/api/products/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product details: ${response.status}`);
      }

      const data = await response.json();
      console.log('Product details:', data);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.availableItems || 1)) {
      setQuantity(value);
    }
  };

  const handlePlaceOrder = () => {
    // Store product and quantity information for the order page
    localStorage.setItem('orderProduct', JSON.stringify(product));
    localStorage.setItem('orderQuantity', quantity);
    
    // Get the token using our utility
    const token = getAuthToken();
    console.log('Token in ProductDetails before navigating:', token);
    
    // Navigate to the order page
    navigate('/order');
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5">Loading product details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error">Error: {error}</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5">Product not found</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '400px', 
                  objectFit: 'contain' 
                }} 
              />
            ) : (
              <Typography variant="body1" color="textSecondary">
                Image not available
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                Category:
              </Typography>
              <Chip 
                label={product.category} 
                color="primary" 
                size="small" 
                sx={{ bgcolor: '#3f51b5' }} 
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                {product.description}
              </Typography>
            </Box>

            <Typography variant="h5" color="error" sx={{ mb: 2 }}>
              ₹ {product.price}
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={`Available Quantity: ${product.availableItems}`} 
                color="primary" 
                variant="outlined"
                sx={{ borderColor: '#3f51b5', color: '#3f51b5' }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" component="label" htmlFor="quantity" sx={{ mb: 1, display: 'block' }}>
                Enter Quantity *
              </Typography>
              <TextField
                id="quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ 
                  min: 1, 
                  max: product.availableItems,
                  step: 1
                }}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Box>

            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={handlePlaceOrder}
              sx={{ 
                bgcolor: '#3f51b5',
                '&:hover': { bgcolor: '#303f9f' },
                py: 1,
                px: 4
              }}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetails; 