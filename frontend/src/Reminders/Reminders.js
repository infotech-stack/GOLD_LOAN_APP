import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Paper,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BalanceContext } from "./BalanceContext";
import { AccountBalance, Work } from "@mui/icons-material";
import InputIcon from "@mui/icons-material/Input";
import PaymentsIcon from "@mui/icons-material/Payments";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
const Reminders = () => {
  const [dayToDayExpenses, setDayToDayExpenses] = useState([]);
  const [paidvoucher, setPaidvoucher] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [apraisalentries, setApraisalentries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { updateBalances } = useContext(BalanceContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          vouchersRes,
          paidvouchersRes,
          expensesRes,
          salariesRes,
          ledgerRes,
          appraisalRes,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/vouchers/all`),
          axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/paidvouchers/all`
          ),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/expenses`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/salary`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/all`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/all`),
        ]);

        const formatData = (data) =>
          data.map((item) => ({
            ...item,
            date: formatDate(item.date),
            paymentDate: formatDate(item.paymentDate),
            quantity: item.quantity || "-",
            weight: item.weight || "-",
            voucherNo: item.voucherNo || "-",
            doccharge: item.doccharge || "0",
          }));

        setVouchers(formatData(vouchersRes.data));
        setPaidvoucher(formatData(paidvouchersRes.data));
        setDayToDayExpenses(formatData(expensesRes.data));
        setSalaries(formatData(salariesRes.data));
        setLedgerEntries(formatData(ledgerRes.data));
        setApraisalentries(formatData(appraisalRes.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const filterDataByDateRange = (data) => {
    if (!startDate || !endDate) return data;
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return data.filter((item) => {
      const dateField = new Date(item.date || item.paymentDate);
      return dateField >= start && dateField <= end;
    });
  };

  const aggregateDataByDate = (data, amountFields) => {
    return data.reduce((acc, item) => {
      const date = item.date || item.paymentDate;
      if (!acc[date]) {
        acc[date] = {
          totalAmount: 0,
          date: date,
        };
      }

      amountFields.forEach((field) => {
        acc[date].totalAmount += parseFloat(item[field] || 0);
      });

      return acc;
    }, {});
  };

  const aggregatedExpenses = aggregateDataByDate(dayToDayExpenses, [
    "totalRupees",
  ]);
  const aggregatedSalaries = aggregateDataByDate(salaries, ["salaryAmount"]);
  const aggregatedVouchers = aggregateDataByDate(vouchers, ["amount"]);
  const aggregatedLedger = aggregateDataByDate(ledgerEntries, ["loanAmount"]);
  const aggregatedPaidVouchers = aggregateDataByDate(paidvoucher, ["amount"]);
  const aggregatedAppraisals = aggregateDataByDate(apraisalentries, [
    "interestamount",
    "interestPrinciple",
  ]);
  const aggregatedDocCharges = aggregateDataByDate(ledgerEntries, [
    "doccharge",
  ]);

  const allDates = [
    ...new Set([
      ...Object.keys(aggregatedExpenses),
      ...Object.keys(aggregatedSalaries),
      ...Object.keys(aggregatedVouchers),
      ...Object.keys(aggregatedLedger),
      ...Object.keys(aggregatedAppraisals),
      ...Object.keys(aggregatedPaidVouchers),
    ]),
  ].sort();

  const filterAndAggregateData = () => {
    const filteredDates = allDates.filter((date) => {
      const dateField = new Date(date);
      return (
        !startDate ||
        !endDate ||
        (dateField >= new Date(startDate).setHours(0, 0, 0, 0) &&
          dateField <= new Date(endDate).setHours(23, 59, 59, 999))
      );
    });

    let prevClosingBalance = 0; // Start with zero or initial balance
    let openingBalanceInitialized = false;

    return filteredDates.map((date) => {
      if (!openingBalanceInitialized) {
        const balanceBeforeStartDate =
          calculateBalanceBeforeStartDate(startDate);
        prevClosingBalance = balanceBeforeStartDate;
        openingBalanceInitialized = true;
      }

      const openingBalance = prevClosingBalance;
      const closingBalance = calculateClosingBalance(openingBalance, date);
      prevClosingBalance = closingBalance;

      return {
        date,
        openingBalance: formatNumber(openingBalance),
        dayToDayExpenses: aggregatedExpenses[date] || {
          date: date,
          totalAmount: 0,
        },
        salaries: aggregatedSalaries[date] || { date: date, totalAmount: 0 },
        vouchers: aggregatedVouchers[date] || { date: date, totalAmount: 0 },
        paidvoucher:aggregatedPaidVouchers[date] ||{ date: date, totalAmount: 0 },
        doccharge: aggregatedDocCharges[date] || { date: date, totalAmount: 0 },
        ledger: aggregatedLedger[date] || { date: date, totalAmount: 0 },
        appraisals: aggregatedAppraisals[date] || {
          date: date,
          totalAmount: 0,
        },
        closingBalance: formatNumber(closingBalance),
      };
    });
  };

  const calculateBalanceBeforeStartDate = (startDate) => {
    if (!startDate) return 0;

    const filteredDatesBeforeStart = allDates.filter((date) => {
      const dateField = new Date(date);
      return dateField < new Date(startDate).setHours(0, 0, 0, 0);
    });

    let balance = 0;
    filteredDatesBeforeStart.forEach((date) => {
      balance = calculateClosingBalance(balance, date);
    });

    return balance;
  };

  const calculateClosingBalance = (prevClosingBalance, date) => {
    const openingBalance = prevClosingBalance;
    const dayToDayTotal = aggregatedExpenses[date]?.totalAmount || 0;
    const salaryTotal = aggregatedSalaries[date]?.totalAmount || 0;
    const voucherTotal = aggregatedVouchers[date]?.totalAmount || 0;
    const ledgerTotal = aggregatedLedger[date]?.totalAmount || 0;
    const appraisalTotal = aggregatedAppraisals[date]?.totalAmount || 0;
    const docChargeTotal = aggregatedDocCharges[date]?.totalAmount || 0;
    const paidVoucherTotal=aggregatedPaidVouchers[date]?.totalAmount ||0;

    return (
      openingBalance +
      voucherTotal +
      docChargeTotal +
      appraisalTotal -
      dayToDayTotal -
      paidVoucherTotal-
      salaryTotal -
      ledgerTotal
    );
  };

  const formatNumber = (number) => {
    const roundedNumber = Math.round(number); // Round to the nearest integer
    return roundedNumber === 0 ? "" : roundedNumber; // Display empty string if zero
  };
  const filteredRows = filterAndAggregateData();

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    const todayRow = filteredRows.find((row) => row.date === todayDate);

    if (todayRow) {
      updateBalances(filteredRows); // Update balances in context
    } else {
      console.log("No entry for today's date.");
    }
  }, [filteredRows, updateBalances]);
  const handleDownloadPDF = async () => {
    const input = document.querySelector(".paperbg");
    const actionsColumn = document.querySelectorAll(".actions-column");

    // Hide the actions column
    actionsColumn.forEach((cell) => {
      cell.style.display = "none";
    });

    if (input) {
      const canvas = await html2canvas(input, {
        useCORS: true,
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.width;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page with the image
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.height;

      // Add new pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.height;
      }

      // Save the PDF
      pdf.save("customer-entry-details.pdf");
    }

    // Show the actions column again
    actionsColumn.forEach((cell) => {
      cell.style.display = "";
    });
  };

  const dayToDayExpensesTotal = filteredRows.reduce(
    (acc, row) => acc + row.dayToDayExpenses.totalAmount,
    0
  );
  const salaryTotal = filteredRows.reduce(
    (acc, row) => acc + row.salaries.totalAmount,
    0
  );
  const ledgerTotal = filteredRows.reduce((acc, row) => {
    const totalAmount = row.ledger.totalAmount || 0;
    return acc + totalAmount;
  }, 0);

  const docChargeTotal = filterDataByDateRange(ledgerEntries).reduce(
    (acc, entry) => {
      const doccharge = parseFloat(entry.doccharge) || 0; // Convert to number
      return acc + doccharge;
    },
    0
  );
  const interestTotal = filterDataByDateRange(apraisalentries).reduce(
    (acc, entry) => {
      const interestPrinciple = parseFloat(entry.interestPrinciple) || 0; // Convert to number
      return acc + interestPrinciple;
    },
    0
  );

  const appraisalTotal = filteredRows.reduce(
    (acc, row) => acc + row.appraisals.totalAmount,
    0
  );
  const mdTotal = filteredRows.reduce(
    (acc, row) => acc + row.vouchers.totalAmount,
    0
  );
  const mdpaidTotal = filteredRows.reduce(
    (acc, row) => acc + row.paidvoucher.totalAmount,
    0
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this expense!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/expenses/delete/${id}`
        );

        Swal.fire("Deleted!", "Expense deleted successfully.", "success");
      } catch (error) {
        console.error("Error deleting expense:", error);
        Swal.fire("Failed!", "Failed to delete expense.", "error");
      }
    }
  };

  const handleDelete2 = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this salary payment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/salary/delete/${id}`
        );

        Swal.fire(
          "Deleted!",
          "Salary payment deleted successfully.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting salary payment:", error);
        Swal.fire("Failed!", "Failed to delete salary payment.", "error");
      }
    }
  };

  const handleDelete3 = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Md voucher!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/vouchers/delete/${id}`
        );

        Swal.fire("Deleted!", "Vouchers deleted successfully.", "success");
      } catch (error) {
        console.error("Error deleting Vouchers:", error);
        Swal.fire("Failed!", "Failed to delete Vouchers.", "error");
      }
    }
  };
  const handleDelete4 = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Paid voucher!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/paidvouchers/delete/${id}`
        );

        Swal.fire("Deleted!", "Paid Vouchers deleted successfully.", "success");
      } catch (error) {
        console.error("Error deleting Vouchers:", error);
        Swal.fire("Failed!", "Failed to delete Vouchers.", "error");
      }
    }
  };

  const [editOpen, setEditOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  const handleEditOpen = (expense) => {
    setCurrentExpense(expense);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setCurrentExpense(null);
  };

  const handleEditSubmit = async (form) => {
    // Prevent default if needed
    console.log("clicked");

    const updatedExpense = {
      productName: form.productName.value,
      date: form.date.value,
      totalRupees: form.totalRupees.value,
      quantity: form.quantity.value,
      weight: form.weight.value,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/expenses/edit/${currentExpense._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedExpense),
        }
      );

      if (response.ok) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Expense Updated",
          text: "The expense has been updated successfully!",
        });

        handleEditClose();
      } else {
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update the expense. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the expense. Please try again.",
      });
    }
  };
  const [salaryEditOpen, setSalaryEditOpen] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(null);

  const handleSalaryEditOpen = (salary) => {
    setCurrentSalary(salary);
    setSalaryEditOpen(true);
  };

  const handleSalaryEditClose = () => {
    setSalaryEditOpen(false);
    setCurrentSalary(null);
  };
  const handleSalaryEditSubmit = async (form) => {
    console.log("clicked");

    const updatedSalary = {
      employeeName: form.employeeName.value,
      designation: form.designation.value,
      date: form.date.value,
      salaryAmount: form.salaryAmount.value,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/salary/edit/${currentSalary._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSalary),
        }
      );

      if (response.ok) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Salary Updated",
          text: "The salary has been updated successfully!",
        });

        handleSalaryEditClose();
      } else {
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update the salary. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating salary:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the salary. Please try again.",
      });
    }
  };
  const [voucherEditOpen, setVoucherEditOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  const handleVoucherEditOpen = (voucher) => {
    setCurrentVoucher(voucher);
    setVoucherEditOpen(true);
  };

  const handleVoucherEditClose = () => {
    setVoucherEditOpen(false);
    setCurrentVoucher(null);
  };
  const handleVoucherEditSubmit = async (form) => {
    const updatedVoucher = {
      name: form.name.value,
      amount: form.amount.value,
      date: form.date.value,
      purposeOfAmount: form.purposeOfAmount.value,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/vouchers/edit/${currentVoucher._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedVoucher),
        }
      );

      if (response.ok) {
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Voucher Updated",
          text: "The voucher has been updated successfully!",
        });

        handleVoucherEditClose();
      } else {
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update the voucher. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating voucher:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the voucher. Please try again.",
      });
    }
  };
  const [paidVoucherEditOpen, setPaidVoucherEditOpen] = useState(false);
  const [currentPaidVoucher, setCurrentPaidVoucher] = useState(null);

  // Open the dialog and set the current voucher to edit
  const handlePaidVoucherEditOpen = (paidVoucher) => {
    setCurrentPaidVoucher(paidVoucher);
    setPaidVoucherEditOpen(true);
  };

  // Close the dialog
  const handlePaidVoucherEditClose = () => {
    setPaidVoucherEditOpen(false);
    setCurrentPaidVoucher(null);
  };

  // Handle the edit voucher submission
  const handlePaidVoucherEditSubmit = async () => {
    const form = document.getElementById("edit-paid-voucher-form");
    const formData = new FormData(form);

    const updatedVoucher = {
      name: formData.get("name"),
      amount: formData.get("amount"),
      date: formData.get("date"),
      purposeOfAmount: formData.get("purposeOfAmount"),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/paidvouchers/edit/${currentPaidVoucher._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedVoucher),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: " Paid Voucher Updated",
          text: "The  paid voucher has been updated successfully!",
        });
        handlePaidVoucherEditClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update the voucher. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating voucher:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the paid voucher. Please try again.",
      });
    }
  };
 
  const handleDelete6 = async (id) => {
    // First confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Md voucher!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (result.isConfirmed) {
      // Second dialog with a checkbox for double confirmation
      const secondResult = await Swal.fire({
        title: "Final Confirmation",
        html: `
          <p>Please confirm the deletion by checking the box below:</p>
          <input type="checkbox" id="double-confirmation-checkbox" />
          <label for="double-confirmation-checkbox">I confirm the deletion</label>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete Voucher",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const checkbox = document.getElementById('double-confirmation-checkbox');
          if (!checkbox.checked) {
            Swal.showValidationMessage("You need to confirm the deletion by checking the box.");
          }
          return checkbox.checked;
        },
      });
  
      if (secondResult.isConfirmed) {
        try {
          await axios.delete(
            `${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/delete/${id}`
          );
  
          Swal.fire("Deleted!", "Vouchers deleted successfully.", "success");
        } catch (error) {
          console.error("Error deleting Vouchers:", error);
          Swal.fire("Failed!", "Failed to delete Vouchers.", "error");
        }
      }
    }
  };
  
  return (
    <Paper
      elevation={2}
      style={{ padding: "20px" }}
      sx={{ maxWidth: 1300, margin: "auto", mt: 1 }}
      className="paperbg"
    >
      <Typography
        variant="h6"
        align="center"
        sx={{ color: "#D72122", fontWeight: "550", mb: 2 }}
      >
        DAY BOOK
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4, ml: 2 }}>
        <Grid item xs={12} sm={5}>
          <Typography variant="body1">Start Date:</Typography>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Typography variant="body1">End Date:</Typography>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            isClearable
          />
        </Grid>
        <Grid item xs={12} sm={2} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleDownloadPDF}
            className="handleprints down"
          >
            Download
          </Button>
        </Grid>
      </Grid>

      {startDate && endDate ? (
        <Grid container spacing={3} sx={{ ml: 2 }}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              className="daybook_font"
              sx={{ ml: 1, color: "#D34141" }}
            >
              <CurrencyRupeeIcon sx={{ mr: 1 }} />
              <span style={{ fontWeight: "550" }}>
                Day to Day Expenses:
              </span>{" "}
              {dayToDayExpensesTotal}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              className="daybook_font"
              sx={{ color: "green" }}
            >
              <InputIcon sx={{ mr: 1 }} />
              <span style={{ fontWeight: "550" }}>
                Received Amount MD:
              </span>{" "}
              {mdTotal}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              className="daybook_font"
              sx={{ color: "green" }}
            >
              <InputIcon sx={{ mr: 1 }} />
              <span style={{ fontWeight: "550" }}>Document Charge:</span>{" "}
              {docChargeTotal}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              className="daybook_font"
              sx={{ color: "#D34141" }}
            >
              <AccountBalance sx={{ mr: 1 }} />
              <span style={{ fontWeight: "550" }}>
                Ledger Loan Amount:
              </span>{" "}
              {ledgerTotal}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: -1, color: "green" }}>
            <Typography variant="h6" sx={{ mb: 3 }} className="daybook_font">
              <PaymentsIcon sx={{ mr: 1 }} />
              <span style={{ fontWeight: "550" }}>Appraisal Payment:</span>{" "}
              {appraisalTotal}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: -1, color: "#D34141" }}>
            <Typography variant="h6" className="daybook_font">
              <Work sx={{ mr: 1 }} />
              <span style={{ fontWeight: "550" }}>Salary Amount:</span>{" "}
              {salaryTotal}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: -2, color: "#D34141" }}>
            <Typography variant="h6" className="daybook_font">
              <Work sx={{ mr: 1 }} />
              <span style={{ fontWeight: "550" }}>Paid Amount to MD:</span>{" "}
              {mdpaidTotal}
            </Typography>
          </Grid>
        </Grid>
      ) : null}

      <TableContainer
        component={Paper}
        sx={{ width: 1200, ml: 3 }}
        align="center"
      >
        <Table align="center">
          <TableHead sx={{ backgroundColor: "#1784CC" }}>
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "600",
                }}
                rowSpan={3}
              >
                Opening Balance
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "600",
                }}
                colSpan={2}
              >
                Day To Day Expenses
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "600",
                }}
                colSpan={2}
              >
                Salary Amount
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "600",
                }}
                colSpan={2}
              >
                Received Amount from Md
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "600",
                }}
                colSpan={2}
              >
                Document Charge
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "600",
                }}
                colSpan={2}
              >
                Paid Amount to MD
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "600",
                }}
                colSpan={2}
              >
                Ledger Loan Amount
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "600",
                }}
                colSpan={2}
              >
                Appraisal Payment
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "600",
                }}
                rowSpan={3}
              >
                Closing Balance
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Total
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Total
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Total
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Total
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Total
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Total
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid black",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.openingBalance}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.dayToDayExpenses.date}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.dayToDayExpenses.totalAmount}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.salaries.date}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.salaries.totalAmount}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.vouchers.date}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.vouchers.totalAmount}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.doccharge.date}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.doccharge.totalAmount}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.paidvoucher.date}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.paidvoucher.totalAmount}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.ledger.date}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.ledger.totalAmount}
                </TableCell>

                <TableCell sx={{ border: "1px solid black" }}>
                  {row.appraisals.date}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.appraisals.totalAmount}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {row.closingBalance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ color: "#D72122", fontWeight: "550" }}>
            Day-to-Day Expenses
          </Typography>
          <Typography
            variant="h6"
            className="daybook_font"
            sx={{ ml: 80, color: "#D34141", mb: 1 }}
          >
            <CurrencyRupeeIcon sx={{ mr: 1 }} />
            <span style={{ fontWeight: "550" }}>Total:</span>{" "}
            {dayToDayExpensesTotal}
          </Typography>
          <TableContainer component={Paper} sx={{ width: 900 }} align="center">
            <Table align="center">
              <TableHead sx={{ backgroundColor: "#1784CC" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Expense Details
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Total Rupees
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Weight
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Voucher No
                  </TableCell>
                  <TableCell
                    className="actions-column"
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(dayToDayExpenses).map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {expense.productName}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {expense.date}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {expense.totalRupees}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {expense.quantity}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {expense.weight}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {expense.voucherNo}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="actions-column"
                    >
                      <Button
                        onClick={() => handleEditOpen(expense)}
                        color="secondary"
                        variant="contained"
                        className="expenseedit"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(expense._id)}
                        color="error"
                        variant="contained"
                        className="expensedelete"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={editOpen} onClose={handleEditClose}>
            <DialogTitle
              sx={{ textAlign: "center", color: "#194300", fontWeight: "600" }}
            >
              Edit Expense
            </DialogTitle>
            <DialogContent>
              {currentExpense && (
                <form id="edit-expense-form">
                  {" "}
                  {/* Form without onSubmit */}
                  <TextField
                    label="Product Name"
                    name="productName"
                    defaultValue={currentExpense.productName}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={currentExpense.date.split("T")[0]}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Total Rupees"
                    name="totalRupees"
                    defaultValue={currentExpense.totalRupees}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Quantity"
                    name="quantity"
                    defaultValue={currentExpense.quantity}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Weight"
                    name="weight"
                    defaultValue={currentExpense.weight}
                    fullWidth
                    margin="normal"
                  />
                </form>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
            <Button
                onClick={() =>
                  handleEditSubmit(document.getElementById("edit-expense-form"))
                }
                color="success"
                variant="contained"
              >
                Save
              </Button>
              <Button
                onClick={handleEditClose}
                color="error"
                variant="contained"
              >
                Cancel
              </Button>
           
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
       
          <Typography variant="h6" sx={{ color: "green", fontWeight: "550" }}>
         Document Charge
          </Typography>
          <Typography
            variant="h6"
            className="daybook_font"
            sx={{ color: "green", ml: 80, mb: 1 }}
          >
            <InputIcon sx={{ mr: 0 }} />
            <span style={{ fontWeight: "550" }}>Total:</span> {docChargeTotal}
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1784CC" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Customer ID
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Customer Name
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Document Charge
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(ledgerEntries).map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.customerId}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.date}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.customerName}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.doccharge}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.loanAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ color: "#D72122", fontWeight: "550" }}>
            Salary Payments
          </Typography>
          <Typography
            variant="h6"
            className="daybook_font"
            sx={{ color: "#D34141", ml: 80, mb: 1 }}
          >
            <Work sx={{ mr: 1 }} />
            <span style={{ fontWeight: "550" }}>Total:</span> {salaryTotal}
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1784CC" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Employee Name
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Designation
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Salary Amount
                  </TableCell>
                  <TableCell
                    className="actions-column"
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(salaries).map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {payment.employeeName}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {payment.designation}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {payment.date}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {payment.salaryAmount}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="actions-column"
                    >
                      <Button
                        onClick={() => handleSalaryEditOpen(payment)}
                        color="secondary"
                        variant="contained"
                        className="expenseedit"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete2(payment._id)}
                        color="error"
                        className="expensedelete"
                        variant="contained"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={salaryEditOpen} onClose={handleSalaryEditClose}>
            <DialogTitle
              sx={{ textAlign: "center", color: "#194300", fontWeight: "600" }}
            >
              Edit Salary Payment
            </DialogTitle>
            <DialogContent>
              {currentSalary && (
                <form id="edit-salary-form">
                  <TextField
                    label="Employee Name"
                    name="employeeName"
                    defaultValue={currentSalary.employeeName}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Designation"
                    name="designation"
                    defaultValue={currentSalary.designation}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={currentSalary.date.split("T")[0]}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Salary Amount"
                    name="salaryAmount"
                    defaultValue={currentSalary.salaryAmount}
                    fullWidth
                    margin="normal"
                  />
                </form>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
            <Button
                onClick={() =>
                  handleSalaryEditSubmit(
                    document.getElementById("edit-salary-form")
                  )
                }
                color="success"
                variant="contained"
              >
                Save
              </Button>
              <Button
                onClick={handleSalaryEditClose}
                color="error"
                variant="contained"
              >
                Cancel
              </Button>
             
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ color: "green", fontWeight: "550" }}>
            MD Voucher
          </Typography>
          <Typography
            variant="h6"
            className="daybook_font"
            sx={{ color: "green", ml: 80, mb: 1 }}
          >
            <InputIcon sx={{ mr: 0 }} />
            <span style={{ fontWeight: "550" }}>Total:</span> {mdTotal}
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1784CC" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Purpose
                  </TableCell>
                  <TableCell
                    className="actions-column"
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(vouchers).map((voucher) => (
                  <TableRow key={voucher._id}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {voucher.name}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {voucher.amount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {voucher.date}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {voucher.purposeOfAmount}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="actions-column"
                    >
                      <Button
                        onClick={() => handleVoucherEditOpen(voucher)}
                        color="secondary"
                        variant="contained"
                        className="expenseedit"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete3(voucher._id)}
                        color="error"
                        variant="contained"
                        className="expensedelete"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={voucherEditOpen} onClose={handleVoucherEditClose}>
            <DialogTitle
              sx={{ textAlign: "center", color: "#194300", fontWeight: "600" }}
            >
              Edit Voucher
            </DialogTitle>
            <DialogContent>
              {currentVoucher && (
                <form id="edit-voucher-form">
                  <TextField
                    label="Name"
                    name="name"
                    defaultValue={currentVoucher.name}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Amount"
                    name="amount"
                    defaultValue={currentVoucher.amount}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={currentVoucher.date.split("T")[0]}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Purpose"
                    name="purposeOfAmount"
                    defaultValue={currentVoucher.purposeOfAmount}
                    fullWidth
                    margin="normal"
                  />
                </form>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
            <Button
                onClick={() =>
                  handleVoucherEditSubmit(
                    document.getElementById("edit-voucher-form")
                  )
                }
                color="success"
                variant="contained"
              >
                Save
              </Button>
              <Button
                onClick={handleVoucherEditClose}
                color="error"
                variant="contained"
              >
                Cancel
              </Button>
             
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ color: "#D72122", fontWeight: "550" }}>
            Ledger Entries
          </Typography>
          <Typography
            variant="h6"
            className="daybook_font"
            sx={{ color: "#D34141", ml: 80, mb: 1 }}
          >
            <AccountBalance sx={{ mr: 1 }} />
            <span style={{ fontWeight: "550" }}>Total:</span> {ledgerTotal}
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1784CC" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Customer ID
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Customer Name
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Document Charge
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(ledgerEntries).map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.customerId}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.date}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.customerName}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.doccharge}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {entry.loanAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
        <Typography variant="h6" sx={{ color: "#D72122", fontWeight: "550" }}>
           Paid Voucher to MD
          </Typography>
          <Typography
            variant="h6"
            className="daybook_font"
            sx={{ color: "#D34141", ml: 80, mb: 1 }}
          >
            <AccountBalance sx={{ mr: 1 }} />
            <span style={{ fontWeight: "550" }}>Total:</span> {mdpaidTotal}
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1784CC" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Purpose
                  </TableCell>
                  <TableCell
                    className="actions-column"
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(paidvoucher).map((paidvoucher) => (
                  <TableRow key={paidvoucher._id}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {paidvoucher.name}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {paidvoucher.amount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {paidvoucher.date}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {paidvoucher.purposeOfAmount}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="actions-column"
                    >
                      <Button
                        onClick={() => handlePaidVoucherEditOpen(paidvoucher)}
                        color="secondary"
                        variant="contained"
                        className="expenseedit"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete4(paidvoucher._id)}
                        color="error"
                        variant="contained"
                        className="expensedelete"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit Paid Voucher Dialog */}
          <Dialog
            open={paidVoucherEditOpen}
            onClose={handlePaidVoucherEditClose}
          >
            <DialogTitle
              sx={{ textAlign: "center", color: "#194300", fontWeight: "600" }}
            >
              Edit Paid Voucher
            </DialogTitle>
            <DialogContent>
              {currentPaidVoucher && (
                <form id="edit-paid-voucher-form">
                  <TextField
                    label="Name"
                    name="name"
                    defaultValue={currentPaidVoucher.name}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Amount"
                    name="amount"
                    defaultValue={currentPaidVoucher.amount}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={currentPaidVoucher.date.split("T")[0]}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Purpose"
                    name="purposeOfAmount"
                    defaultValue={currentPaidVoucher.purposeOfAmount}
                    fullWidth
                    margin="normal"
                  />
                </form>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", mb: 2 }}>
              <Button
                onClick={() => handlePaidVoucherEditSubmit()}
                color="success"
                variant="contained"
                style={{ fontWeight: 600 }}
              >
                Save
              </Button>
              <Button
                onClick={handlePaidVoucherEditClose}
                color="error"
                variant="contained"
                style={{ fontWeight: 600 }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ color: "green", fontWeight: "550" }}>
            Appraisal Entries
          </Typography>
        
          <Grid container>
          <Grid item xs={6} >
    <Typography 
      variant="h6" 
      className="daybook_font" 
      sx={{ color: "#48164e",ml:-3,fontWeight:600 }}
    >
      Interest Total: {interestTotal}
    </Typography>
  </Grid>
  <Grid item xs={6}>
    <Typography 
      variant="h6" 
      className="daybook_font" 
      sx={{ color: "green" }}
    >
      <PaymentsIcon sx={{ mr: 1 }} />
      <span style={{ fontWeight: "550" }}>
        Total:
      </span>{" "}
      {appraisalTotal}
    </Typography>
  </Grid>

</Grid>
          <TableContainer component={Paper} sx={{ width: 900 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1784CC" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Customer ID
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Loan Number
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Principle Paid
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Interest Paid
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Balance
                  </TableCell>
                  <TableCell
                    className="actions-column"
                    sx={{
                      border: "1px solid black",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(apraisalentries).map((appraisal) => (
                  <TableRow key={appraisal._id}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {appraisal.customerId}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {appraisal.loanNo}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {appraisal.paymentDate}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {appraisal.interestamount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {appraisal.interestPrinciple}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {appraisal.balance}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {" "}
                      <Button
                        onClick={() => handleDelete6(appraisal._id)}
                        color="error"
                        variant="contained"
                        className="expensedelete"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Reminders;
