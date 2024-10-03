import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, TextField, Button, Grid, Typography, Paper } from '@mui/material';

const Salary = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    designation: '',
    date: '',
    salaryAmount: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.employeeName || !formData.designation || !formData.date || !formData.salaryAmount) {
      setErrors({
        employeeName: !formData.employeeName,
        designation: !formData.designation,
        date: !formData.date,
        salaryAmount: !formData.salaryAmount,
      });
      return;
    }

    try {
      // Send POST request to backend
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/salary/add`, {
        employeeName: formData.employeeName,
        designation: formData.designation,
        date: formData.date,
        salaryAmount: parseFloat(formData.salaryAmount), // Ensure it's parsed as a number
      });

      console.log('Salary added:', response.data);

    
      setFormData({
        employeeName: '',
        designation: '',
        date: '',
        salaryAmount: '',
      });
      setErrors({});

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Salary data stored successfully.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding salary:', error);
     
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to store salary data.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Container sx={{mt:15}}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', marginTop:'100px',width:'600px',margin:'auto'}} sx={{ mt: 90 }} className='paperbg'>
        <Typography variant="h6" align="center" sx={{ mb: 2,color:'#D72122',fontWeight:'550' }}>
          SALARY PAYMENT
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee Name"
                name="employeeName"
                variant="outlined"
                fullWidth
            
                value={formData.employeeName}
                onChange={handleInputChange}
                error={errors.employeeName}
                helperText={errors.employeeName && 'Employee Name is required'}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Designation"
                name="designation"
                variant="outlined"
                fullWidth
             
                value={formData.designation}
                onChange={handleInputChange}
                error={errors.designation}
                helperText={errors.designation && 'Designation is required'}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                variant="outlined"
                fullWidth
          
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errors.date}
                helperText={errors.date && 'Date is required'}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Salary Amount"
                name="salaryAmount"
                variant="outlined"
                fullWidth
              
                value={formData.salaryAmount}
                onChange={handleInputChange}
                error={errors.salaryAmount}
                helperText={errors.salaryAmount && 'Salary Amount is required'}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} align="center">
              <Button type="submit" variant="contained" color="primary" className='sub-green'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Salary;
