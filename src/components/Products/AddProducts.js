import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  Container 
} from '@mui/material';

function AddProduct() {
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    manufacturer: '',
    availableItems: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('authToken')
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert('Product added successfully!');
        window.location.href = '/products';
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name *"
            margin="normal"
            name="name"
            value={productData.name}
            onChange={(e) => setProductData({...productData, name: e.target.value})}
            required
          />
          <TextField
            fullWidth
            label="Category *"
            margin="normal"
            name="category"
            value={productData.category}
            onChange={(e) => setProductData({...productData, category: e.target.value})}
            required
          />
          <TextField
            fullWidth
            label="Manufacturer *"
            margin="normal"
            name="manufacturer"
            value={productData.manufacturer}
            onChange={(e) => setProductData({...productData, manufacturer: e.target.value})}
            required
          />
          <TextField
            fullWidth
            label="Available Items *"
            margin="normal"
            name="availableItems"
            type="number"
            value={productData.availableItems}
            onChange={(e) => setProductData({...productData, availableItems: e.target.value})}
            required
          />
          <TextField
            fullWidth
            label="Price *"
            margin="normal"
            name="price"
            type="number"
            value={productData.price}
            onChange={(e) => setProductData({...productData, price: e.target.value})}
            required
          />
          <TextField
            fullWidth
            label="Description *"
            margin="normal"
            name="description"
            multiline
            rows={4}
            value={productData.description}
            onChange={(e) => setProductData({...productData, description: e.target.value})}
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2,
              bgcolor: '#3f51b5'
            }}
            fullWidth
          >
            SAVE PRODUCT
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddProduct;
