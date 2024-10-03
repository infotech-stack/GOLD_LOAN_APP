import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
  useMediaQuery,
  useTheme,
  Grid,
  TextField,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TableDialog = ({ open, onClose, formData, setFormData, handleSubmit,initialData,}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showAllButtons, setShowAllButtons] = useState(true); // Show all buttons initially
  const [editableFormData, setEditableFormData] = useState({ ...formData });

  useEffect(() => {
    setEditableFormData({ ...initialData });
  }, [initialData]);


  const handleClose = () => {
    onClose();
  };

  const handleEdit = () => {
    setPasswordDialogOpen(true);
  };

  const handleDelete = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = () => {
    if (password === 'gold_loan') {
      setPasswordError(false);
      setEditMode(true);
      setPassword(''); // Clear password field after successful submission
      setPasswordDialogOpen(false); // Close password dialog
    } else {
      setPasswordError(true);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
    setPassword('');
    setPasswordError(false);
  };

  const handleDialogClose = () => {
    setEditMode(false);
    setShowAllButtons(true); // Show all buttons on close
    handleClose();
  };

  const handleInputChange = (key, value) => {
    setEditableFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleProductChange = (index, key, value) => {
    const updatedProducts = editableFormData.products.map((product, i) =>
      i === index ? { ...product, [key]: value } : product
    );
    setEditableFormData((prevData) => ({
      ...prevData,
      products: updatedProducts,
    }));
  };

 

  const getFieldLabel = (key) => {
    switch (key) {
      case 'loanNumber':
        return 'Loan Number';
      case 'date':
        return 'Date';
      case 'customerName':
        return 'Customer Name';
      case 'fatherName':
        return "Father's Name";
      case 'place':
        return 'Place';
      case 'address':
        return 'Address';
      case 'phone':
        return 'Phone';
      case 'metal':
        return 'Metal';
      case 'markRate':
        return 'Mark Rate';
      case 'loanValue':
        return 'Loan Value';
      case 'intRate':
        return 'Interest Rate';
      case 'intType':
        return 'Interest Type';
      case 'monrate':
        return 'Monthly Rate';
      case 'monfirrate':
        return 'Monthly First Rate';
      case 'docCharges':
        return 'Document Charges';
      case 'party':
        return 'Party';
      case 'returnDate':
        return 'Return Date';
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };


  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" sx={{ overflowX: 'hidden' }}>
        <DialogTitle>
          Form Data
          <IconButton aria-label="close" onClick={handlePasswordDialogClose} sx={{ position: 'absolute', right: 8, top: 8, color: 'inherit' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer
            component={Paper}
            sx={{
              margin: '10px',
              ...(isSmallScreen ? { width: '100%', overflowX: 'auto' } : { width: 'auto' }),
            }}
          >
            <Table aria-label="simple table" sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Field Name</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Render non-product fields */}
                {Object.keys(editableFormData).map((key) =>
                  key !== 'products' && (
                    <TableRow key={key}>
                      <TableCell>{getFieldLabel(key)}</TableCell>
                      <TableCell>
                        {editMode ? (
                          <TextField
                            fullWidth
                            value={editableFormData[key]}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                          />
                        ) : (
                          editableFormData[key]
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}

                {/* Render products if available */}
                {editableFormData.products &&
                  editableFormData.products.map((product, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>
                          {editMode ? (
                            <TextField
                              fullWidth
                              value={product.productName}
                              onChange={(e) =>
                                handleProductChange(index, 'productName', e.target.value)
                              }
                            />
                          ) : (
                            product.productName
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Product Seal</TableCell>
                        <TableCell>
                          {editMode ? (
                            <TextField
                              fullWidth
                              value={product.productSeal}
                              onChange={(e) =>
                                handleProductChange(index, 'productSeal', e.target.value)
                              }
                            />
                          ) : (
                            product.productSeal
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Quantity</TableCell>
                        <TableCell>
                          {editMode ? (
                            <TextField
                              fullWidth
                              value={product.quantity}
                              onChange={(e) =>
                                handleProductChange(index, 'quantity', e.target.value)
                              }
                            />
                          ) : (
                            product.quantity
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weight</TableCell>
                        <TableCell>
                          {editMode ? (
                            <TextField
                              fullWidth
                              value={product.weight}
                              onChange={(e) =>
                                handleProductChange(index, 'weight', e.target.value)
                              }
                            />
                          ) : (
                            product.weight
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2} justifyContent="flex-end">
            {showAllButtons && (
              <>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="add-prods"
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleDelete}
                    className="add-prods"
                  >
                    Delete
                  </Button>
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleEdit}
                className="add-prods"
              >
                Edit
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleClose}
                className="add-prods"
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            helperText={passwordError && 'Incorrect password. Please try again.'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePasswordSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableDialog;

