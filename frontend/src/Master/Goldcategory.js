import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Badge from 'react-bootstrap/Badge';

import { format, isValid, parseISO } from 'date-fns';

const GoldLoanCategory = () => {
  const [formData, setFormData] = useState({
    loanNumber: '', 
    customerName: '',
    loanCategory: '',
    date: '',
    metal: [],
    productName: '',
    eligibilityCriteria: [],
    processingFees: '',
    customMetal: '', 
  });

  const [validationErrors, setValidationErrors] = useState({
    loanNumber: false,
    customerName: false,
    loanCategory: false,
    date: false,
    metal: false,
    productName: false,
    eligibilityCriteria: false,
    processingFees: false,
    customMetal: false, 
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [nextLoanNumber, setNextLoanNumber] = useState('');
  const [displayedLoanNumber, setDisplayedLoanNumber] = useState('');
  const [initialLoanNumber, setInitialLoanNumber] = useState('');

  useEffect(() => {
    const fetchLatestLoanNumber = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/entry/latest-loan-number`);
        const data = await response.json();
        if (data.latestLoanNumber) {
          const nextLoanNumber = incrementLoanNumber(data.latestLoanNumber);
          setNextLoanNumber(nextLoanNumber);
          setDisplayedLoanNumber(nextLoanNumber); 
          setInitialLoanNumber(nextLoanNumber); 
        } else {
          const defaultLoanNumber = 'GL001';
          setNextLoanNumber(defaultLoanNumber);
          setDisplayedLoanNumber(defaultLoanNumber); 
          setInitialLoanNumber(defaultLoanNumber); 
        }
      } catch (error) {
        console.error('Error fetching latest loan number:', error);
      }
    };

    fetchLatestLoanNumber();
  }, []);

  const incrementLoanNumber = (loanNumber) => {
    const prefix = loanNumber.match(/[A-Za-z]+/)[0];
    const number = parseInt(loanNumber.match(/\d+/)[0], 10) + 1;
    return prefix + number.toString().padStart(3, '0');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'loanNumber') {
    
      const pattern = /^GL\d{3,}$/;
      if (pattern.test(value)) {
        setFormData({ ...formData, [name]: value.toUpperCase() });
        setValidationErrors({ ...validationErrors, [name]: false });
      } else {
        setFormData({ ...formData, [name]: value.toUpperCase() });
        setValidationErrors({ ...validationErrors, [name]: true });
      }
    } else if (name === 'date') {
   
      if (isValid(parseISO(value))) {
        setFormData({ ...formData, [name]: value });
        setValidationErrors({ ...validationErrors, [name]: false });
      } else {
        setValidationErrors({ ...validationErrors, [name]: true });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === 'metal' && value.includes('Others')) {
      setOpenDialog(true); 
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = () => {
    if (formData.customMetal.trim() !== '') {
      const updatedMetals = [...formData.metal, formData.customMetal];
      setFormData({ ...formData, metal: updatedMetals, customMetal: '' });
      setOpenDialog(false);
    } else {
      setValidationErrors({ ...validationErrors, customMetal: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      if (formData.loanNumber !== initialLoanNumber) {
        throw new Error('Loan number has been changed, please check before submitting');
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/entry/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add entry');
      }

      console.log('Entry added successfully');

  
      const nextLoanNumber = incrementLoanNumber(formData.loanNumber);
      setNextLoanNumber(nextLoanNumber);
      setDisplayedLoanNumber(nextLoanNumber); 

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Gold loan entry added successfully',
      });

      setFormData({
        loanNumber: '',
        customerName: '',
        loanCategory: '',
        date: '',
        metal: [],
        productName: '',
        eligibilityCriteria: [],
        processingFees: '',
      });

    } catch (error) {
      console.error('Error adding entry:', error.message);
      // Handle error, show error message to the user
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }} className='paperbg' sx={{ mt: 5 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={10}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Gold Loan Entry</h2>
          </Grid>
          <Grid item xs={12} sm={2} style={{ textAlign: 'center' }}>
            <Button variant="contained" color="primary" className='cate-btn'>
              Next LoanNo:<Badge bg="warning" className='cate '>{nextLoanNumber}</Badge>
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Loan Number"
              name="loanNumber"
              value={formData.loanNumber}
              onChange={handleInputChange}
              error={validationErrors.loanNumber}
              helperText={
                validationErrors.loanNumber
                  ? 'Loan number must start with GL and be at least 5 characters long (e.g., GL001)'
                  : ''
              }
              variant="outlined"
              fullWidth
              style={{ marginBottom: '10px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              error={validationErrors.customerName}
              helperText={validationErrors.customerName ? 'Customer name is required' : ''}
              variant="outlined"
              fullWidth
              style={{ marginBottom: '10px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth style={{ marginBottom: '10px' }}>
              <InputLabel>Loan Category</InputLabel>
              <Select
                label="Loan Category"
                name="loanCategory"
                value={formData.loanCategory}
                onChange={handleInputChange}
                error={validationErrors.loanCategory}
              >
                <MenuItem value="Business Loan">Business Loan</MenuItem>
                <MenuItem value="Personal Loan">Personal Loan</MenuItem>
                <MenuItem value="Home Loan">Home Loan</MenuItem>
                <MenuItem value="Educational Loan">Educational Loan</MenuItem>
                <MenuItem value="Emergency Loan">Emergency Loan</MenuItem>
              </Select>
              {validationErrors.loanCategory && (
                <FormHelperText error>Loan category is required</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              error={validationErrors.date}
              helperText={validationErrors.date ? 'Valid date format required' : ''}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: '10px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth style={{ marginBottom: '10px' }}>
              <InputLabel>Metal</InputLabel>
              <Select
                label="Metal"
                name="metal"
                multiple
                value={formData.metal}
                onChange={handleSelectChange}
                error={validationErrors.metal || validationErrors.customMetal}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="Gold">Gold</MenuItem>
                <MenuItem value="Silver">Silver</MenuItem>
                <MenuItem value="Platinum">Platinum</MenuItem>
                <MenuItem value="Diamond">Diamond</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
              {(validationErrors.metal || validationErrors.customMetal) && (
                <FormHelperText error>
                  {validationErrors.metal ? 'Metal is required' : ''}
                  {validationErrors.metal && validationErrors.customMetal ? ', ' : ''}
                  {validationErrors.customMetal ? 'Custom metal name is required' : ''}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              error={validationErrors.productName}
              helperText={validationErrors.productName ? 'Product name is required' : ''}
              variant="outlined"
              fullWidth
              style={{ marginBottom: '10px' }}
            />
          </Grid>

       
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth style={{ marginBottom: '10px' }}>
              <InputLabel>Eligibility Criteria</InputLabel>
              <Select
                label="Eligibility Criteria"
                name="eligibilityCriteria"
                multiple
                value={formData.eligibilityCriteria}
                onChange={handleSelectChange}
                error={validationErrors.eligibilityCriteria}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="ageAbove18">Age above 18</MenuItem>
                <MenuItem value="identityProof">Identity proof</MenuItem>
              </Select>
              {validationErrors.eligibilityCriteria && (
                <FormHelperText error>
                  Select at least two eligibility criteria
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Processing Fees"
              name="processingFees"
              value={formData.processingFees}
              onChange={handleInputChange}
              error={validationErrors.processingFees}
              helperText={validationErrors.processingFees ? 'Processing fees are required' : ''}
              variant="outlined"
              fullWidth
              style={{ marginBottom: '10px' }}
            />
          </Grid>


          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Enter Custom Metal Name</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Custom Metal Name"
                name="customMetal"
                value={formData.customMetal}
                onChange={handleInputChange}
                error={validationErrors.customMetal}
                helperText={validationErrors.customMetal ? 'Custom metal name is required' : ''}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleDialogSubmit}>Add</Button>
            </DialogActions>
          </Dialog>

          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default GoldLoanCategory;
