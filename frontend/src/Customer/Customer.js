import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  SvgIcon,
  useTheme,
  useMediaQuery,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Popover,
  Grid,
  IconButton,
} from "@mui/material";
import Form from "react-bootstrap/Form";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, Delete } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { openDialog, closeDialog } from "../reducers/customerSlice";
import CustomerDialog from "./CustomerDialog";
import { fetchPaymentEntries } from "../actions/customerActions";
import AddLoan from "../Customer/addLoan";
import Swal from "sweetalert2";
const Customer = ({ entry }) => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [paymentEntries, setPaymentEntries] = useState([]);
  const [totals, setTotals] = useState({
    LGL: 0,
    MGL: 0,
    HGL: 0,
    Live: 0,
    Closed: 0,
  });
  const [loanTotals, setLoanTotals] = useState({ Live: 0, Closed: 0 });
  const [liveAccounts, setLiveAccounts] = useState(0);
  const [closedAccounts, setClosedAccounts] = useState(0);
  const [openAddLoanDialog, setOpenAddLoanDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { isDialogOpen, selectedEntry } = useSelector(
    (state) => state.customer
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewClick = async (entry) => {
    try {
      const fetchedEntries = await dispatch(
        fetchPaymentEntries(entry.loanNumber)
      );
      setPaymentEntries(fetchedEntries);
      dispatch(openDialog(entry));
    } catch (error) {
      console.error("Error fetching payment entries:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns 0-based value
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };
  const groupedEntries = ledgerEntries.reduce((acc, entry) => {
    if (!acc[entry.customerId]) {
      acc[entry.customerId] = [];
    }
    acc[entry.customerId].push(entry);
    return acc;
  }, {});
  const convertPaddedToNonPadded = (number) => number.replace(/^0+/, "");
  const [filteredTotals, setFilteredTotals] = useState({
    LGL: 0,
    MGL: 0,
    HGL: 0,
    Live: 0,
    Closed: 0,
  });

  const filteredEntries = Object.keys(groupedEntries).reduce(
    (acc, customerId) => {
      const customerEntries = groupedEntries[customerId];

      const isMatch = customerEntries.filter((entry) => {
        const matchesSearchTerm =
          entry.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.mobileNumber1
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          entry.lastDateForLoan
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          entry.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.schema.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.loanAmount.toString().includes(searchTerm.toLowerCase());

        const matchesStatus = entry.status
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        return matchesSearchTerm || matchesStatus;
      });

      if (isMatch.length > 0) {
        acc[customerId] = isMatch;
      }

      return acc;
    },
    {}
  );

  useEffect(() => {
    const totalFilteredEntries = Object.values(filteredEntries).flat();

    // Initialize counts for filtered totals
    let liveAccountsCount = 0;
    let closedAccountsCount = 0;
    let lglCount = 0;
    let mglCount = 0;
    let hglCount = 0;

    // Calculate live and closed accounts based on the filtered entries
    totalFilteredEntries.forEach((entry) => {
        // Increment counts based on status and schema
        if (entry.status.toLowerCase() === "closed") {
            closedAccountsCount++;
            if (entry.schema) {
                if (entry.schema.toUpperCase() === "LGL") lglCount++;
                if (entry.schema.toUpperCase() === "MGL") mglCount++;
                if (entry.schema.toUpperCase() === "HGL") hglCount++;
            }
        } else if (entry.status.toLowerCase() === "live") {
            liveAccountsCount++;
            if (entry.schema) {
                if (entry.schema.toUpperCase() === "LGL") lglCount++;
                if (entry.schema.toUpperCase() === "MGL") mglCount++;
                if (entry.schema.toUpperCase() === "HGL") hglCount++;
            }
        }
    });

    // Logic for modifying totals based on search term
    let totals = {
        LGL: lglCount,
        MGL: mglCount,
        HGL: hglCount,
        Live: liveAccountsCount,
        Closed: closedAccountsCount,
    };

    const lowerSearchTerm = searchTerm.toLowerCase();
    if (lowerSearchTerm === "lgl" || lowerSearchTerm === "mgl" || lowerSearchTerm === "hgl") {
        // If searching for a specific schema, set the counts for all to be the same
        const specificCount = totals[lowerSearchTerm.toUpperCase()] || 0;
        totals = {
            LGL: specificCount,
            MGL: specificCount,
            HGL: specificCount,
            Live: liveAccountsCount,
            Closed: closedAccountsCount,
        };
    } else if (lowerSearchTerm === "live") {
        // If searching for "live", set only the Live total
        totals = {
            LGL: lglCount,
            MGL: mglCount,
            HGL: hglCount,
            Live: liveAccountsCount,
            Closed: 0,  // Set Closed to 0 as only Live is searched
        };
    } else if (lowerSearchTerm === "closed") {
        // If searching for "closed", set only the Closed total
        totals = {
            LGL: lglCount,
            MGL: mglCount,
            HGL: hglCount,
            Live: 0,  // Set Live to 0 as only Closed is searched
            Closed: closedAccountsCount,
        };
    }

    // Only set totals if there is a change
    setTotals((prevTotals) => {
        if (
            prevTotals.LGL !== totals.LGL ||
            prevTotals.MGL !== totals.MGL ||
            prevTotals.HGL !== totals.HGL ||
            prevTotals.Live !== totals.Live ||
            prevTotals.Closed !== totals.Closed
        ) {
            return totals;
        }
        return prevTotals;
    });
}, [searchTerm, filteredEntries]);











const fetchLedgers = async () => {
  try {
    // Fetch ledger entries
    const ledgerResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/ledger/all`
    );
    const formattedLedgerEntries = ledgerResponse.data
      .reverse()
      .map((entry) => ({
        ...entry,
        date: formatDate(entry.date),
        lastDateForLoan: formatDate(entry.lastDateForLoan),
      }));

    // Fetch loan entries
    const loanResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/all`
    );
    const loanData = loanResponse.data;

    // Group loans by loanNo, sort by paymentDate, and get the latest entry for each loan
    const loansByNumber = loanData.reduce((acc, loan) => {
      if (!acc[loan.loanNo]) {
        acc[loan.loanNo] = [];
      }
      acc[loan.loanNo].push(loan);
      return acc;
    }, {});

    // Sort loan entries by date and get the latest entry
    const latestLoans = Object.keys(loansByNumber).reduce((acc, loanNo) => {
      const sortedEntries = loansByNumber[loanNo].sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      );
      acc[loanNo] = sortedEntries[0]; // Pick the latest payment entry
      return acc;
    }, {});

    const enrichedLedgerEntries = formattedLedgerEntries.map(
      (ledgerEntry) => {
        const matchingLoan = latestLoans[ledgerEntry.loanNumber];
        return {
          ...ledgerEntry,
          status:
            matchingLoan && matchingLoan.balance === 0 ? "Closed" : "Live",
        };
      }
    );

    // Set the enriched ledger entries to state
    setLedgerEntries(enrichedLedgerEntries);

    // Calculate totals and account counts
    const totalLedgerEntries = enrichedLedgerEntries.length;

    const ledgerTotals = enrichedLedgerEntries.reduce(
      (acc, entry) => {
        acc.LGL += entry.schema === "LGL" ? 1 : 0;
        acc.MGL += entry.schema === "MGL" ? 1 : 0;
        acc.HGL += entry.schema === "HGL" ? 1 : 0;
        return acc;
      },
      { LGL: 0, MGL: 0, HGL: 0 }
    );

    // Calculate closed and live accounts
    const closedAccountsCount = Object.values(latestLoans).filter(
      (entry) => entry.balance === 0
    ).length;

    const liveAccountsCount = totalLedgerEntries - closedAccountsCount;

    // Update totals state
    setTotals({
      LGL: ledgerTotals.LGL,
      MGL: ledgerTotals.MGL,
      HGL: ledgerTotals.HGL,
      Live: liveAccountsCount,
      Closed: closedAccountsCount,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

useEffect(() => {
  fetchLedgers();
  // Only run on mount, hence an empty dependency array
}, []);


  const handleAddLoanClick = (customerId) => {
    setSelectedCustomerId(customerId);
    setOpenAddLoanDialog(true);
  };

  const handleCloseAddLoanDialog = () => {
    setOpenAddLoanDialog(false);
    setSelectedCustomerId(null);
  };

  const calculateTotals = (entries) => {
    return entries.reduce(
      (acc, entry) => {
        acc.totalLoanAmount += Number(entry.loanAmount) || 0;
        acc.totalInterest += Number(entry.interest) || 0;
        return acc;
      },
      { totalLoanAmount: 0, totalInterest: 0 }
    );
  };
  const totals2 = calculateTotals(Object.values(filteredEntries).flat());

  const combinedTotal = totals2.totalLoanAmount + totals2.totalInterest;
  const TotalLoanAmount = totals2.totalLoanAmount; // Corrected to use totals
  const TotalInterestAmount = totals2.totalInterest
  // Assuming `filteredEntries` contains all ledger entries
  const allEntries = Object.values(filteredEntries).flat();
  
  // Calculate totals for MGL, LGL, and HGL
  const mglEntries = allEntries.filter(entry => entry.schema === 'MGL');
  const hglEntries = allEntries.filter(entry => entry.schema === 'HGL');
  const lglEntries = allEntries.filter(entry => entry.schema === 'LGL');
  
  const mglTotals = calculateTotals(mglEntries);
  const hglTotals = calculateTotals(hglEntries);
  const lglTotals = calculateTotals(lglEntries);
  
  // Now you can use the totals
  const MGLTotalAmount = mglTotals.totalLoanAmount;
  const MGLTotalInterest = mglTotals.totalInterest;
  const HGLTotalAmount = hglTotals.totalLoanAmount;
  const HGLTotalInterest = hglTotals.totalInterest;
  const LGLTotalAmount = lglTotals.totalLoanAmount;
  const LGLTotalInterest = lglTotals.totalInterest;
  
  // Combined totals for each schema
  const MGLCombinedTotal = MGLTotalAmount + MGLTotalInterest;
  const HGLCombinedTotal = HGLTotalAmount + HGLTotalInterest;
  const LGLCombinedTotal = LGLTotalAmount + LGLTotalInterest;
  
 
  

  const handleDelete = async (entry) => {
    const { loanNumber } = entry;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this ledger entry? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      input: "checkbox",
      inputValue: 0, // initial state for checkbox (unchecked)
      inputPlaceholder: "I understand the consequences of this action",
    });

    if (result.isConfirmed && result.value) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/ledger/${loanNumber}`
        );
        fetchLedgers();
        Swal.fire("Deleted!", "The ledger entry has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting ledger entry:", error);
        Swal.fire(
          "Error!",
          "There was an error deleting the ledger entry.",
          "error"
        );
      }
    } else if (result.isConfirmed && !result.value) {
      Swal.fire("Cancelled", "You need to confirm the action.", "info");
    }
  };
  const [showPopover, setShowPopover] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <Paper
      elevation={4}
      className="paperbg"
      sx={{
        padding: theme.spacing(3),
        margin: "auto",
        mt: 1,
        maxWidth: "100%",
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={7}>
          <Typography
            variant="h6"
            align="right"
            gutterBottom
            sx={{ color: "#D72122", fontWeight: "550", mt: -2, mb: 1 }}
          >
            CUSTOMER ENTRY DETAILS
          </Typography>
        </Grid>

        <Grid item xs={3} container justifyContent="flex-end">
          <Form className="d-flex search_box">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" className="search_button">
              Search
            </Button>
          </Form>
        </Grid>
      </Grid>

      <div
        style={{
          marginBottom: "16px",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="subtitle2">LGL: {totals.LGL}</Typography>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="subtitle2">MGL: {totals.MGL}</Typography>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="subtitle2">HGL: {totals.HGL}</Typography>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircleIcon
            color="success"
            style={{ fontSize: "16px", marginRight: "6px" }}
          />
          <Typography variant="subtitle2">
            Live: { totals.Live}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CancelIcon
            color="error"
            style={{ fontSize: "16px", marginRight: "6px" }}
          />
          <Typography variant="subtitle2">
            Closed: {totals.Closed}
          </Typography>
        </div>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          border: `1px solid #1784CC`,
          boxShadow: theme.shadows[2],
          maxHeight: "70vh",
          overflowX: "auto",
          mt: 2,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                "Sl.No",
                "Customer ID",
                "Customer Name",
                "Mobile Number",
                "Add Loan",
                "Loan Number",
                "Date",
                "Schema",
                "Loan Amount",
                "Interest Amount",
                "Last Date",
                "Status",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={{
                    border: "1px solid #ddd",

                    backgroundColor: "#1784CC",
                    color: theme.palette.common.white,
                    fontWeight: "bold",
                    fontSize: isMobile ? "0.75rem" : "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04rem",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(filteredEntries).map((customerId, idx) => {
              const customerEntries = filteredEntries[customerId];
              return customerEntries.map((entry, entryIdx) => (
                <TableRow key={entry._id}>
                  {entryIdx === 0 && (
                    <>
                      <TableCell
                        rowSpan={customerEntries.length}
                        align="center"
                        sx={{
                          border: "1px solid #ddd",
                          fontSize: "12px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {idx + 1}
                      </TableCell>
                      <TableCell
                        rowSpan={customerEntries.length}
                        align="center"
                        sx={{
                          border: "1px solid #ddd",
                          fontSize: "13px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {entry.customerId}
                      </TableCell>
                      <TableCell
                        rowSpan={customerEntries.length}
                        align="center"
                        sx={{
                          border: "1px solid #ddd",
                          fontSize: "13px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {entry.customerName}
                      </TableCell>
                      <TableCell
                        rowSpan={customerEntries.length}
                        align="center"
                        sx={{
                          border: "1px solid #ddd",
                          fontSize: "13px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {entry.mobileNumber1}
                      </TableCell>
                      <TableCell
                        rowSpan={customerEntries.length}
                        align="center"
                        sx={{
                          border: "1px solid #ddd",
                          fontSize: "13px",
                          backgroundColor: "#fff",
                          width: 116,
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          sx={{ textTransform: "capitalize" }}
                          onClick={() => handleAddLoanClick(customerId)}
                        >
                          AddLoan
                        </Button>
                      </TableCell>
                    </>
                  )}

                  {/* Loan Details */}
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      backgroundColor: "#F5F5F5",
                    }}
                  >
                    {entry.loanNumber}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      backgroundColor: "#F5F5F5",
                    }}
                    
                  >
                    {entry.date}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      backgroundColor: "#F5F5F5",
                    }}
                  >
                    {entry.schema}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      backgroundColor: "#F5F5F5",
                    }}
                  >
                    ₹ {entry.loanAmount}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      backgroundColor: "#F5F5F5",
                    }}
                  >
                    ₹ {entry.interest}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      backgroundColor: "#F5F5F5",
                      color:
                        entry.lastDateForLoan === searchTerm
                          ? "red"
                          : "inherit",
                      cursor:
                        entry.lastDateForLoan === searchTerm
                          ? "pointer"
                          : "default", 
                    }}
                    onMouseEnter={
                      entry.lastDateForLoan === searchTerm
                        ? handlePopoverOpen
                        : null
                    } 
                    onMouseLeave={handlePopoverClose} 
                  >
                    {entry.lastDateForLoan}
                  </TableCell>

                  <Popover
                    id="mouse-over-popover"
                    sx={{
                      pointerEvents: "none",
                    }}
                    open={isPopoverOpen}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                  >
                    <Typography sx={{ p: 1 }}>
                      
                      
                      <span style={{ color: "red" }}>
                         Loan Expiry Date
                      </span>
                    </Typography>
                  </Popover>

               
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      backgroundColor: "#F5F5F5",
                      width: 80,
                    }}
                  >
                    <div className="loanStatusContainer">
                      <span
                        className="loanStatuss"
                        style={{
                          backgroundColor:
                            entry.status === "Closed" ? "red" : "green",
                        }}
                      >
                        <div className="statusDot"></div>
                        {entry.status}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell
                    align="center"
                    sx={{
                      border: "1px solid #ddd",
                      fontSize: "13px",
                      backgroundColor: "#F5F5F5",
                      width: 320,
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="info"
                      sx={{ mr: 1, textTransform: "capitalize" }}
                      onClick={() => handleViewClick(entry)}
                    >
                      <SvgIcon
                        component={Visibility}
                        sx={{ fontSize: 14, mr: 0.2 }}
                      />
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      sx={{ textTransform: "capitalize" }}
                      onClick={() => handleDelete(entry)}
                    >
                      <SvgIcon
                        component={Delete}
                        sx={{ fontSize: 14, mr: 0.2 }}
                      />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
  display="flex"
  flexDirection="row"
  justifyContent="center"
  alignItems="center"
  margin="1px 0"
  sx={{
    mt: 2,
    mb: -1,
  }}
>
  {[
    { label: "Loan Amount", value: TotalLoanAmount },
    { label: "Interest Amount", value: TotalInterestAmount },
    { label: "Total Amount", value: combinedTotal.toLocaleString() },
    { label: "LGL  Amount", value: LGLCombinedTotal.toLocaleString() },
    { label: "MGL  Amount", value: MGLCombinedTotal.toLocaleString() },
    { label: "HGL Amount", value: HGLCombinedTotal.toLocaleString() },
  ].map(({ label, value }, index) => (
    <Box
      key={index}
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="typo_box"
      sx={{
        backgroundColor: "#1784CC",
        color: "white",
        borderRadius: "7px",
        fontWeight: 800,
        width: "290px",
        padding: "4px",
        boxShadow: 1,
        mr: index < 5 ? 7 : 0, 
      }}
    >
      <Typography className="typo_total" sx={{ fontWeight: "600" }}>
        {label}: {value}
      </Typography>
    </Box>
  ))}
</Box>




      <Dialog
        open={openAddLoanDialog}
        onClose={handleCloseAddLoanDialog}
        fullWidth
        maxWidth="xl"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "8px",
            position: "relative",
            overflow: "visible",
          },
        }}
      >
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleCloseAddLoanDialog}
          aria-label="close"
          sx={{
            position: "absolute",
            top: -17,
            right: -2,
            backgroundColor: "#D32521",
            color: "white",
            "&:hover": {
              backgroundColor: "#D32521",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <AddLoan
            customerId={selectedCustomerId}
            onClose={handleCloseAddLoanDialog}
          />
        </DialogContent>
      </Dialog>

      {isDialogOpen && (
        <CustomerDialog
          open={isDialogOpen}
          onClose={() => dispatch(closeDialog())}
          entry={selectedEntry}
          paymentEntries={paymentEntries}
          customerId={selectedEntry?.customerId}
          loanNumber={selectedEntry?.loanNumber}
        />
      )}
    </Paper>
  );
};

export default Customer;
