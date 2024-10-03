import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';

const LoanRetrieved = () => {
  const [formData, setFormData] = useState({
    loanNumber: '',
    customerName: '',
    place: '',
    address: '',
    fatherName: '',
    dateOfRetrieval: '',
    pendingAmount: '',
    totalAmountPaid: '',
    productName: '',
    quantity: '',
    interestRate: '',
    weight: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!formData.loanNumber.startsWith('GL') || formData.loanNumber.length < 5) {
      formIsValid = false;
      errors['loanNumber'] = 'Loan number must start with GL and be at least 5 characters long (e.g., GL001)';
    }

    if (!formData.customerName) {
      formIsValid = false;
      errors['customerName'] = 'Customer name is required';
    }

    if (!formData.place) {
      formIsValid = false;
      errors['place'] = 'Place is required';
    }

    if (!formData.address) {
      formIsValid = false;
      errors['address'] = 'Address is required';
    }

    if (!formData.fatherName) {
      formIsValid = false;
      errors['fatherName'] = 'Father name is required';
    }

    if (!formData.dateOfRetrieval) {
      formIsValid = false;
      errors['dateOfRetrieval'] = 'Date of retrieval is required';
    }

    if (!formData.pendingAmount) {
      formIsValid = false;
      errors['pendingAmount'] = 'Pending amount is required';
    } else if (isNaN(formData.pendingAmount)) {
      formIsValid = false;
      errors['pendingAmount'] = 'Pending amount must be a number';
    }

    if (!formData.totalAmountPaid) {
      formIsValid = false;
      errors['totalAmountPaid'] = 'Total amount paid is required';
    } else if (isNaN(formData.totalAmountPaid)) {
      formIsValid = false;
      errors['totalAmountPaid'] = 'Total amount paid must be a number';
    }

    if (!formData.productName) {
      formIsValid = false;
      errors['productName'] = 'Product name is required';
    }

    if (!formData.quantity) {
      formIsValid = false;
      errors['quantity'] = 'Quantity is required';
    } else if (isNaN(formData.quantity)) {
      formIsValid = false;
      errors['quantity'] = 'Quantity must be a number';
    }

    if (!formData.interestRate) {
      formIsValid = false;
      errors['interestRate'] = 'Interest rate is required';
    } else if (isNaN(formData.interestRate)) {
      formIsValid = false;
      errors['interestRate'] = 'Interest rate must be a number';
    }

    if (!formData.weight) {
      formIsValid = false;
      errors['weight'] = 'Weight is required';
    } else if (isNaN(formData.weight)) {
      formIsValid = false;
      errors['weight'] = 'Weight must be a number';
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Submitted data:', formData);
      // Reset form after submission
      setFormData({
        loanNumber: '',
        customerName: '',
        place: '',
        address: '',
        fatherName: '',
        dateOfRetrieval: '',
        pendingAmount: '',
        totalAmountPaid: '',
        productName: '',
        quantity: '',
        interestRate: '',
        weight: ''
      });
      setErrors({});
    } else {
      console.log('Form has errors. Cannot submit.');
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '70px' }}>
      <Paper elevation={2} style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }} sx={{mt:6}} className='paperbg'>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Loan Retrieved Form</h1>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loan Number"
                name="loanNumber"
                value={formData.loanNumber}
                onChange={handleChange}
                error={!!errors['loanNumber']}
                helperText={errors['loanNumber']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                error={!!errors['customerName']}
                helperText={errors['customerName']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Place"
                name="place"
                value={formData.place}
                onChange={handleChange}
                error={!!errors['place']}
                helperText={errors['place']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors['address']}
                helperText={errors['address']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                error={!!errors['fatherName']}
                helperText={errors['fatherName']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Retrieval"
                name="dateOfRetrieval"
                type="date"
                value={formData.dateOfRetrieval}
                onChange={handleChange}
                error={!!errors['dateOfRetrieval']}
                helperText={errors['dateOfRetrieval']}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pending Amount"
                name="pendingAmount"
                value={formData.pendingAmount}
                onChange={handleChange}
                error={!!errors['pendingAmount']}
                helperText={errors['pendingAmount']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Amount Paid"
                name="totalAmountPaid"
                value={formData.totalAmountPaid}
                onChange={handleChange}
                error={!!errors['totalAmountPaid']}
                helperText={errors['totalAmountPaid']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                error={!!errors['productName']}
                helperText={errors['productName']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                error={!!errors['quantity']}
                helperText={errors['quantity']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interest Rate"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                error={!!errors['interestRate']}
                helperText={errors['interestRate']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                error={!!errors['weight']}
                helperText={errors['weight']}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default LoanRetrieved;
