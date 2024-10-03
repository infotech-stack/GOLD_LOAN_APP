import React, { useState } from 'react';
import { Button, TextField, Box, Paper, Typography } from '@mui/material';
import Swal from 'sweetalert2';

const AddAdminPage = () => {
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [loginAdminId, setLoginAdminId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errors, setErrors] = useState({ adminId: '', password: '' });

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rootadmin/registers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rootAdminId: newAdminId,
            password: newAdminPassword
          })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Swal.fire('Success', data.message, 'success');
          // Clear form fields
          setNewAdminId('');
          setNewAdminPassword('');
        } else {
          Swal.fire('Error', data.message || 'Failed to create or update root admin.', 'error');
        }
      } catch (error) {
        console.error('Error creating root admin:', error);
        Swal.fire('Error', 'An error occurred while creating or updating root admin.', 'error');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/rootadmin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rootAdminId: loginAdminId,
          password: loginPassword
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Swal.fire('Success', data.message, 'success');
        // Handle successful login (e.g., store the token or redirect)
      } else {
        Swal.fire('Error', data.message || 'Failed to login.', 'error');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Swal.fire('Error', 'An error occurred while logging in.', 'error');
    }
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = { adminId: '', password: '' };

    if (!newAdminId) {
      formIsValid = false;
      errors.adminId = 'Admin ID is required';
    }

    if (!newAdminPassword) {
      formIsValid = false;
      errors.password = 'Password is required';
    } else if (newAdminPassword.length < 6) {
      formIsValid = false;
      errors.password = 'Password must be at least 6 characters long';
    }

    setErrors(errors);
    return formIsValid;
  };

  return (
  
      <Paper sx={{ padding: 4, maxWidth: 400, width: '100%', boxShadow: 3,margin:'auto',mt:20 }} className='paperbg'>
        <Typography variant="h6" gutterBottom sx={{color:'#D72122',fontWeight:'550',textAlign:'center'}}>
          Change RootAdmin Password
        </Typography>
        <form onSubmit={handleCreateAdmin}>
          <TextField
            margin="dense"
            id="newAdminId"
            label="Admin ID"
            type="text"
            fullWidth
            variant="outlined"
            value={newAdminId}
            onChange={(e) => setNewAdminId(e.target.value)}
            error={Boolean(errors.adminId)}
            helperText={errors.adminId}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black',
                },
              },
            }}
          />
          <TextField
            margin="dense"
            id="newAdminPassword"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
            error={Boolean(errors.password)}
            helperText={errors.password}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black',
                },
              },
            }}
          />
          <Box sx={{ mt: 2 }} align="center">
            <Button type="submit" variant="contained" color="primary" className='sub-green'>
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
   
  );
};

export default AddAdminPage;
