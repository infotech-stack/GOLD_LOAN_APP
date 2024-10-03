import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';


import { Button } from "react-bootstrap";
const RepledgeDialog = ({ open, handleClose, entries, fetchEntries }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [updatedEntry, setUpdatedEntry] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleEditClick = (entry) => {
    const { _id, __v, ...editableEntry } = entry;
    setSelectedEntry(entry);
    setUpdatedEntry(editableEntry);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedEntry(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/repledge/${selectedEntry._id}`, updatedEntry);
      fetchEntries(); 
      setSnackbarMessage('Edited successfully');
      setOpenSnackbar(true);
      handleEditClose();
    } catch (error) {
      console.error('Failed to update the entry', error);
      setSnackbarMessage('Failed to update the entry');
      setOpenSnackbar(true);
    }
  };
  const handleDelete = async (entry) => {
    console.log('Deleting entry with ID:', entry._id); 

    const confirmed = window.confirm('Are you sure you want to delete this entry? This action cannot be undone.');
    if (confirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/repledge/${entry._id}`);
        fetchEntries(); 
        setSnackbarMessage('Deleted successfully');
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Failed to delete the entry', error);
        setSnackbarMessage('Failed to delete the entry');
        setOpenSnackbar(true);
      }
    }
  };
  
  
  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xxl" PaperProps={{sx: {overflow: 'hidden',},
      }} fullWidth >
      <DialogTitle>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ color: "#D72122", fontWeight: "550" }}
          >
            REPLEDGE ENTRY
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            sx={{
              position: 'absolute',
              right: 19,
              top: 8,
              
              backgroundColor: "#d34141",
              color: "white",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
            <TableHead sx={{ backgroundColor: "#f2ce57", fontWeight: 600 }}>
                <TableRow>
                  {/* Table headers */}
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Customer ID</TableCell>
                  <TableCell sx={{ border: "1px solid black" ,fontWeight: 600}}>Customer Name</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Father's Name</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Address</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Aadhaar Number</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Mobile Number</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Occupation</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Interest Rate</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Tenure</TableCell>
                  <TableCell sx={{ border: "1px solid black" ,fontWeight: 600}}>Amount</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Gold Sale No</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Sale Amount</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Gross Weight</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Net Weight</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Other Bank Name</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Other Bank Amount</TableCell>
                  <TableCell sx={{ border: "1px solid black" ,fontWeight: 600}}>Pledge Amount</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Service Charge</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Amount Given</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Goods Description</TableCell>
                  <TableCell sx={{ border: "1px solid black" ,fontWeight: 600}}>Quantity</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Purity</TableCell>
                  <TableCell sx={{ border: "1px solid black",fontWeight: 600 }}>Actions</TableCell> {/* Actions column */}
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid black" }}>{new Date(entry.date).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.customerId}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.customerName}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.fatherName}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.address}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.aadhaarNumber}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.mobileNumber}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.occupation}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.interestRate}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.tenure}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.amount}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.goldSaleNo}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.saleAmount}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.grossWeight}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.netWeight}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.otherBankName}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.otherBankAmount}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.pledgeAmount}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.serviceCharge}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.amountGiven}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.goodsDescription}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.quantity}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{entry.purity}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                    <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                      <Button  variant="outline-info"
                            color="danger"onClick={() => handleEditClick(entry)} style={{ marginLeft: "4px" }}>Edit</Button>
                    <Button  variant="outline-danger"
                            color="danger" onClick={() => handleDelete(entry)} style={{ marginLeft: "15px" }}>Delete</Button>  </div></TableCell>
                  
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" className='disables'>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
     {/* Edit Dialog */}
     <Dialog open={editOpen} onClose={handleEditClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ color: "#D72122", fontWeight: "550" }}
          >
            EDIT ENTRY
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedEntry && (
            <Grid container spacing={2}>
              {Object.keys(updatedEntry).map((key) => {
                const isDateField = key.toLowerCase().includes('date');
                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <TextField
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      name={key}
                      value={isDateField ? (new Date(updatedEntry[key]).toISOString().split('T')[0]) : updatedEntry[key]}
                      onChange={handleInputChange}
                      fullWidth
                      type={isDateField ? 'date' : 'text'}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button onClick={handleSave} variant="success">
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={handleEditClose} variant="primary">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>



      {/* Snackbar for alerts */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RepledgeDialog;
