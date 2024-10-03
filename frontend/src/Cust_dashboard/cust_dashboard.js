import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  fetchCustomerDetails,
  fetchPaymentEntries,
} from "../actions/customerActions";
import {
  makeSelectCustomerDetails,
  makeSelectPaymentEntries,
} from "../selectors/customerSelectors";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import logo from "../Navbar/KRT Gold Finance Logo PNG File.png";

function CustomerDashboard() {
  const [time, setTime] = useState(new Date());
  const location = useLocation();
  const dispatch = useDispatch();
  const customerId = location.state?.customerId;
  const selectCustomerDetails = makeSelectCustomerDetails();
  const customerDetails = useSelector(selectCustomerDetails);
  const paymentEntries = useSelector(makeSelectPaymentEntries());
  const [openProof, setOpenProof] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [selectedLoanNumber, setSelectedLoanNumber] = useState(null);
  // Define loanNumber, assuming it's part of customerDetails
  const loanNumber = customerDetails?.loanNumber; // Adjust according to your data structure

  const handleClickOpenProof = (customer) => {
    setCurrentCustomer(customer);
    setOpenProof(true);
  };

  const handleClickCloseProof = () => setOpenProof(false);

  const handleClickOpenPayment = (loanNumber) => {
    console.log("Clicked loanNumber:", loanNumber); // Logs the correct loan number when clicked
    setSelectedLoanNumber(loanNumber);
    setOpenPayment(true);
  };

  const handleClickClosePayment = () => {
    setOpenPayment(false);
    setSelectedLoanNumber(null); // Reset the selected loan number when the dialog is closed
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  // const loanNumber = customerDetails?.loanNumber;

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerDetails(customerId));
    }
  }, [dispatch, customerId]);
  useEffect(() => {
    if (selectedLoanNumber) {
      dispatch(fetchPaymentEntries(selectedLoanNumber));
    }
  }, [selectedLoanNumber, dispatch]);
  
  // Filter payment entries to match the selected loan number
  const filteredPaymentEntries = paymentEntries.filter(
    (entry) => entry.loanNo === selectedLoanNumber
  );

  useEffect(() => {
    if (Array.isArray(customerDetails) && customerDetails.length > 0) {
      const loanNumber = customerDetails[0]?.loanNumber;
      if (loanNumber) {
        setSelectedLoanNumber(loanNumber); // Set the selected loan number
        dispatch(fetchPaymentEntries(loanNumber));
        console.log("selectedloannumber:", selectedLoanNumber);
      }
    }
  }, [customerDetails, dispatch]);
 
  if (!Array.isArray(customerDetails) || customerDetails.length === 0) {
    return ;
  }

  const numberOfLoanEntries = customerDetails.length;
  const formattedDate = time.toLocaleDateString();
  const formattedDay = time.toLocaleDateString("en-US", { weekday: "long" });
  const formatJewelDetails = (jewelList) => {
    if (Array.isArray(jewelList) && jewelList.length > 0) {
      return jewelList.map((jewel, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <div><strong>Quality:</strong> {jewel.quality || 'N/A'}</div>
          <div><strong>Quantity:</strong> {jewel.quantity || 'N/A'}</div>
          <div><strong>Item Weight:</strong> {jewel.iw || 'N/A'}</div>
          <div><strong>Jewel Details:</strong> {jewel.jDetails || 'N/A'}</div>
          <hr />
        </div>
      ));
    } else {
      return <div>No jewel details available</div>;
    }
  };

  const itemWeight = customerDetails?.jewelList?.length > 0 ? customerDetails.jewelList[0].iw : 'N/A';
  
  
  return (
    <>
      <div
        className="paperbg8"
        style={{ overflowX: "hidden", overflowY: "hidden" }}
      >
        <Paper
          className="newpaperbgs"
          sx={{
            width: "100%",
            margin: "0 auto",
            padding: { xs: "10px", sm: "20px" },
            boxShadow: 3,
            borderRadius: "12px",
          }}
          elevation={3}
        >
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ textAlign: "center", mt: -3 }}
          >
            <Grid item>
              <img
                src={logo}
                alt="Logo"
                style={{ height: "160px", width: "240px" }}
              />
            </Grid>
            <Grid item>
              <Typography
                variant="h5"
                sx={{ mt: -2, mb: 2, color: "#D72122", fontWeight: "550" }}
              >
                Welcome to the KRT Gold Finance Dashboard
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={3}>
              <Paper
                elevation={2}
                sx={{
                  padding: { xs: "12px", sm: "16px" },
                  backgroundColor: "#F3CFC6",
                  textAlign: "center",
                  boxShadow: 2,
                  borderRadius: "12px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)", // Subtle zoom effect on hover
                    boxShadow: 6,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    marginBottom: "10px",
                    color: "rgb(7, 101, 70)",
                    fontWeight: 550,
                  }}
                >
                  Time
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  {time.toLocaleTimeString()}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper
                elevation={2}
                sx={{
                  padding: { xs: "12px", sm: "16px" },
                  backgroundColor: "#F3CFC6",
                  textAlign: "center",
                  boxShadow: 2,
                  borderRadius: "12px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)", // Subtle zoom effect on hover
                    boxShadow: 6,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    marginBottom: "10px",
                    color: "brown",
                    fontWeight: 550,
                  }}
                >
                  Day
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  {formattedDay}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper
                elevation={3}
                sx={{
                  padding: { xs: "12px", sm: "16px" },
                  backgroundColor: "#F3CFC6",
                  textAlign: "center",
                  boxShadow: 3,
                  borderRadius: "12px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)", // Subtle zoom effect on hover
                    boxShadow: 6,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    marginBottom: "10px",
                    color: "blue",
                    fontWeight: 550,
                  }}
                >
                  Date
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  {formattedDate}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <Paper
                elevation={3}
                sx={{
                  padding: { xs: "12px", sm: "16px" },
                  backgroundColor: "#F3CFC6",
                  textAlign: "center",
                  boxShadow: 3,
                  borderRadius: "12px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.02)", // Subtle zoom effect on hover
                    boxShadow: 6,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    marginBottom: "10px",
                    color: "red",
                    fontWeight: 550,
                  }}
                >
                  Number of Loans
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  {numberOfLoanEntries}
                </Typography>
              </Paper>
            </Grid>

            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ minHeight: "100vh", padding: 2, mt: 2 }}
            >
              <Grid
                container
                spacing={4}
                sx={{ maxWidth: "1200px", width: "100%" }}
              >
                {customerDetails.map((customer, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      sx={{
                        padding: { xs: "16px", sm: "24px" },
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        borderRadius: "12px",
                        boxShadow: 3,
                        backgroundColor: "#ffffff",
                        overflow: "hidden",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 6,
                        },
                      }}
                      elevation={3}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "#1976d2",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Loan Detail - {index + 1}
                      </Typography>
                      <Grid
                        sx={{
                          alignItems: "center", // Center horizontally
                          justifyContent: "center",
                        }}
                      >
                       <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center", // Center horizontally
    justifyContent: "center",
  }}
>
  {[
    {
      label: "Customer Id",
      value: customer.customerId,
    },
    {
      label: "Customer Name",
      value: customer.customerName,
    },
    {
      label: "Loan Number",
      value: customer.loanNumber,
    },
    {
      label: "Last Date",
      value: (
        <span style={{ color: "red", fontWeight: "550" }}>
          {new Date(customer.lastDateForLoan).toLocaleDateString() || "N/A"}
        </span>
      ),
    },
    { label: "Address", value: customer.address },
    { label: "Landmark", value: customer.landmark },
    {
      label: "Date",
      value: new Date(customer.date).toLocaleDateString() || "N/A",
    },
    {
      label: "Mobile Number 1",
      value: customer.mobileNumber1,
    },
    {
      label: "Mobile Number 2",
      value: customer.mobileNumber2,
    },
    { label: "Schema", value: customer.schema },
    {
      label: "Loan Amount",
      value: customer.loanAmount,
    },
    { label: "Interest", value: customer.interest },
    { label: "Percent", value: customer.percent },
    { label: "Gross Weight", value: customer.gw },
    { label: "Net Weight", value: customer.nw },
   
  ].map(({ label, value }, idx) => (
    <Box
      key={idx}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        mb: 1, // Margin-bottom for spacing between rows
      }}
    >
      <Box sx={{ flexShrink: 0, minWidth: "130px" }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          :
        </Typography>
        <Typography variant="body1">{value || "N/A"}</Typography>
      </Box>
    </Box>
  ))}

  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    {customer.jewelList.map((jewel, idx) => (
      <Box
        key={idx}
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          mb: 2,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
         
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            
            flexWrap: "wrap",
          }}
        >
            <Typography variant="body1" sx={{ fontWeight: "bold", flexBasis: "45%" ,padding:1}}>
         Quality:   <span style={{fontWeight:'500'}}>  {jewel.quality || "N/A"}</span>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", flexBasis: "45%" ,padding:1}}>
            Quantity: <span style={{fontWeight:'500'}}>{jewel.quantity || "N/A"}</span>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", flexBasis: "45%" ,padding:1}}>
            Item Weight: <span style={{fontWeight:'500'}}>{jewel.iw || "N/A"}</span>
          </Typography>
         
          <Typography variant="body1" sx={{ fontWeight: "bold", flexBasis: "45%" ,padding:1}}>
            Jewel Details: <span style={{fontWeight:'500'}}>{jewel.jDetails || "N/A"}</span>
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
</Box>


                      </Grid>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "16px",
                        }}
                      >
                       
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleClickOpenPayment(customer.loanNumber)}
                        >
                          Payment
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

             

              {/* Payment Dialog */}
              <Dialog open={openPayment} onClose={handleClickClosePayment}  maxWidth="lg">
                <DialogTitle>Payment Details</DialogTitle>
                <DialogContent>
                <TableContainer component={Paper}>
          <Table>
            <TableHead>
            <TableRow>
                      <TableCell sx={{ border: "1px solid black" }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        Loan No
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        Customer ID
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        No of Days
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        Interest Principle
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        Interest Amount
                      </TableCell>

                      <TableCell sx={{ border: "1px solid black" }}>
                        Balance
                      </TableCell>
                    </TableRow>
            </TableHead>
            <TableBody>
  {filteredPaymentEntries.length > 0 ? (
    filteredPaymentEntries.map((entry) => (
      <TableRow key={entry._id}>
        <TableCell sx={{ border: "1px solid black" }}>
          {entry.paymentDate}
        </TableCell>
        <TableCell sx={{ border: "1px solid black" }}>
          {entry.loanNo}
        </TableCell>
        <TableCell sx={{ border: "1px solid black" }}>
          {entry.customerId}
        </TableCell>
        <TableCell sx={{ border: "1px solid black" }}>
          {entry.noOfDays}
        </TableCell>
        <TableCell sx={{ border: "1px solid black" }}>
          {entry.interestamount}
        </TableCell>
        <TableCell sx={{ border: "1px solid black" }}>
          {entry.interestPrinciple}
        </TableCell>
        <TableCell sx={{ border: "1px solid black" }}>
          {entry.balance}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} sx={{ textAlign: "center",border: "1px solid black"  }}>
        No entries available
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </TableContainer>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenPayment(false)}>Close</Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
}

export default CustomerDashboard;
