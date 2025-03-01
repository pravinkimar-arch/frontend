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
  Alert,
  FormHelperText,
  IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AuthDebug from '../AuthDebug/AuthDebug';
import { getAuthToken } from '../../utils/authToken';
import CloseIcon from '@mui/icons-material/Close';

const steps = ['Items', 'Select Address', 'Confirm Order'];

function Order() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
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
  const [addAddressError, setAddAddressError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Get product details from localStorage
    const storedProduct = localStorage.getItem('selectedProduct');
    const storedQuantity = localStorage.getItem('selectedQuantity');
    
    if (storedProduct) {
      setOrderProduct(JSON.parse(storedProduct));
    }
    
    if (storedQuantity) {
      setOrderQuantity(parseInt(storedQuantity));
    }
    
    // Fetch addresses
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setError('');
      const token = getAuthToken();
      
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch addresses. Please try again.');
      }
      
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleNewAddressChange = (event) => {
    const { name, value } = event.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async () => {
    try {
      // Validate required fields
      if (!newAddress.name || !newAddress.street || !newAddress.city || 
          !newAddress.state || !newAddress.zipcode || !newAddress.contactNumber) {
        setAddAddressError('All fields are required');
        return;
      }
      
      // Validate zipcode (should be numeric and 6 digits)
      if (!/^\d{6}$/.test(newAddress.zipcode)) {
        setAddAddressError('Zipcode should be a 6-digit number');
        return;
      }
      
      // Validate contact number (should be numeric and 10 digits)
      if (!/^\d{10}$/.test(newAddress.contactNumber)) {
        setAddAddressError('Contact number should be a 10-digit number');
        return;
      }
      
      setAddAddressError('');
      
      const token = getAuthToken();
      
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newAddress)
      });
      
      if (response.status === 401) {
        setAddAddressError('Your session has expired. Please log in again.');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to add address. Please try again.');
      }
      
      const data = await response.json();
      
      // Add the new address to the list and select it
      setAddresses([...addresses, data]);
      setSelectedAddress(data.id);
      
      // Reset the form and hide it
      setNewAddress({
        name: '',
        contactNumber: '',
        street: '',
        city: '',
        state: '',
        landmark: '',
        zipcode: ''
      });
      setShowAddressForm(false);
    } catch (error) {
      setAddAddressError(error.message);
    }
  };

  const handleNext = () => {
    if (activeStep === 1 && !selectedAddress) {
      setError('Please select an address');
      return;
    }
    
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        setError('Please select an address');
        return;
      }
      
      setError('');
      
      const token = getAuthToken();
      
      const orderData = {
        productId: orderProduct.id,
        addressId: selectedAddress,
        quantity: orderQuantity
      };
      
      const response = await fetch('https://dev-project-ecommerce.upgrad.dev/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(orderData)
      });
      
      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to place order. Please try again.');
      }
      
      const data = await response.json();
      
      setSuccessMessage('Your order is confirmed.');
      setActiveStep(2); // Move to the confirmation step
    } catch (error) {
      setError(error.message);
    }
  };

  const renderAddressForm = () => {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Add Address
        </Typography>
        
        {addAddressError && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2, 
              bgcolor: '#e57373', 
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setAddAddressError('')}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {addAddressError}
          </Alert>
        )}
        
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            required
            value={newAddress.name}
            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Name *"
          />
          
          <TextField
            fullWidth
            label="Contact Number"
            variant="outlined"
            required
            value={newAddress.contactNumber}
            onChange={(e) => setNewAddress({ ...newAddress, contactNumber: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Contact Number *"
          />
          
          <TextField
            fullWidth
            label="Street"
            variant="outlined"
            required
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Street *"
          />
          
          <TextField
            fullWidth
            label="City"
            variant="outlined"
            required
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="City *"
          />
          
          <TextField
            fullWidth
            label="State"
            variant="outlined"
            required
            value={newAddress.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="State *"
          />
          
          <TextField
            fullWidth
            label="Landmark"
            variant="outlined"
            value={newAddress.landmark}
            onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Landmark"
          />
          
          <TextField
            fullWidth
            label="Zip Code"
            variant="outlined"
            required
            value={newAddress.zipcode}
            onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Zip Code *"
          />
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAddress}
            sx={{ 
              mt: 2, 
              py: 1.5,
              bgcolor: '#3f51b5',
              '&:hover': {
                bgcolor: '#303f9f'
              }
            }}
          >
            SAVE ADDRESS
          </Button>
        </Box>
      </Box>
    );
  };

  const renderAddressError = () => {
    if (!error) return null;
    
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 2, 
          bgcolor: '#e57373', 
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white'
          }
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setError('')}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6">Order Summary</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                {orderProduct?.imageUrl ? (
                  <img 
                    src={orderProduct.imageUrl} 
                    alt={orderProduct.name} 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                  />
                ) : (
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: '200px', 
                      bgcolor: '#f5f5f5', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Typography>No Image Available</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6">{orderProduct?.name}</Typography>
                <Typography variant="body1" color="textSecondary">
                  Category: {orderProduct?.category}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {orderProduct?.description}
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  ₹{orderProduct?.price}
                </Typography>
                <Typography variant="body2">
                  Quantity: {orderQuantity}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            {renderAddressError()}
            
            {!showAddressForm ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Select Address
                </Typography>
                
                {addresses.length > 0 ? (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="address-select-label">Select Address</InputLabel>
                    <Select
                      labelId="address-select-label"
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      label="Select Address"
                    >
                      {addresses.map((address) => (
                        <MenuItem key={address.id} value={address.id}>
                          {address.name}, {address.street}, {address.city}, {address.state}, {address.zipcode}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    No saved addresses found.
                  </Typography>
                )}
                
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowAddressForm(true)}
                  sx={{ mb: 2 }}
                >
                  Add New Address
                </Button>
              </>
            ) : (
              <>
                {renderAddressForm()}
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setShowAddressForm(false)}
                  sx={{ mt: 2 }}
                >
                  Back to Address Selection
                </Button>
              </>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            {successMessage ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" color="primary">
                  {successMessage}
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h6">Order Confirmation</Typography>
                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Product:</strong> {orderProduct?.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Quantity:</strong> {orderQuantity}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Price:</strong> ₹{orderProduct?.price}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total:</strong> ₹{orderProduct?.price * orderQuantity}
                  </Typography>
                  
                  {selectedAddress && addresses.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1">
                        <strong>Delivery Address:</strong>
                      </Typography>
                      {(() => {
                        const address = addresses.find(a => a.id === selectedAddress);
                        return address ? (
                          <Typography variant="body2">
                            {address.name}, {address.street}, {address.city}, {address.state}, {address.zipcode}
                          </Typography>
                        ) : null;
                      })()}
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Only show in development */}
      {process.env.NODE_ENV === 'development' && <AuthDebug />}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - your order is confirmed!
              </Typography>
            </div>
          ) : (
            <div>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  color="primary"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ 
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}
                >
                  BACK
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? placeOrder : handleNext}
                  sx={{ 
                    bgcolor: '#3f51b5',
                    '&:hover': {
                      bgcolor: '#303f9f'
                    },
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}
                >
                  {activeStep === steps.length - 1 ? 'PLACE ORDER' : 'NEXT'}
                </Button>
              </Box>
            </div>
          )}
        </div>
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