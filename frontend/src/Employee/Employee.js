import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';

const Employee = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    phoneNumber: '',
    date: '',
    branch: '',
    place: '',
    address: '',
    aadharNumber: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    // Name validation
    if (!employeeData.name) {
      formIsValid = false;
      errors['name'] = 'Name is required';
    }

    // Phone number validation
    if (!employeeData.phoneNumber) {
      formIsValid = false;
      errors['phoneNumber'] = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(employeeData.phoneNumber)) {
      formIsValid = false;
      errors['phoneNumber'] = 'Phone Number should be 10 digits';
    }

    // Address validation
    if (!employeeData.address) {
      formIsValid = false;
      errors['address'] = 'Address is required';
    }

    // Place validation
    if (!employeeData.place) {
      formIsValid = false;
      errors['place'] = 'Place is required';
    }

    // Branch validation
    if (!employeeData.branch) {
      formIsValid = false;
      errors['branch'] = 'Branch is required';
    }

    // Date validation
    if (!employeeData.date) {
      formIsValid = false;
      errors['date'] = 'Date is required';
    }

    // Aadhar number validation
    if (!employeeData.aadharNumber) {
      formIsValid = false;
      errors['aadharNumber'] = 'Aadhar Number is required';
    } else if (!/^\d{12}$/.test(employeeData.aadharNumber)) {
      formIsValid = false;
      errors['aadharNumber'] = 'Aadhar Number should be 12 digits';
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Add your submission logic here (e.g., API call to save data)
      console.log('Submitted data:', employeeData);
      // Reset form after submission
      setEmployeeData({
        name: '',
        phoneNumber: '',
        date: '',
        branch: '',
        place: '',
        address: '',
        aadharNumber: ''
      });
      setErrors({});
    } else {
      console.log('Form has errors. Cannot submit.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={10} sm={8} md={6}>
        <Paper elevation={3} style={{ padding: '20px' }} className='paperbg'>
          <Typography variant="h5" gutterBottom>
           Admin Management
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={employeeData.name}
                  onChange={handleChange}
                  error={!!errors['name']}
                  helperText={errors['name']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={employeeData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors['phoneNumber']}
                  helperText={errors['phoneNumber']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  value={employeeData.date}
                  onChange={handleChange}
                  error={!!errors['date']}
                  helperText={errors['date']}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Branch"
                  name="branch"
                  value={employeeData.branch}
                  onChange={handleChange}
                  error={!!errors['branch']}
                  helperText={errors['branch']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Place"
                  name="place"
                  value={employeeData.place}
                  onChange={handleChange}
                  error={!!errors['place']}
                  helperText={errors['place']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Address"
                  name="address"
                  value={employeeData.address}
                  onChange={handleChange}
                  error={!!errors['address']}
                  helperText={errors['address']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Aadhar Number"
                  name="aadharNumber"
                  value={employeeData.aadharNumber}
                  onChange={handleChange}
                  error={!!errors['aadharNumber']}
                  helperText={errors['aadharNumber']}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Save Employee
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Employee;
