import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import image from "../../src/Navbar/KRT Gold Finance Logo PNG File.png";
const PrintDialog = ({ open, onClose, data }) => {
  const [file, setFile] = useState(null);
  const [customerFile, setCustomerFile] = useState(null);
  if (!data) return null;

  const handlePrint = () => {
    window.print(); 
  };

  const handleDownload = async () => {
    const input = document.getElementById("print-content"); 
    const canvas = await html2canvas(input, {
      scrollX: 0,
      scrollY: -window.scrollY,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210 - 20; 
    const pageHeight = 295 - 20; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10; // Margin top

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("receipt-voucher.pdf");
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
  return (
    <>
      <div className="paperbg5">
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogContent>
            <div id="print-content">
              <Paper
                elevation={2}
                style={{ padding: "20px" }}
                sx={{ maxWidth: 640, margin: "auto" }}
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
                    <Typography variant="h5" align="center" gutterBottom>
                      KRT GOLD FINANCE
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                      Cell No: 9042425142, 9042425642
                    </Typography>
                    <Typography variant="body1" align="center" gutterBottom>
                      135/5 Velavan Complex, Near (MGN) Lodge, Salem Main Road,
                      <br />
                      Komarapalayam-638183
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" align="center">
                      <strong>RECEIPT VOUCHER</strong>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Customer Id"
                      name="customerId"
                      value={data.customerId}
                      variant="standard"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Loan Number"
                      name="loanNo"
                      value={data.loanNo}
                      variant="standard"
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Customer Name"
                      name="customerName"
                      value={data.customerName}
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
                      value={data.paymentDate}
                      variant="standard"
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Schema"
                      name="schema"
                      value={data.schema}
                      variant="standard"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="No.Of.Days"
                      name="schema"
                      value={data.noOfDays}
                      variant="standard"
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
                <TableContainer
                  component={Paper}
                  sx={{ mt: 2, mb: 5 }}
                  className="paperbg2"
                >
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>
                          Principal Paid
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                          {data.interestamount}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>
                          Interest Paid
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                          {data.interestPrinciple}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: "1px solid black" }}>
                          Balance
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                          {data.balance}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {file ? (
                      <div
                        style={{ position: "relative", textAlign: "center" }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Cashier Sign"
                          style={{ width: "90%", height: "100px" }}
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
                      <Button variant="outlined" component="label" fullWidth>
                        Upload Cashier Sign
                        <input type="file" hidden onChange={handleFileChange} />
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {customerFile ? (
                      <div
                        style={{ position: "relative", textAlign: "center" }}
                      >
                        <img
                          src={URL.createObjectURL(customerFile)}
                          alt="Customer Sign"
                          style={{ width: "90%", height: "100px" }}
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
                      <Button variant="outlined" component="label" fullWidth>
                        Upload Customer Sign
                        <input
                          type="file"
                          hidden
                          onChange={handleCustomerFileChange}
                        />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Paper>{" "}
            </div>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              onClick={handlePrint}
              color="success"
              className="print-button"
              variant="contained"
              style={{ margin: "0 8px" }}
            >
              Print
            </Button>
            <Button
              onClick={handleDownload}
              color="secondary"
              className="print-button"
              variant="contained"
              style={{ margin: "0 8px" }}
            >
              Download
            </Button>
            <Button
              onClick={onClose}
              color="error"
              className="print-button"
              variant="contained"
              style={{ margin: "0 8px" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default PrintDialog;
