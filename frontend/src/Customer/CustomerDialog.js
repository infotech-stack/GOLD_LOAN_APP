import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions,DialogTitle, Button, IconButton, Grid, Box,TextField, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { fetchPaymentEntries } from "../actions/customerActions";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { useDispatch, useSelector } from "react-redux";
import ProofSection from "./proofSection";
import PaymentDetails from "./paymentDetails";
import { useNavigate } from "react-router-dom";
import "./customers.css";
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";


const CustomerDialog = ({open,onClose,entry,paymentEntries,customerId, loanNumber}) => {
  const dispatch = useDispatch();
  const jewelList = entry && entry.jewelList ? entry.jewelList : [];
 const [editableList, setEditableList] = useState(jewelList);
  const [isTableVisible, setTableVisible] = useState(false);
  const [isProofVisible, setProofVisible] = useState(false);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [tempJewelValue, setTempJewelValue] = useState('');
  const [tempQualityValue, setTempQualityValue] = useState('');
  const [selectedJewelIndex, setSelectedJewelIndex] = useState(null);
  const [selectedQualityIndex, setSelectedQualityIndex] = useState(null);
  const [isJewelDialogOpen, setIsJewelDialogOpen] = useState(false);
  const [isQualityDialogOpen, setIsQualityDialogOpen] = useState(false);
  const [jewelOptions, setJewelOptions] = useState(['chain', 'bracelet', 'earnings', 'bangle', 'ring', 'anklet', 'coin', 'others']);
  const [qualityOptions, setQualityOptions] = useState(['916', '916 Hallmark', 'H/M', '22K', '20K', 'KDM', '916 KDM', '916 ZDM', 'others']);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const toggleTableVisibility = () => {
    setTableVisible(!isTableVisible);
  };
  const toggleProofVisibility = () => {
    setProofVisible(!isProofVisible);
  };
  const togglePaymentVisibility = () => {
    setIsPaymentVisible(!isPaymentVisible);
  };
  const navigate = useNavigate();

  
  const handleClick = () => {
    console.log("Customer ID:", customerId);
    console.log("Loan Number:", loanNumber);
    sessionStorage.setItem('customerId', customerId);
    sessionStorage.setItem('loanNumber', loanNumber);
    navigate("/report");
  };
  
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableEntry, setEditableEntry] = useState(entry);
  useEffect(() => {
    if (entry && entry.loanNumber) {
      console.log(
        "Fetching payment entries for loan number:",
        entry.loanNumber
      );
      console.log(
        "Fetching payment entries for interest amount:",
        entry.interestamount
      );
      dispatch(fetchPaymentEntries(entry.loanNumber));
    }
  }, [dispatch, entry]);

  useEffect(() => {
    console.log("Payment entries in CustomerDialog:", paymentEntries);
  }, [paymentEntries]);
  useEffect(() => {
    if (editableEntry.customerName && editableEntry.mobileNumber1.length === 10) {
      setEditableEntry((prevEntry) => ({
        ...prevEntry,
        customerId: `${editableEntry.customerName.slice(0, 3).toUpperCase()}${editableEntry.mobileNumber1.slice(-4).toUpperCase()}`
      }));
    }
  }, [editableEntry.customerName, editableEntry.mobileNumber1]);
  useEffect(() => {
    if (editableEntry.date) {
      const formattedDate = formatDateForInput(editableEntry.date);
      setEditableEntry((prevEntry) => ({ ...prevEntry, date: formattedDate }));
    }
  }, [editableEntry.date]);
  
  
  const handleEditClick = () => {
    setIsEditing(true);
  };

  
const handleSaveClick = async () => {
  try {
    const updatedData = {
      ...editableEntry,
      jewelList: editableList, 
      date: editableEntry.date,
    };

    // Send the PUT request
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/ledger/update/${loanNumber}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
  
      setSnackbarMessage('Data updated successfully');
      setSnackbarSeverity('success');
    } else {
   
      setSnackbarMessage('Failed to update data');
      setSnackbarSeverity('error');
    }
  } catch (error) {
    console.error('Error updating data:', error.response ? error.response.data : error.message);

    if (error.response && error.response.data.errors) {
      const validationError = error.response.data.errors[0]; 

      setSnackbarMessage(`${validationError.msg}`); 
    } else {
      setSnackbarMessage('Failed to update data');
    }
    setSnackbarSeverity('error'); 
  } finally {
    setSnackbarOpen(true); 
    setIsEditing(false); 
  }
};

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  
  const parseDateString = (dateString) => {
    const [day, month, year] = dateString.split('/');
    if (!day || !month || !year) {
      console.error('Invalid date format:', dateString);
      return null;
    }
    return new Date(`${year}-${month}-${day}`);
  };

  
  const formatDateForInput = (date) => {
    if (!date) return ""; 
  
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return ""; 
    }
  
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = dateObj.getFullYear();
  
    // Return in the required format for input[type="date"]: YYYY-MM-DD
    return `${year}-${month}-${day}`; 
  };
  



  const calculateInterest = (loanAmount, percent, months) => {
    return Math.floor((loanAmount * percent * months) / (12 * 100)); 
  };
  const handleOpenJewelDialog = (index) => {
    setTempJewelValue('');
    setSelectedJewelIndex(index);
    setIsJewelDialogOpen(true);
  };
  
  const handleOpenQualityDialog = (index) => {
    setTempQualityValue('');
    setSelectedQualityIndex(index);
    setIsQualityDialogOpen(true);
  };
  
  const handleSaveJewel = () => {
    if (tempJewelValue.trim() === '') return;
  
    setJewelOptions(prevOptions => {
      if (!prevOptions.includes(tempJewelValue)) {
        return [...prevOptions, tempJewelValue];
      }
      return prevOptions;
    });
  
    const updatedList = [...editableList];
    if (selectedJewelIndex !== null && selectedJewelIndex >= 0) {
      updatedList[selectedJewelIndex].jDetails = tempJewelValue;
      setEditableList(updatedList);
    }
  
    setTempJewelValue('');
    setIsJewelDialogOpen(false);
  };
  
  const handleSaveQuality = () => {
    if (tempQualityValue.trim() === '') return;
  

    setQualityOptions(prevOptions => {
      if (!prevOptions.includes(tempQualityValue)) {
        return [...prevOptions, tempQualityValue];
      }
      return prevOptions;
    });
  

    const updatedList = [...editableList];
    if (selectedQualityIndex !== null && selectedQualityIndex >= 0) {
      updatedList[selectedQualityIndex].quality = tempQualityValue;
      setEditableList(updatedList);
    }
  
    setTempQualityValue('');
    setIsQualityDialogOpen(false);
  };
  
  const convertDateFormat = (dateStr) => {
    console.log("Converting date:", dateStr);
    if (!dateStr) {
        console.error('Received null or undefined date string');
        return null;
    }

    // Check if the date string is in YYYY-MM-DD format
    const yyyymmddRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (yyyymmddRegex.test(dateStr)) {
        return new Date(dateStr); // Directly return a Date object
    }

    // Otherwise, assume it's in DD/MM/YYYY format
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) {
        console.error('Invalid date format:', dateStr);
        return null;
    }

    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        console.error('Converted date is invalid:', date);
        return null;
    }

    return date;
};

  
const handleChange = (e, index = null) => {
  const { name, value } = e.target;

  if (name === undefined) {
      console.error('Error: `name` property is missing from event target.');
      return;
  }

  if (index !== null) {
      const updatedList = [...editableList];
      updatedList[index] = { ...updatedList[index], [name]: value };
      console.log('Updated List in Handle Change:', updatedList);
      setEditableList(updatedList);

      if (name === 'jDetails' && value === 'others') handleOpenJewelDialog(index);
      else if (name === 'quality' && value === 'others') handleOpenQualityDialog(index);
  } else {
      setEditableEntry((prevEntry) => {
          let updatedEntry = { ...prevEntry, [name]: value };

          if (name === 'date') {
              const loanDate = convertDateFormat(value); // Make sure to use convertDateFormat
              console.log("Parsed loanDate:", loanDate);

              if (loanDate) {
                  let newLastDateForLoan;

                  if (updatedEntry.schema === 'LGL') {
                      newLastDateForLoan = formatDateForInput(
                          new Date(loanDate.getFullYear() + 1, loanDate.getMonth(), loanDate.getDate())
                      );
                  } else if (updatedEntry.schema === 'MGL' || updatedEntry.schema === 'HGL') {
                      newLastDateForLoan = formatDateForInput(
                          new Date(loanDate.getFullYear(), loanDate.getMonth() + 6, loanDate.getDate())
                      );
                  }

                  console.log(`Calculated newLastDateForLoan for schema ${updatedEntry.schema}:`, newLastDateForLoan);
                  updatedEntry.lastDateForLoan = newLastDateForLoan; // Set the new last date for loan
              } else {
                  console.error("Invalid loanDate parsed, lastDateForLoan won't be updated.");
              }
          }

          // Remaining logic for updating other fields
          if (name === 'loanAmount') {
              let interest = 0;

              if (updatedEntry.schema === 'LGL') {
                  interest = calculateInterest(value, 12, 12);
              } else if (updatedEntry.schema === 'MGL') {
                  interest = calculateInterest(value, 18, 6);
              } else if (updatedEntry.schema === 'HGL') {
                  interest = calculateInterest(value, 24, 6);
              }

              updatedEntry.interest = interest;
          }

          if (name === 'iw' || name === 'gw') {
              updatedEntry[name] = parseFloat(value);

              const iw = name === 'iw' ? parseFloat(value) : parseFloat(updatedEntry.iw || 0);
              const gw = name === 'gw' ? parseFloat(value) : parseFloat(updatedEntry.gw || 0);
              if (!isNaN(iw) && !isNaN(gw)) {
                  updatedEntry.nw = (gw - iw).toFixed(2);
              }
          }

          return updatedEntry;
      });
  }
};

  
  
  const handleSchemaChange = (e) => {
    const selectedSchema = e.target.value;
    let percent = '';
    let lastDateForLoan = '';
    let interest = 0;
  
    const loanDate = new Date(editableEntry.date);
  
    switch (selectedSchema) {
      case 'LGL':
        percent = '12%';
        lastDateForLoan = formatDateForInput(new Date(loanDate.getFullYear() + 1, loanDate.getMonth(), loanDate.getDate()));
        interest = calculateInterest(editableEntry.loanAmount, 12, 12); 
        break;
      case 'MGL':
        percent = '18%';
        lastDateForLoan = formatDateForInput(new Date(loanDate.getFullYear(), loanDate.getMonth() + 6, loanDate.getDate()));
        interest = calculateInterest(editableEntry.loanAmount, 18, 6); 
        break;
      case 'HGL':
        percent = '24%';
        lastDateForLoan = formatDateForInput(new Date(loanDate.getFullYear(), loanDate.getMonth() + 6, loanDate.getDate()));
        interest = calculateInterest(editableEntry.loanAmount, 24, 6); 
        break;
      default:
        percent = '';
        lastDateForLoan = '';
        interest = 0;
    }
  
    setEditableEntry((prevEntry) => ({
      ...prevEntry,
      schema: selectedSchema,
      percent: percent,
      lastDateForLoan: lastDateForLoan,
      interest: interest,
    }));
  };
  const addJewelDetails = () => {
    const newJewel = {
      jDetails: "", 
      quantity: 0,   
      quality: "",   
    };
    setEditableList([...editableList, newJewel]);
  };
  const [loanTotals, setLoanTotals] = useState({
    totalLoans: 0,
    
  });
  const fetchLedgers = async (customerId) => {
    try {
      const loanResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/all`
      );
      const loanData = loanResponse.data;
      const customerLoans = loanData.filter((loan) => loan.customerId === customerId);
      const totalLoanCount = customerLoans.length;

      setLoanTotals((prevTotals) => ({
        ...prevTotals,
        totalLoans: totalLoanCount,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    if (editableEntry.customerId) {
      fetchLedgers(editableEntry.customerId);
    }
  }, [editableEntry.customerId]);

  const deleteJewel = (index) => {
    const updatedList = editableList.filter((_, i) => i !== index);
    setEditableList(updatedList);
  };
  const calculateGrossWeight = (list) => {
    const totalWeight = list.reduce((total, item) => total + parseFloat(item.iw || 0), 0);
    return totalWeight.toFixed(2); 
  };
  
  return (
    <>
   <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xxl"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          //overflow: "hidden",
          overflow: "visible",
          position: "relative", 
        },
      }}
    >
        <IconButton
    edge="end"
    color="inherit"
    onClick={onClose}
    aria-label="close"
    sx={{
      position: "absolute",
      top: "-13px", 
      right: "-7px", 
      backgroundColor: "#D32521",
      color: "white",
      "&:hover": {
        backgroundColor: "#D32521",
      },
    }}
  >
    <CloseIcon />
  </IconButton>
      <DialogContent
        sx={{
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <Box sx={{ padding: "20px", borderRadius: "10px", width: "100%", mt: -3 }}>
          <Grid container spacing={2} sx={{ marginBottom: "15px" }}>
            <Grid item xs={12} sm={6}>
              <label style={{ fontSize: "14px", fontWeight: "600" }}>Total Loan : </label>
              <input
                type="text"
                value={loanTotals.totalLoans || "0"} 
                readOnly
                className="loan_total"
              />
            </Grid>
           
            <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
  <label className="labelText">Loan Status:</label>
  <div className="loanStatusContainer">
    <span className="loanStatus" style={{ backgroundColor: paymentEntries.length > 0 && paymentEntries[0].balance === 0 ? 'red' : 'green' }}>
      <div className="statusDot"></div>
      {paymentEntries.length > 0 && paymentEntries[0].balance === 0 ? 'CLOSED' : 'LIVE'}
    </span>
  </div>
</Grid>


          </Grid>
          <Box className="customBox">
            <span style={{ marginLeft: "3px" }}>Customer Details :</span>
          </Box>
          <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
              <label className="customLabel">Customer ID :</label>
              <input
                type="text"
                value={editableEntry.customerId}
                name="customerId"
                className="customInput"
                readOnly
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <label className="customLabel">Name :</label>
              <input
                type="text"
                value={editableEntry.customerName}
                name="customerName"
                className="customInput inputName"
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <label className="customLabel">Phone No :</label>
              <input
                type="text"
                value={editableEntry.mobileNumber1}
                name="mobileNumber1"
                className="customInput inputPhone"
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <label className="customLabel">Father/Husband:</label>
              <input
                type="text"
                value={editableEntry.fatherhusname}
                name="fatherhusname"
                className="customInput inputFatherHusband"
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <label className="customLabel">Address :</label>
              <input
                type="text"
                value={editableEntry.address}
                name="address"
                className="customInput inputAddress"
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <label className="customLabel">Landmark :</label>
              <input
                type="text"
                value={editableEntry.landmark}
                name="landmark"
                className="customInput inputLandmark"
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <label className="customLabel">Alter PhoneNo:</label>
              <input
                type="text"
                value={editableEntry.mobileNumber2}
                name="mobileNumber2"
                className="customInput inputmobileno"
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </Grid>
          </Grid>
          <Box className="customBox">
            <span className="loanDetailsSpan">Loan Details :</span>
            <div className="loanDetailsDiv">
              <label className="loanDetailsLabel">Last Date For Loan :</label>
              <input
                type="date"
                
                value={formatDateForInput(editableEntry.lastDateForLoan)}
                name="lastDateForLoan"
                className="loanDetailsInput"
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

          </Box>
          <Grid container spacing={3} className="gridContainer">
            <Grid item xs={12} sm={2}>
              <label className="gridItemLabel">Loan No :</label>
              <input
                type="text"
                value={editableEntry.loanNumber}
                className="gridItemInput"
                readOnly
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <label className="gridItemLabel">Loan Date :</label>
              <input
                type="date"
                value={formatDateForInput(editableEntry.date) }
                name="date"
                className="gridItemInputLoanDate"
                onChange={handleChange}
                readOnly={!isEditing}
              />


            </Grid>
                  <Grid item xs={12} sm={2}>
           
                <label>Scheme:</label>
                <select 
                  value={editableEntry.schema} 
                  name="schema" 
                    className="gridItemInputScheme"
                  onChange={handleSchemaChange} 
                  disabled={!isEditing}
                >
                <option value="LGL">LGL</option>
                <option value="MGL">MGL</option>
                <option value="HGL">HGL</option>
              </select>
           
          </Grid>
            <Grid item xs={12} sm={2}>
              <label className="gridItemLabel">Percent :</label>
              <input
                type="text"
                value={editableEntry.percent}
                name="percent"
                className="gridItemInputPercent"
                readOnly
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <label className="gridItemLabel">Loan Amount :</label>
              <input
                type="text"
                value={editableEntry.loanAmount}
                name="loanAmount"
                className="gridItemInputLoanAmount"
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <label className="gridItemLabel">Interest Amount:</label>
              <input
                type="text"
                value={editableEntry.interest}
                name="interest"
                className="gridItemInputInterest"
                onChange={handleChange}
                readOnly
              />
            </Grid>
          </Grid>
          <Box className="customBox">
            <span>Jewel Details :</span>
            <Button onClick={toggleTableVisibility} className="customBoxButton">
              {isTableVisible ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Button>
          </Box>
          
  <div>
  {isTableVisible && (
  <table className="table-container">
    <thead>
      <tr>
        <th colSpan={2}>Jewel Name</th>
        <th colSpan={2}>Quantity</th>
        <th colSpan={2}>Quality</th>
        
        {/* Conditionally render the "Actions" column only in edit mode */}
        {isEditing && <th colSpan={2}>Actions</th>}
        
        <th colSpan={2}>Item Weight (gms)</th>
        <th>Gross Weight (gms)</th>
        <th>Net Weight (gms)</th>
      </tr> 
    </thead>

    <tbody>
      {editableList.length > 0 ? (
        editableList.map((jewel, index) => (
          <tr key={index}>
            <td colSpan={2}>
              {isEditing ? (
                <Select
                  name="jDetails"
                  value={jewel.jDetails || ""}
                  sx={{ width: '230px' }}
                  onChange={(e) => {
                    console.log('Dropdown Value Changed:', e.target.value);
                    handleChange(e, index);
                    if (e.target.value === "others") handleOpenJewelDialog(index);
                  }}
                  displayEmpty
                >
                  {jewelOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                jewel.jDetails || "N/A"
              )}
            </td>
            <td colSpan={2}>
              {isEditing ? (
                <TextField
                  type="number"
                  name="quantity"
                  sx={{ width: '120px' }}
                  value={jewel.quantity || 0}
                  onChange={(e) => handleChange(e, index)}
                />
              ) : (
                jewel.quantity || 0
              )}
            </td>
            <td colSpan={2}>
              {isEditing ? (
                <Select
                  name="quality"
                  value={jewel.quality || ""}
                  sx={{ width: '180px' }}
                  onChange={(e) => {
                    console.log('Dropdown Quality Value Changed:', e.target.value);
                    handleChange(e, index);
                    if (e.target.value === "others") handleOpenQualityDialog(index);
                  }}
                  displayEmpty
                >
                  {qualityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                jewel.quality || "N/A"
              )}
            </td>

            {/* Conditionally render the delete button only in edit mode */}
            {isEditing && (
              <td colSpan={2}>
                <IconButton
                  aria-label="delete"
                  color="secondary"
                  onClick={() => deleteJewel(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </td>
            )}
            
            {/* Display Item Weight as an array of values */}
            <td colSpan={2}>
              {isEditing ? (
                <TextField
                  type="number"
                  name="iw"
                  sx={{ width: '140px' }}
                  value={jewel.iw || 0}
                  onChange={(e) => handleChange(e, index)}
                />
              ) : (
                jewel.iw || 0
              )}
            </td>
            
            {/* Only show Gross Weight and Net Weight in the first row */}
            {index === 0 && (
              <>
                <td rowSpan={editableList.length}>
                  {/* Calculate Gross Weight as sum of all Item Weights */}
                  {isEditing ? (
                    <TextField
                      type="number"
                      name="gw"
                      sx={{ width: '140px' }}
                      value={calculateGrossWeight(editableList) || 0}
                      onChange={handleChange}
                    />
                  ) : (
                    calculateGrossWeight(editableList) || 0
                  )}
                </td>
                <td rowSpan={editableList.length}>
                  {isEditing ? (
                    <TextField
                      type="number"
                      name="nw"
                      sx={{ width: '140px' }}
                      value={editableEntry.nw || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    editableEntry.nw || "N/A"
                  )}
                </td>
              </>
            )}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="12" className="no-jewels">
            No jewels available
          </td>
        </tr>
      )}
    </tbody>

    {isEditing && (
      <div className="parent-container">
        <Button variant="contained" color="primary" className="no-jewels1" onClick={addJewelDetails}>
          Add Jewel
        </Button>
      </div>
    )}
  </table>
)}



    
    <Dialog open={isJewelDialogOpen} onClose={() => setIsJewelDialogOpen(false)}>
  <DialogTitle>Enter Jewel Name</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Jewel Name"
      fullWidth
      value={tempJewelValue}
      onChange={(e) => setTempJewelValue(e.target.value)}
    />
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center' }}>
  <Button onClick={handleSaveJewel} color="success" 
    variant="contained" 
    sx={{ height: 27, mb: 3 }}>Save</Button>
    <Button onClick={() => setIsJewelDialogOpen(false)} color="error" 
    variant="contained" 
    sx={{ height: 27, mb: 3 }}>Cancel</Button>
   
  </DialogActions>
</Dialog>

<Dialog open={isQualityDialogOpen}  onClose={() => setIsQualityDialogOpen(false)}>
  <DialogTitle sx={{ alignItems:'center' }}>Enter Quality</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Quality"
      fullWidth
      value={tempQualityValue}
      onChange={(e) => setTempQualityValue(e.target.value)}
    />
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center' }}>
  <Button 
    onClick={handleSaveQuality} 
    color="success" 
    variant="contained" 
    sx={{ height: 27, mb: 3 }}
  >
    Save
  </Button>
  <Button 
    onClick={() => setIsQualityDialogOpen(false)} 
    color="error" 
    variant="contained" 
    sx={{ height: 27, mb: 3 }}
  >
    Cancel
  </Button>
 
</DialogActions>

</Dialog>


   

</div>
          <Box className="customBox">
            <span style={{ marginLeft: "3px" }}>Proof :</span>
            <Button onClick={toggleProofVisibility} className="customBoxButton">
              {isProofVisible ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Button>
          </Box>
          {isProofVisible && (
            <Box sx={{ padding: "16px" }}>
              <ProofSection
                proof1={entry.proof1}
                proof2={entry.proof2}
                proof3={entry.proof3}
                isProofVisible={isProofVisible}
                entry={entry}
              />
            </Box>
          )}
          <Box className="customBox">
            <span style={{ marginLeft: "3px" }}>Payment Details:</span>

            <div className="flex-container">
              <label onClick={handleClick} className="add-payment-label">
                Add Payment
                <AddCircleRoundedIcon
                  style={{ fontSize: "14px", marginLeft: "5px" }}
                />
              </label>
              <Button
                onClick={togglePaymentVisibility}
                className="customBoxButton"
              >
                {isPaymentVisible ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </Button>
            </div>
          </Box>{" "}
          {isPaymentVisible && (
            <div style={{ marginTop: "20px" }}>
              <PaymentDetails paymentEntries={paymentEntries} />
            </div>
          )}
        </Box>
        <div className="button-container">
            {isEditing ? (
              <>
                <button className="button-save" onClick={handleSaveClick}>Save</button>
                <button className="button-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="button-edit" onClick={handleEditClick}>Edit</button>
            )}
          </div>
   
  
      </DialogContent>
      <DialogActions>
        
      </DialogActions>
    </Dialog>
    </>
  );
};
export default CustomerDialog;
