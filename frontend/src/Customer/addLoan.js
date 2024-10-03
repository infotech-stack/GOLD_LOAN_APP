import React, { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import "../Master/Master.css";
import Badge from "react-bootstrap/Badge";
import Swal from "sweetalert2";
import axios from "axios";
import { useLedger } from "../LedgerContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerDetails}  from "../actions/customerActions"
const Addloan = ({
  ledgerId,
  customerId,
  hideUploadButtons,
  entry,
  isAddLoan,
  isReadOnly,
  onSubmit,
  onSave,
}) => {
  const isEditing = !!entry;
  const dispatch = useDispatch();
  const customerDetails = useSelector((state) => state.customer.customerDetails);
  const [jewelList, setJewelList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [nextLoanNumber, setNextLoanNumber] = useState("");
  const [latestJewelNumber, setLatestJewelNumber] = useState("");
  const [schemas, setSchemas] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    loanNumber: "",
    date: "",
   
    customerName: "",
    mobileNumber1: "",
    mobileNumber2: "",
    landmark: "",
    address: "",
    jDetails: "",
    quality: "",
    quantity: "",
    fatherhusname: "",
    gw: "",
    iw: "",
    nw: "",
    schema: "",
    loanAmount: "",
    percent: "",
    interest: "",
    lastDateForLoan: "",
    doccharge: "",
    interestbalamount: "",
    loanamountbalance: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    customerId: false,
    loanNumber: false,
    date: false,
  
    customerName: false,
    mobileNumber1: false,
    mobileNumber2: false,
    landmark: false,
    address: false,
    jDetails: false,
    quality: false,
    quantity: false,
    iw: false,
    gw: false,
    nw: false,
    schema: false,
    loanAmount: false,
    percent: false,
    interest: false,
    lastDateForLoan: false,
    fatherhusname: false,
    doccharge: false,
    loanamountbalance: false,
    interestbalamount: false,
  });
 
 



 
  const [latestLoanNumber, setLatestLoanNumber] = useState("");

  const [customJewelDetail, setCustomJewelDetail] = useState("");
  const [enableCustomerId, setEnableCustomerId] = useState(false);
  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const [editedEntry, setEditedEntry] = useState(entry);

 

  const fetchLedgerEntryById = async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/ledger/${id}`
    );
    const data = await response.json();
    return data;
  };

 
  useEffect(() => {
 
    fetchLatestLoanNumber();
    fetchSchemas();
  }, []);

  const fetchLatestLoanNumber = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/latest_loan_number`)
      .then((response) => response.json())
      .then((data) => {
        setLatestLoanNumber(data.latestLoanNumber);
      })
      .catch((error) =>
        console.error("Error fetching latest loan number:", error)
      );
  };



  const [files, setFiles] = useState({
    proof1: [],
    proof2: [],
    proof3: [],
    customerSign: null,
    customerPhoto: null,
  });
 

  const handleFileChange = (event, fileType) => {
    const { files: selectedFiles } = event.target;

    if (fileType === "proof3") {
      setFiles((prevFiles) => ({
        ...prevFiles,
        proof3: Array.from(selectedFiles), // Store proof3 as an array of files
      }));
    }
  };

  const handleFileRemove = (fileType, index) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles[fileType].filter((_, i) => i !== index);
      return {
        ...prevFiles,
        [fileType]: updatedFiles.length > 0 ? updatedFiles : null,
      };
    });
  };

  

  const fetchSchemas = () => {
    console.log("Fetching schemas...");

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/schemas`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received:", data);
        setSchemas(data); // Store the full schema objects
      })
      .catch((error) => {
        console.error("Error fetching schemas:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Determine the new value based on the field name
    let newValue = value;

    if (name === "loanNumber") {
      newValue = value.toUpperCase();
    } else if (name === "date") {
      newValue = formatDateToInput(value);
    }

    setEditedEntry({ ...editedEntry, [name]: newValue });

    setFormData((prevState) => {
      const newFormData = { ...prevState, [name]: newValue };

      // Handle schema change
      if (name === "schema") {
        const selectedSchema = schemas.find(
          (schema) => schema.name === newValue
        );
        newFormData.percent = selectedSchema
          ? selectedSchema.interestPercent
          : "";
      }
      // Handle schema change or date change
      const updateLastDateForLoan = () => {
        const selectedSchema = schemas.find(
          (schema) => schema.name === newFormData.schema
        );

        if (selectedSchema) {
          const timePeriod = selectedSchema.timePeriod;
          const enteredDate = new Date(newFormData.date);

          let calculatedDate = new Date(enteredDate);

          if (timePeriod.includes("Year")) {
            const years = parseInt(timePeriod);
            calculatedDate.setFullYear(calculatedDate.getFullYear() + years);
          } else if (timePeriod.includes("Months")) {
            const months = parseInt(timePeriod);
            calculatedDate.setMonth(calculatedDate.getMonth() + months);
          }

          newFormData.lastDateForLoan = calculatedDate
            .toISOString()
            .split("T")[0];

          const principal = parseFloat(newFormData.loanAmount);
          const percentage = parseFloat(selectedSchema.interestPercent);
          if (!isNaN(principal) && !isNaN(percentage)) {
            let interest = 0;
            if (percentage === 12) {
              interest = principal * 0.12;
            } else if (percentage === 18) {
              interest = (principal * 0.18) / 2;
            } else if (percentage === 24) {
              interest = (principal * 0.24) / 2;
            }
            newFormData.interest = interest.toFixed(0);
          } else {
            newFormData.interest = "";
          }
        }
      };

      if (name === "schema" || name === "date") {
        updateLastDateForLoan();
      }

      if (name === "customerName" || name === "mobileNumber1") {
        const { customerName, mobileNumber1 } = newFormData;
        newFormData.customerId =
          customerName && mobileNumber1 && mobileNumber1.length === 10
            ? `${customerName.slice(0, 3).toUpperCase()}${mobileNumber1
                .slice(-4)
                .toUpperCase()}`
            : "";
      }

      // Validation for loan number
      if (name === "loanNumber") {
        const pattern = /^KRT\d{3,}$/;
        if (!isEditing) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [name]: !pattern.test(newValue),
          }));
        }
        newFormData[name] = newValue;
      } else if (name === "mobileNumber1") {
        const pattern = /^\d{10}$/;
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: !pattern.test(value),
        }));
      } else if (name === "schema" || name === "landmark") {
        const pattern = /^[a-zA-Z\s]*$/;
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: !pattern.test(value),
        }));
      } else if (name === "address") {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value.trim().length <= 10,
        }));
      } else if (name === "lastDateForLoan") {
        setValidationErrors((prevErrors) => {
          const errors = {};
          // Check if the field is empty
          if (!value) {
            errors.lastDateForLoan = "Last Date is required";
          } else {
            // Further validation (e.g., check if date is in the future)
            const today = new Date();
            const inputDate = new Date(value);
            if (inputDate < today) {
              errors.lastDateForLoan = "Date must be in the future";
            }
          }
          return { ...prevErrors, ...errors };
        });
      } else if (name === "fatherhusname") {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value.trim() === "",
        }));
      } else if (name === "doccharge") {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value.trim() === "",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value.trim() === "",
        }));
      }

      if (name === "lastDateForLoan") {
        const errors = {};

        if (!value) {
          errors.lastDateForLoan = "Last Date is required";
        }
        setValidationErrors(errors);
      }

      if (name === "loanAmount" || name === "percent") {
        const principal = parseFloat(newFormData.loanAmount);
        const percentage = parseFloat(newFormData.percent);
        if (!isNaN(principal) && !isNaN(percentage)) {
          let interest = 0;
          if (percentage === 12) {
            interest = principal * 0.12;
          } else if (percentage === 18) {
            interest = (principal * 0.18) / 2;
          } else if (percentage === 24) {
            interest = (principal * 0.24) / 2;
          }
          newFormData.interest = interest.toFixed(0);
        } else {
          newFormData.interest = "";
        }
      }
      if (name === "jewelWeight" || name === "jewelList") {
        newFormData.gw = calculateTotalWeight();
      }
      return newFormData;
    });
  };

  const validateFormData = (formData, files, isEditing) => {
    let errors = {};

    for (let key in formData) {
      if (["jDetails", "quality", "quantity","iw","mobileNumber2"].includes(key)) {
        continue;
      }

      if (typeof formData[key] !== "string" || formData[key].trim() === "") {
        if (key === "lastDateForLoan") {
          errors[key] = "Enter Last date";
        } else {
          errors[key] = `Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`;
        }
      } else if (key === "mobileNumber1" && !/^\d{10}$/.test(formData[key])) {
        errors[key] = "Enter a valid 10-digit mobile number";
      } else if (
        (key === "schema" || key === "landmark") &&
        !/^[a-zA-Z\s]*$/.test(formData[key])
      ) {
        errors[key] = `Enter a valid ${key
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()}`;
      } else if (key === "address" && formData[key].trim().length <= 10) {
        errors[key] = "Address must be longer than 10 characters";
      }
    }

    if (!formData.lastDateForLoan) {
      errors.lastDateForLoan = "Enter Last date";
    }
    if (!formData.date) {
      errors.date = "Enter date";
    }
    if (!formData.schema) {
      errors.schema = "Schema is Required";
    }
    if (!formData.doccharge) {
      errors.doccharge = "Document charge is Required";
    }
    if (!formData.percent) {
      errors.percent = "Percent is Required";
    }
    if (!formData.loanAmount) {
      errors.loanAmount = "Loan amount is Required";
    }
    if (!formData.loanNumber) {
      errors.loanNumber = "Loan number is Required";
    }
    if (!formData.nw) {
      errors.nw = "gross weight is Required";
    }
    if (!formData.gw) {
      errors.gw = " net weight is Required";
    }

    if (!isEditing) {
      if (!files.proof3 || files.proof3.length === 0) {
        errors.proof3 = "Upload proof 3 (jewel detail)";
      }
    }

    return errors;
  };

  const [errors, setErrors] = useState({
    jDetails: false,
    quality: false,
    quantity: false,
  });
  const handleAddJewel = () => {
    const { jDetails, quality, quantity, iw } = formData;

    let tempErrors = {
      jDetails: !jDetails,
      quality: !quality,
      quantity: !quantity,
      iw: !iw,
    };
  
    if (Object.values(tempErrors).some((error) => error)) {
      setErrors(tempErrors);
      return;
    }
  
    setErrors({
      jDetails: false,
      quality: false,
      quantity: false,
      iw: false,
    });
  
    const updatedJewelList = [...jewelList, formData];

    setJewelList(updatedJewelList);
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      jDetails: "",
      quality: "",
      quantity: "",
      iw: "",
      gw: calculateTotalWeight(updatedJewelList), 
    }));
  };
  
  const handleDeleteItem = (index) => {
    const updatedList = jewelList.filter((_, i) => i !== index);
    setJewelList(updatedList);
    setFormData((prevFormData) => ({
      ...prevFormData,
      gw: calculateTotalWeight(updatedList), 
    }));
  };
  const calculateTotalWeight = (list) => {
    const totalWeight = list.reduce((total, item) => total + parseFloat(item.iw || 0), 0);
    return totalWeight.toFixed(2); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.loanNumber !== latestLoanNumber) {
      setSnackbarMessage(
        "The loan number does not match the latest loan number."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formDataWithJLNumber = { ...formData,  };
    const validationErrors = validateFormData(
      formDataWithJLNumber,
      files,
      isEditing
    );

    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData();
    for (const [key, value] of Object.entries(formDataWithJLNumber)) {
      formDataToSend.append(key, value);
    }
    formDataToSend.append("jewelList", JSON.stringify(jewelList || []));
    Object.keys(files).forEach((fileType) => {
      if (fileType === "proof3" && Array.isArray(files[fileType])) {
        // proof3 should handle multiple files
        files[fileType].forEach((file) => {
          formDataToSend.append("proof3", file);
        });
      } else if (files[fileType]) {
        // Single file types
        formDataToSend.append(fileType, files[fileType]);
      }
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/add`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      if (!response.ok) {
        const errorText = await response.text(); // Get the response as plain text (could be HTML)
        console.error("Error Response:", errorText); // Log the full response
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
        return;
      }
      const responseText = await response.text();
      console.log("Raw Response:", responseText);

      const data = JSON.parse(responseText);
      console.log("Success:", data);

      setSnackbarMessage(
        `Ledger entry ${isEditing ? "updated" : "stored"} successfully.`
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setNextLoanNumber(nextLoanNumber + 1);
      fetchLatestLoanNumber();
    
      setFormData({
        loanNumber: nextLoanNumber,
        customerId: "",
        date: "",
       
        customerName: "",
        mobileNumber1: "",
        mobileNumber2: "",
        landmark: "",
        address: "",
        jDetails: "",
        quality: "",
        quantity: "",
        iw: "",
        gw: "",
        nw: "",
        schema: "",
        loanAmount: "",
        percent: "",
        proof: "",
        interest: "",
        lastDateForLoan: "",
      });
      setFiles({
        proof1: null,
        proof2: null,
        proof3: null,
        customerSign: null,
        customerPhoto: null,
        thumbImpression: null,
      });
      setValidationErrors({});
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage("Something went wrong!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
 useEffect(() => {
    if (customerId) {
      fetchCustomerDetails(customerId);
    }
  }, [customerId]);

  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/${customerId}`
      );
      const customer = response.data;
      setFormData({
        customerId: customer.customerId,
        customerName: customer.customerName, // Check property names
        mobileNumber1: customer.mobileNumber1,
        mobileNumber2: customer.mobileNumber2,
        landmark: customer.landmark,
        address: customer.address,
        fatherhusname: customer.fatherhusname, // Check this property
      });
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };
  const handleCustomerIdChange = (e) => {
    const customerId = e.target.value;
    const newCustomerId = e.target.value;
    setFormData({
      ...formData,
      customerId: customerId,
      customerId: newCustomerId,
    });
    if (customerId.length === 7) {
      fetchCustomerDetails(customerId);
    }
  };
  const [openDialog1, setOpenDialog1] = useState(false);

  const handleDialogClose1 = () => {
    setOpenDialog1(false);
  };
  const handleSaveCustomDetail = () => {
    if (!customJewelDetail) {
      setValidationErrors({ ...validationErrors, customJewelDetail: true });
    } else {
      setFormData({
        ...formData,
        jDetails: customJewelDetail,
      });
      handleDialogClose1();
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setValidationErrors({ ...validationErrors, customJewelDetail: false });
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (value === "others") {
      setOpenDialog1(true);
    } else {
      setFormData({
        ...formData,
        jDetails: value,
      });
    }
  };
  const [dialogError, setDialogError] = useState(false);
  const [customQuality, setCustomQuality] = useState("");
  const handleSelectChanges = (event) => {
    const value = event.target.value;
    if (value === "others") {
      setOpenDialog(true);
    } else {
      setFormData({
        ...formData,
        quality: value,
      });
    }
  };

  const handleSaveCustomQuality = () => {
    if (!customQuality) {
      setDialogError(true);
    } else {
      setFormData({
        ...formData,
        quality: customQuality,
      });
      setOpenDialog(false);
      setDialogError(false);
    }
  };
  
  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Paper
        style={{ padding: 20, margin: "auto", marginTop: "-4px" }}
        sx={{ maxWidth: "100%", overflow: "hidden" }}
        // className="paperbg"
      >
        <Typography
          variant="h6"
         
          gutterBottom
          align="center"
          sx={{ color: "#D72122", fontWeight: "550",mt:-2,mb:-1 }}
        >
        ADD LOAN
        </Typography>
        <Grid
          item
          xs={12}
          sm={2}
          style={{ textAlign: "center" }}
          sx={{ mb: 2, mt: 2 }}
        >
          <label
            variant="contained"
            color="primary"
            className="cate-btn"
            style={{ backgroundColor: "#1784cc",maxWidth: "100%",maxHeight:'30px' }}
          >
            Next LoanNo :
            <span
              style={{
                backgroundColor: "#1784cc",
                color: "#fff",
                borderRadius: "0.25em",
                fontSize: "0.895em",
                fontWeight: "bold",
                letterSpacing: "1",
                marginLeft:'10px'
              }}
            >
              {latestLoanNumber}
            </span>
          </label>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="customerId"
                label="Customer Id"
                fullWidth
                value={formData.customerId}
                onChange={handleCustomerIdChange}
                disabled={!enableCustomerId}
                InputProps={{ readOnly: isReadOnly }}
                error={validationErrors.customerId}
                helperText={
                  validationErrors.customerId ? "Customer Id is required" : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="loanNumber"
                label="Loan Number"
                fullWidth
                value={formData.loanNumber}
                onChange={handleChange}
                error={validationErrors.loanNumber}
                helperText={
                  validationErrors.loanNumber
                    ? "Loan Number must start with 'kRT' followed by at least 3 digits"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="date"
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.date} // Ensure this is in yyyy-MM-dd format
                onChange={handleChange}
                error={Boolean(validationErrors.date)}
                helperText={validationErrors.date ? "Date is required" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="customerName"
                label="Customer Name"
                fullWidth
                value={formData.customerName}
                onChange={handleChange}
                error={validationErrors.customerName}
                InputProps={{
                  readOnly: true, // Makes the input field read-only
                }}
                helperText={
                  validationErrors.customerName
                    ? "Customer Name is required"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="mobileNumber1"
                label="Mobile Number"
                fullWidth
                value={formData.mobileNumber1}
                InputProps={{
                  readOnly: true, 
                }}
                onChange={handleChange}
                error={validationErrors.mobileNumber1}
                helperText={
                  validationErrors.mobileNumber1
                    ? "Mobile Number must be 10 digits"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
          
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="mobileNumber2"
                label="Alternative Mobile Number"
                fullWidth
                value={formData.mobileNumber2}
                onChange={handleChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="fatherhusname"
                label="Father/Husband Name"
                fullWidth
                value={formData.fatherhusname}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                error={validationErrors.fatherhusname}
                helperText={
                  validationErrors.fatherhusname
                    ? "Father Name/Husband is required"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="landmark"
                label="Landmark"
                fullWidth
                value={formData.landmark}
                InputProps={{
                  readOnly: true, // Makes the input field read-only
                }}
                onChange={handleChange}
                error={validationErrors.landmark}
                helperText={
                  validationErrors.landmark ? "Landmark must be a string" : ""
                }
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
                name="address"
                label="Address"
                fullWidth
                value={formData.address}
                InputProps={{
                  readOnly: true,
                }}
                onChange={handleChange}
                error={validationErrors.address}
                helperText={
                  validationErrors.address
                    ? "Address must be greater than 10 characters"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Schema"
                name="schema"
                value={formData.schema}
                onChange={handleChange}
                fullWidth
                select
                error={!!validationErrors.schema}
                helperText={validationErrors.schema && "Schema is required"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              >
                {schemas.map((schema) => (
                  <MenuItem key={schema._id} value={schema.name}>
                    {schema.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <TextField
                name="percent"
                label="%"
                fullWidth
                value={formData.percent}
                onChange={handleChange}
                error={!!validationErrors.percent}
                helperText={
                  validationErrors.percent ? " percent is required" : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="loanAmount"
                label="Loan Amount"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
                value={formData.loanAmount}
                onChange={handleChange}
                error={validationErrors.loanAmount}
                helperText={
                  validationErrors.loanAmount ? "Loan Amount is required" : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="lastDateForLoan"
                label="Last Date for Loan"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                value={formData.lastDateForLoan}
                onChange={handleChange}
                error={Boolean(validationErrors.lastDateForLoan)}
                helperText={validationErrors.lastDateForLoan || ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{ textAlign: "center" }}
              sx={{ mb: 0, mt: 0 }}
            >
              <Box
                component="span"
               className= 'cate-btn'
                sx={{
                  backgroundColor: "#1784cc",
                  color: "#fff",
                  fontWeight: 600,
                  padding: "6px 8px",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              >
                Add Jewellery Detail
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth error={errors.jDetails}>
                <InputLabel id="jDetails-label">Jewel Details</InputLabel>
                <Select
                  labelId="jDetails-label"
                  name="jDetails"
                  value={formData.jDetails}
                  onChange={handleSelectChange}
                  label="Jewel Details"
                  className="custom-select"
                >
                  <MenuItem value="chain">Chain</MenuItem>
                  <MenuItem value="bracelet">Bracelet</MenuItem>
                  <MenuItem value="earnings">Earrings</MenuItem>
                  <MenuItem value="bangle">Bangle</MenuItem>
                  <MenuItem value="ring">Ring</MenuItem>
                  <MenuItem value="anklet">Anklet</MenuItem>
                  <MenuItem value="coin">Coin</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                  {formData.jDetails === customJewelDetail && (
                    <MenuItem value={customJewelDetail}>
                      {customJewelDetail}
                    </MenuItem>
                  )}
                </Select>
                {errors.jDetails && (
                  <FormHelperText error>
                    Jewel Details are required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Dialog
              open={openDialog1}
              onClose={handleDialogClose1}
              aria-labelledby="form-dialog-title"
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle id="form-dialog-title">
                {" "}
                <Typography
                  variant="h6"
                  gutterBottom
                  align="center"
                  sx={{ color: "#D72122", fontWeight: "550" }}
                >
                  JEWEL DETAIL
                </Typography>
              </DialogTitle>
              <DialogContent>
                <TextField
                  label="Jewel Details"
                  fullWidth
                  value={customJewelDetail}
                  onChange={(e) => setCustomJewelDetail(e.target.value)}
                  error={validationErrors.customJewelDetail}
                  helperText={
                    validationErrors.customJewelDetail
                      ? "Details are required"
                      : ""
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    width: "100%",
                    mb: 2,
                  }}
                >
                  <Button
                    onClick={handleSaveCustomDetail}
                    color="success"
                    variant="contained"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleDialogClose1}
                    color="error"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </Box>
              </DialogActions>
            </Dialog>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth error={errors.quality}>
                <InputLabel id="quality-label">Quality</InputLabel>
                <Select
                  labelId="quality-label"
                  name="quality"
                  value={formData.quality}
                  className="custom-select"
                  onChange={handleSelectChanges}
                  label="Quality"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                >
                  <MenuItem value="916">916</MenuItem>
                  <MenuItem value="916 Hallmark">916 Hallmark</MenuItem>
                  <MenuItem value="H/M">H/M</MenuItem>
                  <MenuItem value="22K">22K</MenuItem>
                  <MenuItem value="20K">20K</MenuItem>
                  <MenuItem value="KDM">KDM</MenuItem>
                  <MenuItem value="916 KDM">916 KDM</MenuItem>
                  <MenuItem value="916 ZDM">916 ZDM</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                  {formData.quality === customQuality && (
                    <MenuItem value={customQuality}>{customQuality}</MenuItem>
                  )}
                </Select>
                {errors.quality && (
                  <FormHelperText error>Quality is required</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Dialog
              open={openDialog}
              onClose={handleDialogClose}
              aria-labelledby="form-dialog-title"
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle id="form-dialog-title">
                <Typography
                  variant="h6"
                  gutterBottom
                  align="center"
                  sx={{ color: "#D72122", fontWeight: "550" }}
                >
                  Quality
                </Typography>
              </DialogTitle>
              <DialogContent>
                <TextField
                  label="Custom Quality"
                  fullWidth
                  value={customQuality}
                  onChange={(e) => setCustomQuality(e.target.value)}
                  error={dialogError}
                  helperText={dialogError ? "Quality is required" : ""}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    width: "100%",
                    mb: 2,
                  }}
                >
                  <Button
                    onClick={handleSaveCustomQuality}
                    color="success"
                    variant="contained"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleDialogClose}
                    color="error"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </Box>
              </DialogActions>
            </Dialog>
            <Grid item xs={12} sm={3}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
                helperText={errors.quantity ? "Quantity is required" : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="iw"
                label="Item Weight (gms)"
                type="number"
                inputProps={{ step: "any" }}
                fullWidth
                value={formData.iw || ""}
                onChange={handleChange}
                error={!!errors.iw}
                helperText={
                  !!errors.iw ? "Item Weight is required" : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} align="center" sx={{ mb: 0 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddJewel}
              sx={{
                fontWeight: 600,
                fontSize: "13px",
                backgroundColor: "rgb(255, 165, 0)",
                color: "#fff",
                height: '28px',
                '&:hover': {
                  backgroundColor: "rgb(255, 140, 0)", 
                },
              }}
            >
              Add Jewel
            </Button>
          </Grid>

            {jewelList.length > 0 && (
              <Grid item xs={12}>
                <TableContainer
                  component={Paper}
                  sx={{ maxWidth: 900, margin: "auto" }}
                >
                  <Table
                    sx={{
                      border: "1px solid black",
                      borderCollapse: "collapse",
                    }}
                  >
                    <TableHead
                      sx={{
                        color: "#1784CC",
                        backgroundColor:'#FFFFC5'
                      }}
                    >
                      <TableRow>
                        <TableCell
                          sx={{
                            padding: "12px",
                            textAlign: "left",
                            border: "1px solid black",
                            fontWeight: "700",
                            color: "#02437E",
                          }}
                        >
                          Jewel Details
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "12px",
                            textAlign: "left",
                            border: "1px solid black",
                            fontWeight: "700",
                            color: "#02437E",
                          }}
                        >
                          Quality
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "12px",
                            textAlign: "left",

                            fontWeight: "700",
                            color: "#02437E",
                            border: "1px solid black",
                          }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "12px",
                            textAlign: "left",

                            fontWeight: "700",
                            color: "#02437E",
                            border: "1px solid black",
                          }}
                        >
                          Item Weight (gms)
                        </TableCell>
                        <TableCell
                          sx={{
                            padding: "12px",
                            textAlign: "left",
                            border: "1px solid black",
                            fontWeight: "700",
                            color: "#02437E",
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {jewelList.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(even)": {
                              backgroundColor: "#f9f9f9",
                            },
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#fff",
                            },
                          }}
                        >
                          <TableCell sx={{ border: "1px solid black" }}>
                            {item.jDetails}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>
                            {item.quality}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>
                            {item.quantity}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>
                            {item.iw}
                          </TableCell>
                          <TableCell sx={{ border: "1px solid black" }}>
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteItem(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="gw"
                label="Gross Weight (gms)"
                type="number"
                inputProps={{ step: "any" }}
                fullWidth
                value={formData.gw || ""}
                onChange={handleChange}
                error={!!validationErrors.gw}
                helperText={
                  !!validationErrors.gw ? "Gross Weight is required" : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="nw"
                label="Net Weight (gms)"
                type="number"
                inputProps={{ step: "any" }}
                fullWidth
                value={formData.nw || ""}
                onChange={handleChange}
                error={!!validationErrors.nw}
                helperText={
                  !!validationErrors.nw ? "Net Weight is required" : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="doccharge"
                label="Document Charge"
                fullWidth
                value={formData.doccharge}
                onChange={handleChange}
                error={!!validationErrors.doccharge}
                helperText={
                  validationErrors.doccharge
                    ? "Document Charge is required"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} className="disables">
              <TextField
                name="interestbalamount"
                label=" interestbalamount"
                fullWidth
                value={formData.interestbalamount}
                onChange={handleChange}
                error={validationErrors.interestbalamount}
                helperText={
                  validationErrors.interestbalamount
                    ? "Loan Amount is required"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} className="disables">
              <TextField
                name="loanamountbalance"
                label="loanamountbalance"
                fullWidth
                value={formData.loanamountbalance}
                onChange={handleChange}
                error={validationErrors.loanamountbalance}
                helperText={
                  validationErrors.loanamountbalance
                    ? "Loan Amount is required"
                    : ""
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                name="interest"
                label="Interest"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                className="disables"
                fullWidth
                value={formData.interest}
                onChange={handleChange}
                error={!!validationErrors.interest}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Grid
            container
            style={{ marginTop: "5px" }}
            alignItems="center"
            justifyContent="center"
          >
            {!hideUploadButtons && (
              <Grid item xs={12} sm={3}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Button
                    variant="outlined"
                    color="warning"
                    component="label"
                    className="upload-button"
                  
                    fullWidth
                    sx={{ border: "1px dashed #f57f17",height:'38px' }}
                    startIcon={
                      <UploadIcon className="icon-color" sx={{ mr: 0 }} />
                    }
                  >
                    Jewel Uploads
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={(e) => handleFileChange(e, "proof3")}
                    />
                  </Button>
                  <Box mt={2}>
                    {files.proof3?.length > 0 ? ( 
                      files.proof3.map((file, idx) => (
                        <div
                          key={idx}
                          style={{ textAlign: "center", marginBottom: "10px" }}
                        >
                          <Typography variant="body2">{file.name}</Typography>
                          <IconButton
                            style={{
                              background: "rgba(255, 255, 255, 0.7)",
                              marginLeft: "10px",
                            }}
                            onClick={() => handleFileRemove("proof3", idx)} 
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      ))
                    ) : (
                      <Typography variant="body2">No files selected</Typography> 
                    )}
                  </Box>
                  {validationErrors.proof3 && (
                    <Typography color="error" variant="caption" mt={1}>
                      {validationErrors.proof3}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sx={{ mt: 1 }} align="center">
              <Button
                type="submit"
                className="sub-but"
                variant="contained"
                color="primary"
                sx={{  height:'28px'}}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};

export default Addloan;
