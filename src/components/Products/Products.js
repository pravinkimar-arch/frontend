import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  IconButton,
  ToggleButtonGroup, 
  ToggleButton,
  Select,
  MenuItem,
  Container
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button as MuiButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../utils/authUtils';
import apiService from '../../services/apiService';

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('');
  const [sortedProducts, setSortedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]); // Store all products for filtering
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Category changed, fetching products for:', selectedCategory);
    fetchProducts();
  }, [selectedCategory]);
  
  useEffect(() => {
    // Apply filtering and sorting whenever relevant states change
    let filtered = [...allProducts];
    
    // Apply category filter
    if (selectedCategory !== 'ALL') {
      const categoryMap = {
        'APPAREL': ['apparel', 'clothing', 'clothes', 'wear'],
        'ELECTRONICS': ['electronics', 'electronic', 'gadget', 'tech'],
        'FOOTWEAR': ['footwear', 'shoes', 'shoe', 'foot wear', 'foot'],
        'PERSONAL CARE': ['personal care', 'personalcare', 'care', 'personal']
      };
      
      const matchTerms = categoryMap[selectedCategory] || [selectedCategory.toLowerCase()];
      
      filtered = filtered.filter(product => {
        if (!product.category) return false;
        const productCategory = product.category.toLowerCase();
        return matchTerms.some(term => productCategory.includes(term));
      });
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        (product.description && product.description.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    
    setProducts(filtered);
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      // Use our apiService instead of direct fetch
      const data = await apiService.getProducts();
      console.log('Fetched all products:', data);
      setAllProducts(data); // Store all products
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Searching for:', searchQuery);
    // The useEffect will handle the actual filtering
  };

  const handleCategoryChange = (event, newCategory) => {
    // Only update if we have a valid category
    if (newCategory) {
      console.log('Setting category to:', newCategory);
      setSelectedCategory(newCategory);
    }
  };

  // Update this useEffect to add a direct event listener for the search form
  useEffect(() => {
    // Function to handle search from the header
    const handleHeaderSearch = (event) => {
      if (event.target && event.target.form && event.target.form.getAttribute('role') === 'search') {
        const query = event.target.value;
        console.log('Search input detected:', query);
        setSearchQuery(query);
      }
    };

    // Function to handle search form submission
    const handleHeaderSearchSubmit = (event) => {
      if (event.target && event.target.getAttribute('role') === 'search') {
        event.preventDefault();
        const searchInput = event.target.querySelector('input[type="search"]');
        if (searchInput) {
          console.log('Search form submitted with query:', searchInput.value);
          setSearchQuery(searchInput.value);
        }
      }
    };

    // Add event listeners
    document.addEventListener('input', handleHeaderSearch);
    document.addEventListener('submit', handleHeaderSearchSubmit);
    
    // Clean up
    return () => {
      document.removeEventListener('input', handleHeaderSearch);
      document.removeEventListener('submit', handleHeaderSearchSubmit);
    };
  }, []);

  useEffect(() => {
    // Listen for the custom search event
    const handleSearchSubmitted = (event) => {
      console.log('Search submitted with query:', event.detail.query);
      setSearchQuery(event.detail.query);
    };
    
    window.addEventListener('searchSubmitted', handleSearchSubmitted);
    
    return () => {
      window.removeEventListener('searchSubmitted', handleSearchSubmitted);
    };
  }, []);

  // Add this useEffect to directly connect to the search input in the header
  useEffect(() => {
    // Find the search input in the DOM
    const searchForm = document.querySelector('form');
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]');
    
    if (searchForm && searchInput) {
      console.log('Found search form and input');
      
      // Handle input changes
      const handleInputChange = () => {
        console.log('Search input changed:', searchInput.value);
        setSearchQuery(searchInput.value);
      };
      
      // Handle form submission
      const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log('Search form submitted with query:', searchInput.value);
        setSearchQuery(searchInput.value);
      };
      
      // Add event listeners
      searchInput.addEventListener('input', handleInputChange);
      searchForm.addEventListener('submit', handleFormSubmit);
      
      // Clean up
      return () => {
        searchInput.removeEventListener('input', handleInputChange);
        searchForm.removeEventListener('submit', handleFormSubmit);
      };
    } else {
      console.warn('Could not find search form or input in the DOM');
    }
  }, []);

  // Add this useEffect to check if we need to show the Add Product button
  useEffect(() => {
    // This is just to ensure the component is aware of the admin status
    // The actual Add Product button is likely in the header component
    const isAdminUser = localStorage.getItem('isAdmin') === 'true';
    console.log('User is admin:', isAdminUser);
    
    // You could dispatch an event to notify the header about the admin status
    // if that's how your app is structured
    window.dispatchEvent(new CustomEvent('userStatusChecked', {
      detail: { isAdmin: isAdminUser }
    }));
  }, []);

  // Add this function to handle the Buy button click
  const handleBuyClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container maxWidth={false} sx={{ p: 0 }}>
      {/* Category Tabs using regular buttons */}
      <Box sx={{ 
        bgcolor: '#f5f5f5', 
        display: 'flex', 
        justifyContent: 'center',
        width: '100%',
        mb: 3
      }}>
        <Box sx={{ display: 'flex' }}>
          {['ALL', 'APPAREL', 'ELECTRONICS', 'FOOTWEAR', 'PERSONAL CARE'].map((category) => (
            <MuiButton
              key={category}
              onClick={() => {
                console.log('Button clicked:', category);
                setSelectedCategory(category);
              }}
              sx={{
                color: '#666666',
                textTransform: 'none',
                px: 4,
                py: 1,
                borderRadius: 0,
                backgroundColor: selectedCategory === category ? '#fff' : 'transparent',
                '&:hover': {
                  backgroundColor: selectedCategory === category ? '#fff' : '#e0e0e0',
                }
              }}
            >
              {category}
            </MuiButton>
          ))}
        </Box>
      </Box>

      {/* Search Bar - Connect to the search input in the header */}
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'none' }}>
        <input 
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
      </Box>

      {/* Sort Dropdown */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Typography component="span" sx={{ mr: 2 }}>Sort By:</Typography>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          displayEmpty
          sx={{ 
            minWidth: 200,
            height: 40,
            '& .MuiSelect-select': {
              py: 0.5
            }
          }}
        >
          <MenuItem value="">Select...</MenuItem>
          <MenuItem value="price_asc">Price: Low to High</MenuItem>
          <MenuItem value="price_desc">Price: High to Low</MenuItem>
          <MenuItem value="newest">Newest</MenuItem>
        </Select>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3} sx={{ px: 3 }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="h6" color="text.primary">
                  ₹ {product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {product.description}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 'auto' 
                }}>
                  <Button 
                    variant="contained"
                    onClick={() => handleBuyClick(product.id)}
                    sx={{ 
                      bgcolor: '#3f51b5',
                      '&:hover': { bgcolor: '#303f9f' }
                    }}
                  >
                    BUY
                  </Button>
                  {isAdmin && (
                    <Box>
                      <IconButton>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Products;
