import React, { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "../Master/Master.css";
import Badge from "react-bootstrap/Badge";
import Swal from "sweetalert2";
import axios from "axios";
import { useLedger } from "../LedgerContext";
const Editmaster = ({ entry, handleDialogClose1 }) => {
  const { ledgerEntries } = useLedger();

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
    iw: "",
    gw: "",
    nw: "",
    schema: "",
    loanAmount: "",
    percent: "",
    interest: "",
    lastDateForLoan: "",
    fatherhusname: "",
    jewelList: [],
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
  });
  const [latestLoanNumber, setLatestLoanNumber] = useState("");
  const [enableCustomerId, setEnableCustomerId] = useState(false);
  const [jewelList, setJewelList] = useState([]);
  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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


  const fetchSchemas = () => {
    console.log("Fetching schemas...");

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/schemas`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received:", data);
        setSchemas(data);
      })
      .catch((error) => {
        console.error("Error fetching schemas:", error);
      });
  };

  useEffect(() => {
    console.log("Ledger Entries in Editmaster:", ledgerEntries);
    if (ledgerEntries) {
      setFormData({
        customerId: ledgerEntries.customerId || "",
        nw: ledgerEntries.nw || "",
        gw: ledgerEntries.gw || "",
        loanNumber: ledgerEntries.loanNumber || "",
        date: ledgerEntries.date || "",
     
        customerName: ledgerEntries.customerName || "",
        mobileNumber1: ledgerEntries.mobileNumber1 || "",
        mobileNumber2: ledgerEntries.mobileNumber2 || "",
        landmark: ledgerEntries.landmark || "",
        address: ledgerEntries.address || "",
        schema: ledgerEntries.schema || "",
        loanAmount: ledgerEntries.loanAmount || "",
        percent: ledgerEntries.percent || "",
        interest: ledgerEntries.interest || "",
        fatherhusname: ledgerEntries.fatherhusname || "",
        doccharge: ledgerEntries.doccharge || "",
        lastDateForLoan: ledgerEntries.lastDateForLoan || "",
        loanamountbalance: ledgerEntries.loanamountbalance || "",
        interestbalamount: ledgerEntries.interestbalamount || "",
      });
      if (Array.isArray(ledgerEntries.jewelList)) {
        setJewelList(ledgerEntries.jewelList);
      } else {
        console.error("Invalid jewelList data:", ledgerEntries.jewelList);
        setJewelList([]);
      }
    }
  }, [ledgerEntries]);
  const [localJewelList, setLocalJewelList] = useState(jewelList || []);
  useEffect(() => {
    setLocalJewelList(jewelList || []);
  }, [jewelList]);
  const handleAddRow = () => {
    setLocalJewelList([
      ...localJewelList,
      { jDetails: "", quality: "", quantity: "", iw: "", gw: "", nw: "" },
    ]);
  };
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedJewelList = [...jewelList];

    updatedJewelList[index] = {
      ...updatedJewelList[index],
      [name.split(".").pop()]: value,
    };

    setJewelList(updatedJewelList);
    console.log("Updated jewelList:", updatedJewelList);

    let newValue = value;

    if (name === "loanNumber") {
      newValue = value.toUpperCase();
    } else if (name === "date") {
      newValue = formatDateToInput(value);
    }

    setFormData((prevState) => {
      const newFormData = { ...prevState, [name]: newValue };
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
      if (name === "schema") {
        const selectedSchema = schemas.find(
          (schema) => schema.name === newValue
        );
        newFormData.percent = selectedSchema
          ? selectedSchema.interestPercent
          : "";
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

      if (name === "loanNumber") {
        const pattern = /^KRT\d{3,}$/;

        newFormData[name] = newValue;
      } else if (name === "mobileNumber1" || name === "mobileNumber2") {
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
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value,
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: value.trim() === "",
        }));
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
          newFormData.interest = interest.toFixed(1);
        } else {
          newFormData.interest = "";
        }
      }

      return newFormData;
    });
  };

  const validateFormData = (formData, files, isEditing) => {
    let errors = {};

    for (let key in formData) {
      if (
        key === "gw" ||
        key === "iw" ||
        key === "nw" ||
        key === "jDetails" ||
        key === "quality" ||
        key === "quantity" ||
        key === "mobileNumber2"
      ) {
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

    return errors;
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {}, [jewelList]);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const loanNumber = ledgerEntries?.loanNumber;
    if (!loanNumber) {
      console.error("Loan number is missing");
      return;
    }

    // Validate the form data
    const formDataWithJLNumber = { ...formData,};
    const validationErrors = validateFormData(formDataWithJLNumber);

    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors(validationErrors);
      console.error("Validation errors:", validationErrors);
      return;
    }

    // Reconstruct the jewelList with updated fields
    let updatedJewelList = [];
    const existingJewelListResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/ledger/loan/${loanNumber}`
    );
    const existingJewelList = existingJewelListResponse.data.jewelList || [];

    // Combine existing jewels with updates from formData
    localJewelList.forEach((jewel, index) => {
      if (formDataWithJLNumber[`jewelList[${index}].jDetails`] !== undefined) {
        // Copy existing jewel details
        updatedJewelList[index] = { ...existingJewelList[index] };

        // Update specific fields
        updatedJewelList[index] = {
          ...updatedJewelList[index],
          jDetails:
            formDataWithJLNumber[`jewelList[${index}].jDetails`] ||
            updatedJewelList[index].jDetails,
          quality:
            formDataWithJLNumber[`jewelList[${index}].quality`] ||
            updatedJewelList[index].quality,
          quantity:
            formDataWithJLNumber[`jewelList[${index}].quantity`] ||
            updatedJewelList[index].quantity,
        };
      } else {
        updatedJewelList.push(jewel);
      }
    });

    formDataWithJLNumber.jewelList = updatedJewelList.filter((item) => item);
    Object.keys(formDataWithJLNumber).forEach((key) => {
      if (key.startsWith("jewelList[")) {
        delete formDataWithJLNumber[key];
      }
    });

    console.log("Updated jewelList:", formDataWithJLNumber.jewelList);

    const formDataToSend = new FormData();
    for (const [key, value] of Object.entries(formDataWithJLNumber)) {
      if (key === "jewelList") {
        // Stringify jewelList as it's an array of objects
        formDataToSend.append(key, JSON.stringify(value));
      } else if (Array.isArray(value)) {
        // If the value is an array, iterate over the array and append each item
        value.forEach((item) => {
          formDataToSend.append(`${key}[]`, item);
        });
      } else if (value instanceof File) {
        // If the value is a file, append it directly (in case there are files)
        formDataToSend.append(key, value);
      } else {
        // For any other values, append them directly
        formDataToSend.append(key, value);
      }
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/update/${loanNumber}`,

        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`
        );
      }

      const data = await response.json();
      console.log("Success:", data);

      if (data.updatedLedger && data.updatedLedger.jewelList) {
        setJewelList(data.updatedLedger.jewelList);
      } else {
        console.error("jewelList not found in response:", data);
      }

      setAlertSeverity("success");
      setAlertMessage("Ledger entry updated successfully.");
      setAlertOpen(true);

      // Reset form data
      setFormData({
        customerId: "",
        loanNumber: "",
        date: "",
        lastDateForLoan: "",
      
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
        percent: "",
        loanAmount: "",
        interest: "",
        proof1: [],
        proof2: [],
        proof3: [],
        customerSign: null,
        customerPhoto: null,
        thumbImpression: null,
        fatherhusname: "",
        jewelList: [],
        doccharge: "",
        interestbalamount: "",
        loanamountbalance: "",
      });
      setLatestJewelNumber("");
      setValidationErrors({});
    } catch (error) {
      console.error("Error:", error.message);
      setAlertSeverity("error");
      setAlertMessage(error.message);
      setAlertOpen(true);
    }
  };

  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/${customerId}`
      );

      // Extract customer data
      const customer = response.data;
      setFormData((prevData) => ({
        ...prevData,
        ...customer,
        jewelList: customer.jewelList || [],
      }));
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
  const [showOtherJewel, setShowOtherJewel] = useState(false);
  const [showOtherQuality, setShowOtherQuality] = useState(false);

  const handleJewelChange = (e, index) => {
    const { value } = e.target;
    console.log("handleJewelChange:", value, index);
    setShowOtherJewel((prev) => ({ ...prev, [index]: value === "other" }));
    handleChange(e, index);
  };

  const handleQualityChange = (e, index) => {
    const { value } = e.target;
    console.log("handleQualityChange:", value, index);
    setShowOtherQuality((prev) => ({ ...prev, [index]: value === "other" }));
    handleChange(e, index);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleOpenDialog = (index) => {
    setDeleteIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteIndex(null);
  };

  const handleConfirmDelete = async (loanNumber) => {
    try {
      const updatedList = jewelList.filter((_, i) => i !== deleteIndex);
      setJewelList(updatedList);

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/update/${loanNumber}`,
        {
          jewelList: updatedList,
        }
      );
    } catch (error) {
      console.error("Error deleting jewel:", error);
    } finally {
      // Ensure the dialog closes after deletion is handled
      handleCloseDialog();
    }
  };
  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={60000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Paper
        style={{ padding: 20, margin: "auto", marginTop: "0px" }}
        sx={{ maxWidth: "100%", overflow: "hidden" }}
        className="paperbg"
      >
        <Typography
          variant="h5"
          gutterBottom
          className="disables-1"
          align="center"
          sx={{ color: "#D72122", fontWeight: "550" }}
        >
          EDIT LEDGER FORM
        </Typography>
        <Grid
          item
          xs={12}
          sm={2}
          style={{ textAlign: "center" }}
          className="disables"
          sx={{ mb: 2, mt: 2 }}
        >
          <Button variant="contained" color="primary" className="cate-btn">
            Next LoanNo:
            <Badge bg="warning" className="cate ">
              {latestLoanNumber}
            </Badge>
          </Button>
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
                InputProps={{
                  readOnly: true,
                }}
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
                value={formData.date}
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
                error={validationErrors.mobileNumber2}
                helperText={
                  validationErrors.mobileNumber2
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
                name="landmark"
                label="Landmark"
                fullWidth
                value={formData.landmark}
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
            <Grid item xs={12} sm={2}>
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
                  validationErrors.percent ? "Interest percent is required" : ""
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
                multiline
                rows={2}
                value={formData.address}
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

            <TableContainer
              component={Paper}
              sx={{ width: 800, margin: "auto" }}
              style={{ marginTop: "16px" }}
            >
              <Table>
                <TableHead
                  sx={{
                    backgroundColor: "#1784CC",
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "700",
                        color: "#fff",
                      }}
                    >
                      Jewel Details
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "700",
                        color: "#fff",
                      }}
                    >
                      Quality
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "700",
                        color: "#fff",
                      }}
                    >
                      Quantity
                    </TableCell>

                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "700",
                        color: "#fff",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {localJewelList.length > 0 ? (
                    localJewelList.map((jewel, index) => (
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
                        <TableCell>
                          {!showOtherJewel[index] ? (
                            <Select
                              name={`jewelList[${index}].jDetails`}
                              value={jewel.jDetails || ""}
                              onChange={(e) => handleJewelChange(e, index)}
                              error={
                                !!validationErrors[
                                  `jewelList[${index}].jDetails`
                                ]
                              }
                              fullWidth
                              sx={{ width: 200 }}
                            >
                              <MenuItem value="chain">Chain</MenuItem>
                              <MenuItem value="bracelet">Bracelet</MenuItem>
                              <MenuItem value="earnings">Earrings</MenuItem>
                              <MenuItem value="bangle">Bangle</MenuItem>
                              <MenuItem value="ring">Ring</MenuItem>
                              <MenuItem value="anklet">Anklet</MenuItem>
                              <MenuItem value="coin">Coin</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                            </Select>
                          ) : (
                            <TextField
                              name={`jewelList[${index}].jDetails`}
                              value={jewel.jDetails || ""}
                              onChange={(e) => handleJewelChange(e, index)}
                              placeholder="Enter custom jewel type"
                              fullWidth
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {!showOtherQuality[index] ? (
                            <Select
                              name={`jewelList[${index}].quality`}
                              value={jewel.quality || ""}
                              onChange={(e) => handleQualityChange(e, index)}
                              error={
                                !!validationErrors[
                                  `jewelList[${index}].quality`
                                ]
                              }
                              fullWidth
                              sx={{ width: 200 }}
                            >
                              <MenuItem value="916">916</MenuItem>
                              <MenuItem value="916 Hallmark">
                                916 Hallmark
                              </MenuItem>
                              <MenuItem value="H/M">H/M</MenuItem>
                              <MenuItem value="22K">22K</MenuItem>
                              <MenuItem value="20K">20K</MenuItem>
                              <MenuItem value="KDM">KDM</MenuItem>
                              <MenuItem value="916 KDM">916 KDM</MenuItem>
                              <MenuItem value="916 ZDM">916 ZDM</MenuItem>
                              <MenuItem value="other">Other</MenuItem>
                            </Select>
                          ) : (
                            <TextField
                              name={`jewelList[${index}].quality`}
                              value={jewel.quality || ""}
                              onChange={(e) => handleQualityChange(e, index)}
                              placeholder="Enter custom quality"
                              fullWidth
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <TextField
                            name={`jewelList[${index}].quantity`}
                            value={jewel.quantity || ""}
                            onChange={(e) => handleJewelChange(e, index)}
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            error={
                              !!validationErrors[`jewelList[${index}].quantity`]
                            }
                            helperText={
                              validationErrors[`jewelList[${index}].quantity`]
                                ? "Quantity is required"
                                : ""
                            }
                            fullWidth
                            variant="outlined"
                          />
                        </TableCell>

                        <TableCell>
                          <IconButton
                            edge="end"
                            onClick={() => handleOpenDialog(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography>
                          No jewels added yet. Add new jewel details below.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <Alert severity="warning">
                  Are you sure you want to delete this jewel?
                </Alert>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="secondary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            <Grid item xs={12} align="center" sx={{ mb: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleAddRow}
                sx={{ mt: 0, ml: 2, fontWeight: 600 }}
              >
                Add Jewel
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="nw"
                label="Net Weight"
                fullWidth
                value={formData.nw}
                onChange={handleChange}
                error={validationErrors.nw}
                helperText={validationErrors.nw ? "Net Weight is required" : ""}
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
                name="gw"
                label="Gross Weight"
                fullWidth
                value={formData.gw}
                onChange={handleChange}
                error={validationErrors.gw}
                helperText={
                  validationErrors.gw ? "Gross Weight is required" : ""
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
                name="fatherhusname"
                label="Father/Husband Name"
                fullWidth
                value={formData.fatherhusname}
                onChange={handleChange}
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
              <TextField
                name="lastDateForLoan"
                label="Last Date for Loan"
                type="date"
                InputLabelProps={{
                  shrink: true,
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
            <Grid item xs={12} sm={3}>
              <TextField
                name="interestbalamount"
                label=" interestbalamount"
                fullWidth
                value={formData.interestbalamount}
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
            <Grid item xs={12} sm={3}>
              <TextField
                name="loanamountbalance"
                label="loanamountbalance"
                fullWidth
                value={formData.loanamountbalance}
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
          <Grid container style={{ marginTop: "20px" }} align="center">
            <Grid item xs={12} sx={{ mt: 0 }} align="center">
              <Button
                type="submit"
                className="sub-but"
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
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

export default Editmaster;
