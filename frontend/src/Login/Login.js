import React, { useState } from 'react';
import { Button, TextField, Paper, Typography, Container, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';
import './Login.css';

function Login() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [adminIdError, setAdminIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isRootAdmin, setIsRootAdmin] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAdminIdError('');
    setPasswordError('');

    if (!adminId || !password) {
      if (!adminId) setAdminIdError('Admin ID is required');
      if (!password) setPasswordError('Password is required');
      return;
    }

    const success = await login(adminId, password, isRootAdmin);

    if (success) {
      Swal.fire('Success', 'Login successful!', 'success');
      navigate('/dashboard');
    } else {
      Swal.fire('Error', 'Invalid credentials', 'error');
      setAdminIdError('Invalid credentials');
      setPasswordError('Invalid credentials');
    }
  };

  return (
    <div className="signup-bg">
      <Container maxWidth="xs">
        <Paper elevation={3} className="login-container">
          <Typography variant="h5" component="h2" className="login-header">
            Admin Login
          </Typography>
          <form onSubmit={handleSubmit} noValidate className="login-form">
            <TextField
              label="Admin ID"
              type="text"
              fullWidth
              variant="outlined"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              error={!!adminIdError}
              helperText={adminIdError}
              required
              className="login-input"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              required
              className="login-input"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRootAdmin}
                  onChange={(e) => setIsRootAdmin(e.target.checked)}
                  name="rootAdminCheckbox"
                  color="primary"
                />
              }
              label="Root Admin"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="login-button"
            >
             Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
