import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  IconButton,
  TableCell,
} from "@mui/material";
import { toWords } from "number-to-words";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import image from "../../src/Navbar/KRT Gold Finance Logo PNG File.png";
import "./Voucher.css";
import { capitalize } from "lodash";

const Voucher = () => {
  const [formData, setFormData] = useState({
    customerId: "",
    loanNo: "",
    jwNo: "",
    date: "",
    customerName: "",
    schema: "",
    rupeesInWords: "",
    principal: "",
    interest: "",
    noOfDays: "",
    loanAmount: "",
    cashier: "",
    customer: "",
    percent: "",
    laonsamount: "",
    interestPrinciple: "",
    interestAmount: "",
    balance: "",
  });
  const [file, setFile] = useState(null);
  const [customerFile, setCustomerFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "loanNo") {
      setSelectedLoanNumber(value);
      fetchLoanDetails(value);
    } else if (name === "date") {
      const formattedDate = value;
      setFormData({ ...formData, [name]: formattedDate });
    } else if (name === "loanAmount") {
      const amountInWords = toWords(value);
      setFormData({ ...formData, [name]: value, rupeesInWords: amountInWords });
    }
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
        console.log("Full response data:", response.data);
        response.data.forEach((loan, index) => {
          console.log(`Loan ${index + 1} details:`, {
            loanNumber: loan.loanNumber,
            date: loan.date,
         
            customerName: loan.customerName,
            mobileNumber1: loan.mobileNumber1,
            mobileNumber2: loan.mobileNumber2,
            landmark: loan.landmark,
            address: loan.address,
            jDetails: loan.jDetails,
            quality: loan.quality,
            quantity: loan.quantity,
            iw: loan.iw,
            gw: loan.gw,
            nw: loan.nw,
            schema: loan.schema,
            percent: loan.percent,
            loanAmount: loan.loanAmount,
          });
        });
        setLoanNumbers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching loan numbers:", error);
      });
  };

  const fetchLoanDetails = (loanNumber) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/loan/${loanNumber}`)
      .then((response) => {
        const ledgerData = response.data;
        const formattedDate = new Date(ledgerData.date)
          .toISOString()
          .split("T")[0];
        const amountInWords = toWords(ledgerData.loanAmount);

        // Set initial form data from ledger data
        setFormData((prevData) => ({
          ...prevData,
          customerId: ledgerData.customerId,
          loanNo: ledgerData.loanNumber,
          
          date: formattedDate,
          customerName: ledgerData.customerName,
          schema: ledgerData.schema,
          rupeesInWords: amountInWords,
          principal: ledgerData.principal,
          interest: ledgerData.interest,
          loanAmount: ledgerData.loanAmount,
          cashier: ledgerData.cashier,
          customer: ledgerData.customer,
          percent: ledgerData.percent,
          loansAmount: ledgerData.loansAmount,
        }));

        return axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/byLoanNo/${ledgerData.loanNumber}`
        );
      })
      .then((loanEntryResponse) => {
        const loanEntries = loanEntryResponse.data;
        console.log(loanEntries);

        if (loanEntries.length > 0) {
          const latestEntry = loanEntries[0];

          setFormData((prevData) => ({
            ...prevData,
            noOfDays: latestEntry.noOfDays,
            interestPrinciple: latestEntry.interestPrinciple,
            interestAmount: latestEntry.interestamount,
            balance: latestEntry.balance,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching loan details:", error);
      });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleCustomerFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setCustomerFile(selectedFile);
  };

  const handleCustomerFileRemove = () => {
    setCustomerFile(null);
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    // Reset form after submission (if needed)
    setFormData({
      customerId: "",
      loanNo: "",
      jwNo: "",
      date: "",
      customerName: "",
      schema: "",
      rupeesInWords: "",
      principal: "",
      interest: "",
      noOfDays: "",
      loanAmount: "",
      cashier: "",
      customer: "",
      percent: "",
      laonsamount: "",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px", marginTop: "0px" }}>
      <Paper
        elevation={2}
        style={{ padding: "20px" }}
        sx={{ maxWidth: 600, margin: "auto",mt:-1 }}
        className="paperbg2"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <img
              src={image}
              alt="Logo"
              style={{ width: "100%", height: "auto" }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              className="headss"
            >
              KRT GOLD FINANCE
            </Typography>
            <Typography variant="subtitle1" align="center" sx={{mt:-1}}>
              Cell No: 9042425142, 9042425642
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              135/5 Velavan Complex, Near (MGN) Lodge, Salem Main Road,
              <br />
              Komarapalayam-638183
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" align="center" sx={{mt:-2}}>
              Receipt Voucher
            </Typography>
          </Grid>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Id"
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Loan Number"
                name="loanNo"
                value={formData.loanNo}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
                SelectProps={{
                  native: true,
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

            <Grid item xs={12} sm={6}>
              <TextField
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Schema"
                name="schema"
                value={formData.schema}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="No Of Days"
                name="rupeesInWords"
                value={formData.noOfDays}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TableContainer
                component={Paper}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "10px auto",
                  maxWidth: "80%",
                }}
                sx={{ mt: 2, mb: 5 }}
                className="tables"
              >
                <Table
                  aria-label="Customer Entry Details - Part 2"
                  className="table-bordered"
                >
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1">
                          Principal Paid: {formData.interestAmount}
                        </Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>
                        <Typography variant="body1">
                          Interest Paid: {formData.interestPrinciple}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1">
                          Balance: {formData.balance}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label=" Loan Amount"
                name="amount"
                value={formData.loanAmount}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label=" Interest"
                name="amount"
                value={formData.interest}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              {file ? (
                <div style={{ position: "relative", textAlign: "center" }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Cashier Sign"
                    style={{ width: "90%", height: "60px" }}
                  />
                  <IconButton
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "rgba(255, 255, 255, 0.7)",
                    }}
                    onClick={handleFileRemove}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "capitalize", height: "54px" }}
                >
                  Cashier Sign
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              {customerFile ? (
                <div style={{ position: "relative", textAlign: "center" }}>
                  <img
                    src={URL.createObjectURL(customerFile)}
                    alt="Customer Sign"
                    style={{ width: "90%", height: "60px" }}
                  />
                  <IconButton
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "rgba(255, 255, 255, 0.7)",
                    }}
                    onClick={handleCustomerFileRemove}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "capitalize", height: "54px" }}
                >
                  Customer Sign
                  <input
                    type="file"
                    hidden
                    onChange={handleCustomerFileChange}
                  />
                </Button>
              )}
            </Grid>

            <Grid item xs={12} align="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="print-button newprint"
                fullWidth
                onClick={handlePrint}
              >
                Print
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default Voucher;
