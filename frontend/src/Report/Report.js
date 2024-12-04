import React, { useState } from "react";
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./report.css";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import PrintDialog from "./printDialog";
import { toWords } from "number-to-words";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Report = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customerId = state?.customerId;
  const loanNumber = state?.loanNumber;
  const [jewelList, setJewelList] = useState([]);
  const [isClosed, setIsClosed] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [formData, setFormData] = useState({
    jewelNo: "",
    customerName: "",
    date: "",
    customerId: "",
    loanNo: "",
    mobileNumber: "",
    address: "",
    loan: "",
    loanAmount: "",
    totalAmount: "",
    items: "",
    quality: "",
    quantity: "",
    totalWeightGms: "",
    gross: "",
    net: "",
    agreementSigned: "",
    customerSign1: "",
    cashReceivedRs: "",
    rupeesInWords: "",
    paymentNo: "",
    paymentDate: "",
    receiptNo: "",
    noOfDays: "",
    interestPrinciple: "",
    balancePrinciple: "",
    remarks: "",
    loanClosureDate: "",
    lastDateForLoan: "",
    closedate: "",
    customersign: "",
    schema: "",
    percent: "",
    totalamount: "",
    interest: "",
    interestamount: "",
  });

  const [isReadOnly, setIsReadOnly] = useState(false);
  const [noOfDays, setNoOfDays] = useState(0);

  const [formDisabled, setFormDisabled] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    jewelNo: false,
    customerName: false,
    date: false,
    customerId: false,
    loanNo: false,
    mobileNumber: false,
    address: false,
    loan: false,
    loanAmount: false,
    totalAmount: false,
    items: false,
    quality: false,
    quantity: false,
    totalWeightGms: false,
    gross: false,
    net: false,
    agreementSigned: false,
    cashReceivedRs: false,
    rupeesInWords: false,
    paymentNo: false,
    paymentDate: false,
    receiptNo: false,
    noOfDays: false,
    interestPrinciple: false,
    balancePrinciple: false,
    remarks: false,
    loanClosureDate: false,
    customersign: false,
    cashiersign: false,
    authorizedFile: false,
    schema: false,
    percent: false,
    totalamount: false,
    interestamount: false,
    interest: false,
    lastDateForLoan: false,
  });
  useEffect(() => {
    const customerId = sessionStorage.getItem("customerId");
    const loanNumber = sessionStorage.getItem("loanNumber");

    if (customerId && loanNumber) {
      setFormData((prevData) => ({
        ...prevData,
        customerId: customerId,
        loanNo: loanNumber,
      }));
      fetchReportData(loanNumber);
      sessionStorage.removeItem("customerId");
      sessionStorage.removeItem("loanNumber");
    } else {
      navigate("/report");
    }
  }, [navigate]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const currentDate = new Date();
    const lastDateForLoan = new Date(formData.lastDateForLoan);

    if (name === "interestamount") {
      if (parseFloat(value) > parseFloat(formData.loanAmount)) {
        setValidationErrors((prevState) => ({
          ...prevState,
          interestamount: true,
        }));
        return;
      } else {
        setValidationErrors((prevState) => ({
          ...prevState,
          interestamount: false,
        }));
      }
    }

    

    if (name === "date") {
      const formattedDate = value; // Already in the correct format
      setFormData({ ...formData, [name]: formattedDate });

      // Handle loan amount and its conversion to words
    } else if (name === "loanAmount") {
      const amountInWords = toWords(value);
      const totalAmount = calculateTotalAmount(value, formData.interest); // Calculate total amount
      setFormData({
        ...formData,
        [name]: value,
        rupeesInWords: amountInWords,
        totalAmount,
      });

      // Handle interest and its impact on total amount
    } else if (name === "interest") {
      const totalAmount = calculateTotalAmount(formData.loanAmount, value); // Calculate total amount
      setFormData({ ...formData, [name]: value, totalAmount });

      
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Handle fetching report data based on loanNo and customerId
    if (name === "loanNo") {
      setSelectedLoanNumber(value);
      fetchReportData(value);
    }

    if (name === "customerId") {
      fetchReportData(value);
    }
  };

  const calculateTotalAmount = (loanAmount, interest) => {
    // Assuming loanAmount and interest are numeric strings
    const loan = parseFloat(loanAmount) || 0;
    const interestAmount = parseFloat(interest) || 0;
    return (loan + interestAmount).toFixed(0); // Returning a fixed-point number
  };
  const [loanNumbers, setLoanNumbers] = useState([]);
  const [selectedLoanNumber, setSelectedLoanNumber] = useState("");
  useEffect(() => {
    if (formData.customerId) {
      fetchLoanNumbers(formData.customerId);
    }
  }, [formData.customerId]);

  const fetchLoanNumbers = (customerId) => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/loans/${customerId}`
      )
      .then((response) => {
        setLoanNumbers(response.data);
        console.log("Loan Numbers:", response.data); // Log loan numbers to the console
      })
      .catch((error) => {
        console.error("Error fetching loan numbers:", error);
      });
  };
  const fetchReportData = (loanNumber) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/loan/${loanNumber}`)
      .then((response) => {
        const reportData = response.data;
        const formattedDate = new Date(reportData.date)
          .toISOString()
          .split("T")[0];
        const formattedLastDateForLoan = new Date(reportData.lastDateForLoan)
          .toISOString()
          .split("T")[0];
        const amountInWords = toWords(reportData.loanAmount);

        setFormData({
          gross: reportData.gw,
          customerName: reportData.customerName,
          date: formattedDate,
          customerId: reportData.customerId,
          loanNo: reportData.loanNumber,
          mobileNumber: reportData.mobileNumber1,
          address: reportData.address,
          loanAmount: reportData.loanAmount,
          rupeesInWords: amountInWords,
          totalAmount: reportData.totalAmount,
          items: reportData.iw,
          quality: reportData.quality,
          quantity: reportData.quantity,
          interest: reportData.interest,
          totalWeightGms: reportData.iw,
          net: reportData.nw,
          schema: reportData.schema,
          percent: reportData.percent,
          lastDateForLoan: formattedLastDateForLoan,
        });
        const jewelList = reportData.jewelList || [];

        setJewelList(jewelList);
        setIsReadOnly(true);
        console.log("last date for loan", formattedLastDateForLoan);
      })
      .catch((error) => {
        console.error("Error fetching report data:", error);
      });
  };
  useEffect(() => {
    if (loanNumber) {
      fetchReportData(loanNumber);
    }
  }, [loanNumber]);
  useEffect(() => {
    const calculateDays = async () => {
      if (formData.paymentDate && formData.date) {
        try {
          const previousEntriesResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/byLoanNo/${formData.loanNo}`
          );
          const previousEntries = previousEntriesResponse.data;

          previousEntries.sort(
            (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
          );

          let calculatedNoOfDays = 0;
          let lastPaymentDate;

          if (previousEntries.length > 0) {
            lastPaymentDate = new Date(previousEntries[0].paymentDate);

            calculatedNoOfDays =
              Math.floor(
                (new Date(formData.paymentDate) - lastPaymentDate) /
                  (1000 * 60 * 60 * 24)
              ) + 1;
          } else {
            const loanDate = new Date(formData.date);
            const paymentDate = new Date(formData.paymentDate);

            calculatedNoOfDays =
              Math.floor((paymentDate - loanDate) / (1000 * 60 * 60 * 24)) + 1;
          }

          setNoOfDays(calculatedNoOfDays);
          setFormData((prevData) => ({
            ...prevData,
            noOfDays: calculatedNoOfDays.toString(),
          }));
        } catch (error) {
          console.error("Error calculating days:", error);
        }
      }
    };

    calculateDays();
  }, [formData.paymentDate, formData.loanNo, formData.date]);
  const calculateTotalAmounts = (loanAmount, interest) => {
    const loan = parseFloat(loanAmount) || 0;
    const interestAmount = parseFloat(interest) || 0;
    return (loan + interestAmount).toFixed(0);
  };

  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    calculateInterest();
  }, [formData.percent, formData.loanAmount]);

  const calculateInterest = () => {
    const { percent, loanAmount } = formData;
    let interest = 0;

    if (percent && loanAmount) {
      const principal = parseFloat(loanAmount);
      const percentage =
        typeof percent === "string"
          ? parseFloat(percent.replace("%", ""))
          : percent;

      if (!isNaN(principal) && !isNaN(percentage)) {
        if (percentage === 12) {
          interest = principal * 0.12;
        } else if (percentage === 18) {
          interest = (principal * 0.18) / 2;
        } else if (percentage === 24) {
          interest = (principal * 0.24) / 2;
        } else if (percentage === 30) {
          interest = (principal * 0.3) / 2;
        } else {
          interest = 0;
        }
        setFormData((prevData) => {
          const totalAmount = (principal + interest).toFixed(0);
          return {
            ...prevData,
            interest: interest.toFixed(0),
            totalAmount: totalAmount,
          };
        });
      } else {
        setFormData((prevData) => ({
          ...prevData,
          interest: "",
          totalAmount: "",
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        interest: "",
        totalAmount: "",
      }));
    }
  };

  const [authorizedFile, setAuthorizedFile] = useState(null);
  const [customersign, setCustomersign] = useState(null);
  const [cashiersign, setCashiersign] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(true);
  const [showOtherButtons, setShowOtherButtons] = useState(false);
  const handlePrint = (row) => {
    setSelectedRow({
      paymentDate: row.paymentDate,
      customerId: row.customerId,
      customerName: (formData && formData.customerName) || row.customerName,
      loanNo: (formData && formData.loanNo) || row.loanNo,
      jewelNo: (formData && formData.jewelNo) || row.jewelNo,
      schema: (formData && formData.schema) || row.schema,
      noOfDays: row.noOfDays,
      interestamount: row.interestamount,
      interestPrinciple: row.interestPrinciple,
      balance: row.balance,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFileChange = (setter) => (e) => {
    const selectedFile = e.target.files[0];
    setter(selectedFile);
  };

  const handleFileRemove = (setter) => () => {
    setter(null);
  };
  const submitReport = async (formDataToSend) => {
    try {
      formDataToSend.append("jewelList", JSON.stringify(jewelList));
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/report`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Report submitted successfully.");
    } catch (error) {
      console.error("Error submitting report:", error);
      Swal.fire({
        title: "Error!",
        text: "There was a problem submitting the report",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const calculateAndUpdateBalance = async () => {
    try {
      const previousEntriesResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/byLoanNo/${formData.loanNo}`
      );
      const previousEntries = previousEntriesResponse.data;

      previousEntries.sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      );

      let previousBalance = 0;
      let previousLoanAmountBalance = 0;
      let previousInterestBalAmount = 0;

      if (previousEntries.length > 0) {
        previousBalance = parseFloat(previousEntries[0].balance);
        previousLoanAmountBalance = parseFloat(
          previousEntries[0].loanamountbalance
        );
        previousInterestBalAmount = parseFloat(
          previousEntries[0].interestbalamount
        );
      }

      const totalAmountNum = parseFloat(formData.totalAmount);
      const interestAmountNum = Math.floor(parseFloat(formData.interestamount));
      const interestPrincipleNum = Math.floor(
        parseFloat(formData.interestPrinciple)
      );

      let principalAmount = parseFloat(formData.loanAmount);
      let interestRate = parseFloat(formData.percent);
      const numberOfDays = parseInt(formData.noOfDays);

      if (
        isNaN(principalAmount) ||
        isNaN(interestRate) ||
        isNaN(numberOfDays)
      ) {
        throw new Error("Invalid input: One or more values are not numbers.");
      }

      if (interestRate === 12) {
        interestRate = 0.12;
      } else if (interestRate === 18) {
        interestRate = 0.18;
      } else if (interestRate === 24) {
        interestRate = 0.24;
      } else {
        throw new Error("Invalid interest rate: Must be 12, 18, or 24");
      }

      const dailyInterestRate = interestRate / 365;

      // Use previousLoanAmountBalance if available, otherwise use principalAmount
      const amountToCalculateInterest =
        previousLoanAmountBalance > 0
          ? previousLoanAmountBalance
          : principalAmount;
      const calculatedInterest =
        amountToCalculateInterest * dailyInterestRate * numberOfDays;

      const roundUpToNearestTen = (num) => Math.ceil(num / 10) * 10;

      let interestbalamount = roundUpToNearestTen(calculatedInterest);
      console.log(
        "Calculated Interest (Rounded to nearest 10):",
        interestbalamount
      );

      // If the interestPrinciple matches the calculated interest, set the interest balance to 0
      if (interestPrincipleNum >= interestbalamount) {
        interestbalamount = 0;
      }

      let loanamountbalance;
      if (previousEntries.length === 0) {
        loanamountbalance = principalAmount - interestAmountNum;
      } else {
        loanamountbalance = previousLoanAmountBalance - interestAmountNum;
      }

      let newBalance;

      if (previousBalance === 0) {
        newBalance = Math.floor(principalAmount - interestAmountNum);
        console.log("New Balance when previousBalance is 0:", newBalance);
      } else {
        newBalance = Math.floor(previousLoanAmountBalance - interestAmountNum);
        console.log("New Balance when previousBalance is NOT 0:", newBalance);
      }
      console.log("the new balance is :", newBalance);
      // Prevent negative balance
      if (newBalance < 0) {
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "Payment cannot be processed as it would result in a negative balance.",
        });
        return;
      }

      newBalance = Math.max(newBalance, 0);

      // Check if account should be closed
      if (newBalance === 0) {
        Swal.fire({
          icon: "info",
          title: "Account Closed",
          text: "The account is closed as the interest or loan balance is cleared.",
        });
        setSnackbarOpen(true);
        setSnackbarMessage("Account Closed");
        setFormDisabled(true);
        setIsClosed(true);
      }

      const newEntry = {
        ...formData,
        balance: newBalance,
        loanamountbalance: loanamountbalance,
        interestbalamount: interestbalamount,
      };
      console.log("The new entry is", newEntry);

      const updatedTableData = [newEntry, ...tableData];
      updatedTableData.sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      );

      setTableData(updatedTableData);

      // Update ledger information
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/updateLoan/${formData.loanNo}`,
        {
          loanamountbalance: loanamountbalance,
          interestbalamount: interestbalamount,
        }
      );

      Swal.fire({
        title: "Success!",
        html: `<p>Payment completed</p><p style="color: red;">Don't forget to save</p>`,
        icon: "success",
        confirmButtonText: "OK",
      });

      // Clear form data after successful operation
      setFormData({
        jewelNo: "",
        customerName: "",
        loanDate: "",
        customerId: "",
        loanNo: "",
        mobileNumber: "",
        address: "",
        loan: "",
        loanAmount: "",
        totalAmount: "",
        items: "",
        quality: "",
        quantity: "",
        totalWeightGms: "",
        gross: "",
        net: "",
        cashReceivedRs: "",
        rupeesInWords: "",
        paymentNo: "",
        paymentDate: "",
        receiptNo: "",
        noOfDays: "",
        agreementSigned: "",
        interestPrinciple: "",
        balancePrinciple: "",
        remarks: "",
        loanClosureDate: "",
        schema: "",
        percent: "",
        totalamount: "",
        interestamount: "",
        lastDateForLoan: "",
      });

      setCustomersign(null);
      setCashiersign(null);
      setAuthorizedFile(null);
      setShowSaveButton(true);
      setShowOtherButtons(false);
    } catch (error) {
      console.error("Error calculating and updating balance:", error);
      Swal.fire({
        title: "Error!",
        text: "There was a problem calculating the balance",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let valid = true;
    let updatedErrors = { ...validationErrors };

    Object.keys(updatedErrors).forEach((field) => {
      updatedErrors[field] = !formData[field];
    });
    if (!formData.paymentDate) {
      updatedErrors.paymentDate = true;
      valid = false;
    } else {
      updatedErrors.paymentDate = false;
    }
    if (!formData.interestPrinciple) {
      updatedErrors.interestPrinciple = true;
      valid = false;
    } else {
      updatedErrors.interestPrinciple = false;
    }
    if (!formData.interestamount) {
      updatedErrors.interestamount = true;
      valid = false;
    } else {
      updatedErrors.interestamount = false;
    }
    if (!formData.noOfDays) {
      updatedErrors.noOfDays = true;
      valid = false;
    } else {
      updatedErrors.noOfDays = false;
    }

    setValidationErrors(updatedErrors);

    if (!valid) {
      Swal.fire({
        title: "Validation Error!",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, formData[key]);
      }
    }
    if (authorizedFile) {
      formDataToSend.append("authorizedFile", authorizedFile);
    }

    await submitReport(formDataToSend);
    await calculateAndUpdateBalance();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (row) => {
    try {
      // Validate and format date
      if (!row || !row.paymentDate) {
        throw new Error("Row data is invalid");
      }

      const date = new Date(row.paymentDate);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid payment date provided");
      }
      const formattedDate = date.toISOString().split("T")[0];

      const formattedRow = {
        ...row,
        paymentDate: formattedDate,
        customerId: row.customerId,
        noOfDays: row.noOfDays || 0,
        interestbalamount: row.interestbalamount || 0,
        loanamountbalance: row.loanamountbalance || 0,
        interestPrincipleNum: row.interestPrinciple,
        interestAmountNum: row.interestamount,
      };

      // Check if the loan entry exists
      const checkResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/check/${formattedRow.loanNo}`
      );

      if (checkResponse.data.exists) {
        // Update existing entry
        const updateResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/updateClosed/${formattedRow.loanNo}`,
          formattedRow
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data updated successfully",
        });
      } else {
        // Create new entry
        const createResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/add`,
          formattedRow
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data saved successfully",
        });
      }

      // Reset UI after saving
      setShowSaveButton(false);
      setShowOtherButtons(true);
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Loan entry with this payment date already exists",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save data",
        });
      }
      setIsSaved(false);
    }
  };

  const fetchTableData = async (loanNo) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/byLoanNo/${loanNo}`
      );
      console.log("API Response:", response.data);
      setShowSaveButton(false);
      setShowOtherButtons(true);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setTableData(response.data);

        const hasClosedAccount = response.data.some(
          (entry) => entry.balance === 0
        );
        const hasAnyEntryClosed = response.data.some((entry) => entry.isClosed);

        setIsFormDisabled(hasClosedAccount || hasAnyEntryClosed);

        if (hasClosedAccount) {
          setSnackbarMessage("Account is closed");
          setSnackbarOpen(true);
        }
      } else {
        console.error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  useEffect(() => {
    const loanNo = formData.loanNo;
    if (loanNo) {
      fetchTableData(loanNo);
    }
  }, [formData.loanNo]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/delete/${id}`
          );
          Swal.fire("Deleted!", response.data.message, "success");
        } catch (error) {
          console.error("Error deleting loan entry:", error);
          Swal.fire("Error!", "Failed to delete loan entry", "error");
        }
      }
    });
  };

  return (
    <>
      <Snackbar open={snackbarOpen} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div style={{ padding: "20px", marginTop: "0px" }}>
        <Paper
          elevation={2}
          style={{ padding: "20px" }}
          sx={{ maxWidth: 1100, margin: "auto" }}
          className="paperbg"
        >
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ color: "#D72122", fontWeight: "550" }}
          >
            APPRAISAL ENTRY
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Customer ID"
                  name="customerId"
                  value={formData.customerId}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
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
                  select
                  label="Loan Number"
                  name="loanNo"
                  value={formData.loanNo}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                >
                  <option value=""></option>
                  {loanNumbers.map((loan) => (
                    <option key={loan.loanNumber} value={loan.loanNumber}>
                      {loan.loanNumber}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Name of the Borrower"
                  name="customerName"
                  value={formData.customerName}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
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
                  label="Date of Loan"
                  name="loanDate"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.date}
                  helperText={validationErrors.date ? "Date is required" : ""}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
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
                  name="lastDateForLoan"
                  label="Last Date for Loan"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  fullWidth
                  value={formData.lastDateForLoan}
                  onChange={handleInputChange}
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
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Mobile Number"
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.mobileNumber}
                  helperText={
                    validationErrors.mobileNumber
                      ? "Mobile Number is required"
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
                  label="principle"
                  name="principle"
                  value={formData.loanAmount}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.principal}
                  helperText={
                    validationErrors.principal
                      ? "Principle Amount  is required"
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
              </Grid>{" "}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.interest}
                  helperText={
                    validationErrors.interest ? "Interest  is required" : ""
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
                  label="Address"
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.address}
                  helperText={
                    validationErrors.address ? "Address is required" : ""
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
            </Grid>

            <Typography
              variant="h6"
              sx={{ mt: 3, mb: 2, color: "#D72122", fontWeight: "550" }}
              align="center"
            >
              LOAN DETAILS
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Rupees in Words"
                  name="rupeesInWords"
                  value={formData.rupeesInWords}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.rupeesInWords}
                  helperText={
                    validationErrors.rupeesInWords
                      ? "Rupees in word  is required"
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
                  label="Agreement Signed and Cash Received (Rs)"
                  name="loanAmount"
                  value={formData.loanAmount}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.loanAmount}
                  helperText={
                    validationErrors.loanAmount
                      ? "Cash amount  is required"
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
              <Grid item xs={12} sm={2}>
                <TextField
                  label="Gross Weight"
                  name="gw"
                  value={formData.gross}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.gw}
                  helperText={
                    validationErrors.gw ? "Cash amount  is required" : ""
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
                  label="Net Weight"
                  name="gw"
                  value={formData.net}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.nw}
                  helperText={
                    validationErrors.nw ? "Cash amount  is required" : ""
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
              <Table
                sx={{
                  width: "100%",
                  ml: 2,
                  borderCollapse: "collapse",
                  margin: "20px 0px 7px 10px",
                  fontSize: "16px",
                  color: "#333",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #ddd",
                }}
              >
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
                        borderTopLeftRadius: "8px",
                      }}
                    >
                      Jewel Details
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "12px",
                        textAlign: "left",
                        borderBottom: "2px solid #ddd",
                        fontWeight: "bold",
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
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jewelList.map((jewel, index) => (
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
                      <TableCell
                        sx={{
                          padding: "12px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {jewel.jDetails || "Unknown"}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "12px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {jewel.quality || "N/A"}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "12px",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        {jewel.quantity || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>

            <Typography
              variant="h6"
              sx={{ mt: 3, mb: 2, color: "#D72122", fontWeight: "550" }}
              align="center"
            >
              PAYMENT DETAILS
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Schema"
                  name="schema"
                  value={formData.schema}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.schema}
                  disabled={isFormDisabled}
                  helperText={
                    validationErrors.schema ? "schema  is required" : ""
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              </Grid>{" "}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="percent"
                  name="percent"
                  value={formData.percent}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  disabled={isFormDisabled}
                  error={validationErrors.percent}
                  helperText={
                    validationErrors.percent ? "percent  is required" : ""
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
                  label="Date"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  disabled={isFormDisabled}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.paymentDate}
                  helperText={
                    validationErrors.paymentDate
                      ? "Payment date  is required"
                      : ""
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  label="Receipt No"
                  name="receiptNo"
                  value={formData.receiptNo}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={isFormDisabled}
                  fullWidth
                  error={validationErrors.receiptNo}
                  helperText={
                    validationErrors.receiptNo
                      ? "Receipt number  is required"
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
                  label="Principle paid"
                  name="interestamount"
                  value={formData.interestamount}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.interestamount}
                  helperText={
                    validationErrors.interestamount
                      ? `Principle amount cannot exceed ${formData.loanAmount}`
                      : ""
                  }
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
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
                  label="No of Days"
                  name="noOfDays"
                  value={formData.noOfDays}
                  onChange={handleInputChange}
                  variant="outlined"
                  disabled={isFormDisabled}
                  fullWidth
                  error={validationErrors.noOfDays}
                  helperText={
                    validationErrors.noOfDays
                      ? "Number of days  is required"
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
                  label="Interest Paid"
                  name="interestPrinciple"
                  value={formData.interestPrinciple}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.interestPrinciple}
                  helperText={
                    validationErrors.interestPrinciple
                     ? "Interest is required"
                      : ""
                  }
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
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
                  label="Balance Principle"
                  name="balancePrinciple"
                  className="disables"
                  value={formData.balancePrinciple}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.balancePrinciple}
                  helperText={
                    validationErrors.balancePrinciple
                      ? "Balance  is required"
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
              <Grid item xs={12} sm={6} className="disables">
                <TextField
                  label="total amount"
                  name="totalAmount"
                  className="disables"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  variant="outlined"
                  fullWidth
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
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  variant="outlined"
                  fullWidth
                  error={validationErrors.remarks}
                  helperText={
                    validationErrors.remarks ? "Remarks  is required" : ""
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
            </Grid>

            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              sx={{ mt: 2 }}
            >
              <Grid item xs={12} sm={6} md={3}>
                {customersign ? (
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <img
                      src={URL.createObjectURL(customersign)}
                      alt="Authorized Sign"
                      style={{ width: "90%", height: "60px" }}
                    />
                    <IconButton
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "rgba(255, 255, 255, 0.7)",
                      }}
                      onClick={handleFileRemove(setCustomersign)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      className="bill-button"
                    >
                      Customer Signature
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange(setCustomersign)}
                      />
                    </Button>
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                {cashiersign ? (
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <img
                      src={URL.createObjectURL(cashiersign)}
                      alt="Authorized Sign"
                      style={{ width: "90%", height: "60px" }}
                    />
                    <IconButton
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "rgba(255, 255, 255, 0.7)",
                      }}
                      onClick={handleFileRemove(setCashiersign)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      className="bill-button"
                    >
                      Cashier Signature
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange(setCashiersign)}
                      />
                    </Button>
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  name="closedate"
                  label="Loan Closure Date"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.closedate}
                  onChange={handleInputChange}
                  error={validationErrors.closedate}
                  helperText={
                    validationErrors.closedate
                      ? "Loan Closure Date is required"
                      : ""
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                    },

                    "& .MuiInputBase-input": {
                      padding: "8px",
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                className="add-but"
                color="primary"
                disabled={formDisabled}
                style={{ marginRight: "10px" }}
              >
                Add
              </Button>
            </Grid>
          </form>
        </Paper>
      </div>
      <div style={{ padding: "20px", marginTop: "20px" }}>
        <Paper
          elevation={2}
          style={{ padding: "20px" }}
          sx={{ maxWidth: 1100, margin: "auto" }}
          className="paperbg"
        >
          <form onSubmit={handleSubmit}></form>

          <TableContainer component={Paper}>
            <Table sx={{ border: "1px solid black" }}>
              <TableHead sx={{ backgroundColor: "#1784CC ", fontWeight: 600 }}>
                <TableRow sx={{ border: "1px solid black" }}>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    className="disables"
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    className="disables"
                  >
                    Interest
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    className="disables"
                  >
                    Total Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    CustomerID
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Loan no
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                      width: "50px",
                    }}
                  >
                    No of Days
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Interest
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Principal
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Balance
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                      width: "70px",
                    }}
                  >
                    Principal Balance
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                      width: "70px",
                    }}
                  >
                    Interest Balance
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    className="disables"
                  >
                    jewel no
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    className="disables"
                  >
                    customer name
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid black" }}
                    className="disables"
                  >
                    schema
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: 600,
                    }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.paymentDate}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="disables"
                    >
                      {row.loanAmount}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="disables"
                    >
                      {row.interest}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="disables"
                    >
                      {row.totalAmount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.customerId}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.loanNo}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.noOfDays}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.interestPrinciple}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.interestamount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.balance}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.loanamountbalance}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {row.interestbalamount}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="disables"
                    >
                      {row.jewelNo}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="disables"
                    >
                      {row.customerName}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="disables"
                    >
                      {row.schema}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {showSaveButton && (
                        <Button
                          variant="contained"
                          className="report-button sub-but"
                          onClick={() => handleSave(row)}
                          sx={{ mt: 1, ml: 1 }}
                        >
                          Save
                        </Button>
                      )}
                      {showOtherButtons && (
                        <>
                          <Button
                            variant="contained"
                            className="report-button sub-print"
                            onClick={() => handlePrint(row)}
                            sx={{ mt: 1, ml: 1 }}
                          >
                            Voucher
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            className="report-button sub-del"
                            sx={{ mt: 1, ml: 1 }}
                            onClick={() => handleDelete(row._id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <PrintDialog
            open={openDialog}
            onClose={handleCloseDialog}
            data={selectedRow}
          />
        </Paper>
      </div>
    </>
  );
};

export default Report;
