import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const Accounts = () => {
  const [productName, setProductName] = useState('');
  const [date, setDate] = useState('');
  const [totalRupees, setTotalRupees] = useState('');
  const [isResale, setIsResale] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');
  const [voucherNo, setVoucherNo] = useState('');
  const [errors, setErrors] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchNextVoucherNo();
  }, []);

 

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!productName || !date || !totalRupees) {
      setErrors({
        productName: !productName,
        date: !date,
        totalRupees: !totalRupees,
      });
      return;
    }

    try {
      // Prepare data for the POST request
      const data = {
        productName,
        date,
        totalRupees: parseFloat(totalRupees),
        ...(isResale && { quantity, weight, voucherNo })
      };

      // Send POST request to backend
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/add`, data);

      console.log('Expense added:', response.data);

      // Reset form fields and errors
      resetForm();
      setErrors({});

      // Show SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Day to Day Expenses stored successfully.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to store Day to Day Expenses.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    }
  };

  const resetForm = () => {
    setProductName('');
    setDate('');
    setTotalRupees('');
    setIsResale(false);
    setQuantity('');
    setWeight('');
    setVoucherNo('');
  };
 const fetchNextVoucherNo = async () => {
    try {
    
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/next-voucher`);
      console.log('Voucher response:', response.data); // Log response
      setVoucherNo(response.data.voucherNo);
    } catch (error) {
      console.error('Error fetching voucher number:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch voucher number.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    }
  };
  return (
    <Paper
      elevation={3}
      style={{
        padding: '20px',
        margin: 'auto',
        marginTop: '100px',
        maxWidth: '500px',
        width: '100%',
        boxSizing: 'border-box',
      }}
      className="paperbg"
    >
      <Typography variant="h6" align="center" sx={{ mb: 2, color: '#D72122', fontWeight: '550' }}>
        DAY TO DAY EXPENSES
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Expense Description"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              error={errors.productName}
              helperText={errors.productName && 'Product Name is required'}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount"
              value={totalRupees}
              onChange={(e) => setTotalRupees(e.target.value)}
              error={errors.totalRupees}
              helperText={errors.totalRupees && 'Total Rupees is required'}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isResale}
                  onChange={() => setIsResale((prev) => !prev)}
                  color="primary"
                />
              }
              label="Resale"
            />
          </Grid>
          {isResale && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Voucher No"
                  value={voucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                  InputProps={{ readOnly: true }} // Make the field read-only
                />
               
              </Grid>
            </>
          )}
        </Grid>
        <Grid container justifyContent="center" sx={{ mt: 2 }} align="center">
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className='sub-green'
              size={isMobile ? 'small' : 'medium'}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Accounts;
