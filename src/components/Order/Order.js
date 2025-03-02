import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getAuthToken, ensureTokenExists, setAuthToken } from '../../utils/authUtils';
import apiService from '../../services/apiService';

const steps = ['Items', 'Select Address', 'Confirm Order'];

function Order() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1); // Start at address selection step
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState({
    name: '',
    contactNumber: '',
    street: '',
    city: '',
    state: '',
    landmark: '',
    zipcode: ''
  });
  const [orderProduct, setOrderProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // First, ensure the token exists by explicitly setting it
    const token = setAuthToken();
    console.log('Order component - Setting auth token:', token ? 'Success' : 'Failed');
    
    // Get product and quantity from localStorage
    const product = JSON.parse(localStorage.getItem('orderProduct'));
    const quantity = localStorage.getItem('orderQuantity');
    
    if (!product || !quantity) {
      console.log('No product or quantity found in localStorage, redirecting to home');
      navigate('/'); // Redirect if no product info
      return;
    }
    
    setOrderProduct(product);
    setOrderQuantity(parseInt(quantity));
    
    // Fetch user addresses
    fetchAddresses();
  }, [navigate]);

  const fetchAddresses = async () => {
    try {
      setError('');
      // Always get a fresh token
      const token = getAuthToken();
      
      if (!token) {
        console.error('No token available for fetching addresses');
        throw new Error('Authentication required');
      }
      
      console.log('Fetching addresses with token:', token.substring(0, 10) + '...');
      
      // Use apiService instead of direct fetch
      const addresses = await apiService.getAddresses();
      console.log('Successfully fetched addresses:', addresses.length);
      setAddresses(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError(error.message);
      
      if (error.message.includes('Authentication required')) {
        console.log('Authentication error, redirecting to login');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    }
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
    setError('');
  };

  const handleNewAddressChange = (field) => (event) => {
    setNewAddress({
      ...newAddress,
      [field]: event.target.value
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newAddress)
      });
      
      if (response.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to add address: ${response.status}`);
      }
      
      const addedAddress = await response.json();
      setAddresses([...addresses, addedAddress]);
      setSelectedAddress(addedAddress.id);
      setSuccessMessage('Address added successfully!');
      
      // Reset form
      setNewAddress({
        name: '',
        contactNumber: '',
        street: '',
        city: '',
        state: '',
        landmark: '',
        zipcode: ''
      });
    } catch (error) {
      console.error('Error adding address:', error);
      setError(error.message);
      
      if (error.message.includes('Authentication required')) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    }
  };

  const handleNext = () => {
    if (activeStep === 1 && !selectedAddress) {
      setError('Please select address!');
      return;
    }
    
    if (activeStep === 2) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select address!');
      return;
    }
    
    try {
      setError('');
      // Always get a fresh token
      const token = getAuthToken();
      
      if (!token) {
        console.error('No token available for placing order');
        throw new Error('Authentication required');
      }
      
      const orderData = {
        quantity: orderQuantity,
        product: orderProduct.id,
        address: selectedAddress
      };
      
      console.log('Placing order with data:', orderData);
      
      // Use our apiService
      await apiService.placeOrder(orderData);
      
      setActiveStep(3);
      setSuccessMessage('Your order is confirmed.');
      
      // Clear order data from localStorage
      localStorage.removeItem('orderProduct');
      localStorage.removeItem('orderQuantity');
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message);
      
      if (error.message.includes('Authentication required')) {
        console.log('Authentication error, redirecting to login');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    }
  };

  const getAddressDisplay = (address) => {
    if (!address) return '';
    return `${address.name}, ${address.street}, ${address.city}, ${address.state}, ${address.zipcode}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 3 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your order is confirmed.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ mt: 3, bgcolor: '#3f51b5' }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Select Address
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Select
                    value={selectedAddress}
                    onChange={handleAddressChange}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <em>Select...</em>;
                      }
                      const address = addresses.find(addr => addr.id === selected);
                      return getAddressDisplay(address);
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select...</em>
                    </MenuItem>
                    {addresses.map((address) => (
                      <MenuItem key={address.id} value={address.id}>
                        {getAddressDisplay(address)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Add Address
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Name"
                      value={newAddress.name}
                      onChange={handleNewAddressChange('name')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Contact Number"
                      value={newAddress.contactNumber}
                      onChange={handleNewAddressChange('contactNumber')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Street"
                      value={newAddress.street}
                      onChange={handleNewAddressChange('street')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="City"
                      value={newAddress.city}
                      onChange={handleNewAddressChange('city')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="State"
                      value={newAddress.state}
                      onChange={handleNewAddressChange('state')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Landmark"
                      value={newAddress.landmark}
                      onChange={handleNewAddressChange('landmark')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Zipcode"
                      value={newAddress.zipcode}
                      onChange={handleNewAddressChange('zipcode')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      variant="contained" 
                      onClick={handleAddAddress}
                      sx={{ bgcolor: '#3f51b5' }}
                    >
                      Save Address
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                
                {orderProduct && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1">
                      <strong>{orderProduct.name}</strong>
                    </Typography>
                    <Typography variant="body1">
                      Quantity: {orderQuantity}
                    </Typography>
                    <Typography variant="body1">
                      Category: {orderProduct.category}
                    </Typography>
                    <Typography variant="h6" color="error" sx={{ mt: 1 }}>
                      Total Price: ₹ {orderProduct.price * orderQuantity}
                    </Typography>
                  </Box>
                )}
                
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                
                {selectedAddress && (
                  <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                    <Typography variant="body1">
                      {getAddressDisplay(addresses.find(addr => addr.id === selectedAddress))}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ bgcolor: '#3f51b5' }}
              >
                {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Error and Success Messages */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Order; 