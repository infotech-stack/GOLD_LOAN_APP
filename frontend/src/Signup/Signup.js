import React, { useState } from "react";
import { Button, TextField, Paper, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
const formatJewelDetails = (jewelList) => {
  if (Array.isArray(jewelList)) {
    if (jewelList.length === 0) {
      console.log("Jewel list is an empty array.");
      return "No jewel details available";
    }

    return jewelList.map((jewel, index) => {
      // Log each jewel object for debugging
      console.log(`Processing jewel #${index}:`, jewel);

      return [
        `Quality: ${jewel.quality || 'N/A'}`,
        `Quantity: ${jewel.quantity || 'N/A'}`,
        `Item Weight: ${jewel.iw || 'N/A'}`,
        `Gross Weight: ${jewel.gw || 'N/A'}`,
        `Net Weight: ${jewel.nw || 'N/A'}`,
        `Jewel Details: ${jewel.jDetails || 'N/A'}`,
      ].join(", ");
    }).join(" | ");
  } else {
    console.error("Expected jewelList to be an array, but got:", jewelList);
    return "No jewel details available";
  }
};


function Signup() {
  const [customerId, setCustomerId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerIdError, setCustomerIdError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
  
    if (customerId.length < 1) {
      setCustomerIdError("Customer ID is required");
      valid = false;
    } else {
      setCustomerIdError("");
    }
  
    if (phoneNumber.length !== 10) {
      setPhoneNumberError("Phone number should be ten characters");
      valid = false;
    } else {
      setPhoneNumberError("");
    }
  
    if (valid) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/all`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const ledgers = await response.json();
  
        // Log all ledger details together
        console.log("All Ledger Details:", ledgers);
  
        // Group ledgers by customerId
        const groupedByCustomerId = ledgers.reduce((acc, ledger) => {
          if (!acc[ledger.customerId]) {
            acc[ledger.customerId] = [];
          }
          acc[ledger.customerId].push(ledger);
          return acc;
        }, {});
  
        // Log each customerId group separately
        for (const [customerId, ledgersForCustomer] of Object.entries(groupedByCustomerId)) {
          console.log(`Customer ID: ${customerId}`);
          console.log("Ledger Details:", ledgersForCustomer);
  
          ledgersForCustomer.forEach(ledger => {
            // Debugging statement to ensure jewelList is as expected
            console.log("Jewel List Data:", ledger.jewelList);
            console.log("Jewel List Details:", formatJewelDetails(ledger.jewelList));
          });
        }
        navigate("/cust_dashboard", { state: { customerId } });
      } catch (error) {
        console.error("Error fetching ledgers:", error.message);
      }
    }
  };
  

  return (
    <div className="signup-bgg">
      <Container maxWidth="xs">
        <Paper elevation={3} className="login-container">
          <Typography variant="h5" component="h2" className="login-header">
            Sign In
          </Typography>
          <form onSubmit={handleSubmit} noValidate className="login-form">
            <TextField
              label="Customer ID"
              type="text"
              fullWidth
              variant="outlined"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              error={!!customerIdError}
              helperText={customerIdError}
              required
              className="login-input"
            />
            <TextField
              label="Phone Number"
              type="number"
              fullWidth
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={!!phoneNumberError}
              helperText={phoneNumberError}
              required
              className="login-input"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="login-button"
            >
              Sign In
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Signup;
