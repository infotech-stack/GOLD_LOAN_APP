import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import "./Books.css";
import image from "../../src/Navbar/KRT Gold Finance Logo PNG File.png";
import { toWords } from "number-to-words";
import swal from "sweetalert";

const Books = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [customerData, setCustomerData] = useState({
    date: "",
    customerId: "",
    customerName: "",
    loanNumber: "",
    fatherName: "",
    address: "",
    mobile: "",
    loanAmount: "",
    rupeesInWords: "",
    mobileNumber1: "",
    loanDate: "",
    jDetails: "",
    quantity: "",
    iw: "",
    schema: "",
    lastDateForLoan: "",
    percent: "",
  });
  const [isReadOnly, setIsReadOnly] = useState(false);
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  const [validationErrors, setValidationErrors] = useState({});
  const validateForm = () => {
    const errors = {};

    // Check each required field
    if (!customerData.date) errors.date = "Date is required";
    if (!customerData.customerId) errors.customerId = "Customer ID is required";
    if (!customerData.customerName)
      errors.customerName = "Customer Name is required";
    if (!customerData.loanNumber) errors.loanNumber = "Loan Number is required";
    if (!customerData.fatherName) errors.fatherName = "Father Name is required";
    if (!customerData.mobileNumber1)
      errors.mobileNumber1 = "Mobile Number is required";
    if (!customerData.loanAmount) errors.loanAmount = "Loan Amount is required";
    if (!customerData.schema) errors.schema = "Schema is required";
    if (!customerData.percent) errors.percent = "Percent is required";
    if (!customerData.address) errors.address = "Address is required";
    if (!customerData.rupeesInWords)
      errors.rupeesInWords = "Rupees In Words is required";

    if (!customerData.iw) errors.iw = "Weight is required";
    if (!customerData.lastDateForLoan)
      errors.lastDateForLoan = "Last Date For Loan is required";

    setValidationErrors(errors);

    // Log errors for debugging
    console.log("Validation errors:", errors);

    return Object.keys(errors).length === 0;
  };

  const getLabels = (id) => {
    switch (selectedLanguage) {
      case "tamil":
        switch (id) {
          case "date":
            return <Typography className="font-tamil">தேதி</Typography>;
          case "customerId":
            return (
              <Typography className="font-tamil">வாடிக்கையாளர் ஐடி</Typography>
            );
          case "customerName":
            return (
              <Typography className="font-tamil">
                வாடிக்கையாளர் பெயர்
              </Typography>
            );
          case "loanNumber":
            return <Typography className="font-tamil">கடன் எண்</Typography>;
          case "jewelNo":
            return <Typography className="font-tamil">நகை எண்</Typography>;
          case "fatherName":
            return (
              <Typography className="font-tamil">கணவன்/தந்தை பெயர்</Typography>
            );
          case "address":
            return <Typography className="font-tamil">முகவரி</Typography>;
          case "mobile":
            return <Typography className="font-tamil">கைப்பேசி எண்</Typography>;
          case "loanAmount":
            return <Typography className="font-tamil">கடன் தொகை</Typography>;
          case "rupeesInWords":
            return <Typography className="font-tamil">எழுத்தால்</Typography>;
          case "loanDate":
            return <Typography className="font-tamil">கடன் தேதி</Typography>;
          case "jewelDetails":
            return (
              <Typography className="font-tamil">நகை விவரங்கள்</Typography>
            );
          case "quantity":
            return <Typography className="font-tamil">எண்ணிக்கை</Typography>;
          case "weight":
            return <Typography className="font-tamil">மொத்த எடை</Typography>;
          case "lastDateForLoan":
            return (
              <Typography className="font-tamil">கடன் கடைசி தேதி</Typography>
            );

          case "companyName":
            return (
              <Typography className="font-tamill">
                கேஆர்டி கோல்டு பைனான்ஸ்
              </Typography>
            );
          case "cellNumbers":
            return (
              <Typography className="font-tamil">
                செல் நம்பர்: 9042425142, 9042425642
              </Typography>
            );
          case "addressLine1":
            return (
              <Typography className="font-tamil">
                135/5, வேலவன் காம்ப்ளெக்ஸ், (M.G.N லாட்ஜ் அருகில்) சேலம் மெயின்
                ரோடு
              </Typography>
            );
          case "addressLine2":
            return (
              <Typography className="font-tamil">
                கொமாரபாளையம் - 638 183,நாமக்கல் Dt
              </Typography>
            );
          case "condition":
            return (
              <Typography className="font-tamil">
                1. நான் மேலே குறிப்பிட்டுள்ள தங்க நகைகளை ஈடாக தருகிறேன். 2. இந்த
                நகைகள் என்னுடையவை. 3. நான் கடன் தொகை மற்றும் வட்டி சேர்த்து
                மறுபக்கத்தில் குறிப்பிட்டுள்ள கால அவகாசத்திற்குள் திருப்பி
                அடைக்க சம்மதிக்கிறேன். 4. இந்த படிவத்தில் குறிப்பிட்டுள்ள யாவும்
                உண்மையென நான் உறுதி கூறுகிறேன். 5. பின் பக்கத்தில்
                கொடுத்திருக்கும் நிபந்தனைகளையும், விதிமுறைகளையும்
                ஏற்றுக்கொள்கிறேன்.
              </Typography>
            );
          case "heading1":
            return (
              <Typography className="font-tamil">
                {" "}
                1. நீங்கள் ஈடாக அடகு வைத்திருக்கும் பொருளுக்கு கூடுதல்
                மதிப்பீட்டை வைத்து உங்கள் வட்டி நிர்ணயிக்கப்படுகிறது.
              </Typography>
            );
          case "heading2":
            return (
              <Typography className="font-tamil">
                {" "}
                2. அடகு வைத்த தேதியிலிருந்து ஒரு வருடத்திற்குள் / ஆறு
                மாதத்திற்குள் நகைகளை திருப்பவோ அல்லது வட்டி கட்டி மாற்றி
                புதுப்பித்து கொள்ளவும், தவறும் பட்சத்தில் அடுத்து வரும்
                நாட்களில் தங்களது நகைக்கடனின் வட்டி விகிதம் மாறும். மேற்கொண்டு
                தவறும் பட்சத்தில் தங்களின் நகைகளை பகிரங்க ஏலத்தில் விடப்படும்.
              </Typography>
            );
          case "heading3":
            return (
              <Typography className="font-tamil">
                {" "}
                3. அடகு கடன் பெற்றவர்களுக்கு அனுப்பப்படும் தபால்கள், இதர
                செலவுகள் அனைத்தும் தங்களின் கடன் கணக்கிலேயே சேரும்.
              </Typography>
            );
          case "heading4":
            return (
              <Typography className="font-tamil">
                {" "}
                4.தங்களது நகைக்கடன் ரசீது தொலைந்து போனால் நிர்வாகம் கேட்கும்
                சான்றிதழ்கள் கொடுக்க சம்மதம் தெரிவிக்கிறேன் / றோம்.
              </Typography>
            );
          case "heading5":
            return (
              <Typography className="font-tamil">
                {" "}
                5. தங்களது முகவரி மற்றும் அலைபேசி எதுவும் மாற்றம் இருந்தால் அதை
                உடனடியாக நிர்வாகத்திற்கு தெரியப்படுத்த வேண்டும். தவறும்
                பட்சத்தில் நிர்வாகம் பொறுப்பேற்காது.
              </Typography>
            );
          case "heading6":
            return (
              <Typography className="font-tamil">
                {" "}
                6.  நான் / நாங்கள் அடமானமாக வைக்க தங்கள் நிறுவனத்திற்கு கொண்டு
                வந்து இருக்கும் நகைகள் அனைத்தும் என்னுடைய / எங்களுடைய சொந்த
                நகைகள் என்பதை உறுதியுடன் தெரிவித்துக் கொள்கிறேன் / றோம்.
                
              </Typography>
            );
          case "heading7":
            return (
              <Typography className="font-tamil">
                {" "}
                7. தாங்கள் எனக்கு வழங்கிய தங்கத்திற்கு அதிகப்படியான நகைகடனுக்கு
                தங்கத்தின் விலை சரிவு ஏற்பட்டால் அதுக்கு ஈடாக தங்களது நிர்வாகம்
                கேட்கும் தொகை உடனடியாக திருப்பி செலுத்தி விடுகிறேன். தவறும்
                பட்சத்தில் என் நகையின் மேல் நிர்வாகம் எடுக்கும் முடிவுக்கு
                முழுமனதுடன் சம்மதம் தெரி விக்கிறேன். மேற்கண்ட நிபந்தனைகளுக்கு
                முழு சம்மதம் தெரிவிக்கிறேன் /றோம்.
              </Typography>
            );
           
            case "headingsign":
              return (
                <Typography className="font-tamil">
                  {" "}
                  <div style={{marginTop:'20px',marginBottom:'10px'}}>
                <EditIcon style={{ fontSize: 18,color:'brown' ,}} /><span style={{marginTop:'0px'}}>__________________________________________</span>
                </div></Typography>
              );
          case "heading8":
            return (
              <Typography className="font-tamil">
                {" "}
                *அரசு விடுமுறை நாட்களில் நகைகளை திருப்ப முடியாது.
              </Typography>
            );
          case "heading9":
            return (
              <Typography className="font-tamil">
                {" "}
                *நகையை திரும்ப பெற வரும் பொழுது இந்த ரசீதுடன் நகைக்கு
                சொந்தமானவர்கள் வந்தால் மட்டுமே நகையை திரும்ப பெற முடியும்.
              </Typography>
            );
          case "heading10":
            return (
              <Typography className=" font-bold">
                {" "}
                பிற நிறுவனத்தில் இருக்கும் தங்க நகைகள் விற்க / அடகு வைக்க
                அணுகவும்.
              </Typography>
            );
          case "heading11":
            return (
              <Typography className="font-tamil"> பொது மேலாளர்</Typography>
            );
          case "heading12":
            return (
              <Typography className="font-tamil"> கடன் மேலாளர்</Typography>
            );
          case "heading13":
            return (
              <Typography className="font-tamil">
                {" "}
                நகை மதிப்பீட்டாளர்
              </Typography>
            );
          case "heading14":
            return <Typography className="font-tamil"> காசாளர்</Typography>;
          case "heading15":
            return (
              <Typography className="font-tamil">
                {" "}
                அடகு வைப்பவரின் கையொப்பம் அல்லது இடது கட்டைவிரல்
              </Typography>
            );
          case "heading16":
            return (
              <Typography className="font-tamil">
                {" "}
                நகை பெறுவோரின் கையொப்பம் 
              </Typography>
            );
          case "heading17":
            return (
              <Typography className="font-tamil2">
                {" "}
                அலுவலக நேரம் காலை 9:00 மணிமுதல் மாலை 6:00 மணிவரை பிரதி ஞாயிறு
                முக்கிய பண்டிகைகளுக்கு விடுமுறை
              </Typography>
            );
          case "schema":
            return <Typography className="font-tamil"> திட்டம்</Typography>;
          case "percent":
            return <Typography className="font-tamil"> சதவீதம்</Typography>;
          case "heading0":
            return (
              <Typography className="font-tamil font-bold">
                {" "}
                விதிமுறைகள் மற்றும் நிபந்தனைகள்
              </Typography>
            );
          default:
            return "";
        }
      default:
        switch (id) {
          case "date":
            return <Typography className="font_book"> Date</Typography>;
          case "customerId":
            return <Typography className="font_book"> Customer Id</Typography>;
          case "customerName":
            return (
              <Typography className="font_book"> Customer Name</Typography>
            );
          case "loanNumber":
            return <Typography className="font_book"> Loan Number</Typography>;
          case "jewelNo":
            return "Jewel Number";
          case "fatherName":
            return (
              <Typography className="font_book"> Father/Husband</Typography>
            );
          case "address":
            return <Typography className="font_book"> Address</Typography>;
          case "mobile":
            return (
              <Typography className="font_book"> Mobile Number</Typography>
            );
          case "loanAmount":
            return <Typography className="font_book"> Loan Amount</Typography>;
          case "rupeesInWords":
            return (
              <Typography className="font_book"> Rupees in Words</Typography>
            );
          case "loanDate":
            return <Typography className="font_book"> Loan Date</Typography>;
          case "jewelDetails":
            return (
              <Typography className="font_book1"> Jewel Details</Typography>
            );
          case "quantity":
            return <Typography className="font_book1"> Quantity</Typography>;
          case "weight":
            return (
              <Typography className="font_book1"> Gross weight</Typography>
            );
          case "lastDateForLoan":
            return (
              <Typography className="font_book1">
                {" "}
                Last Date for Loan
              </Typography>
            );
            case "headingsign":
              return (
                <Typography className="font_book1">
                  {" "}
                  <div style={{marginTop:'20px',marginBottom:'10px'}}>
                <EditIcon style={{ fontSize: 18,color:'brown' ,}} /><span style={{marginTop:'0px'}}>__________________________________________</span>
                </div></Typography>
              );
          case "companyName":
            return "KRT GOLD FINANCE";
          case "cellNumbers":
            return "Cell No: 9042425142, 9042425642";
          case "addressLine1":
            return "135/5 Velavan Complex, Near (MGN) Lodge, Salem Main Road,";
          case "addressLine2":
            return "Komarapalayam-638183,Namakkal dist ";
          case "condition":
            return (
              <Typography className="font_book">
                1. The loan amount will be disbursed as per the terms and
                conditions. 2. Interest will be charged as per the agreement. 3.
                Any delay in repayment will incur penalties. 4. The borrower
                should provide necessary documents as required. 5. The loan is
                subject to approval by the management.
              </Typography>
            );
          case "heading1":
            return (
              <Typography className="font_book">
                1. Your interest is determined by adding value to the property
                you are pledging.
              </Typography>
            );
          case "heading2":
            return (
              <Typography className="font_book">
                2. To return the jewelry within one year / six months from the
                date of pledge or to renew with interest, failing which the
                interest rate of your jewelry loan will change in the following
                days. In case of further failure, the jewels will be auctioned.
              </Typography>
            );
          case "heading3":
            return (
              <Typography className="font_book">
                3. All postage and other expenses sent to the mortgagee will be
                credited to their loan account.
              </Typography>
            );
          case "heading4":
            return (
              <Typography className="font_book">
                4.In case of loss of the jewelry loan receipt, I agree to
                provide the certificates requested by the management.
              </Typography>
            );
          case "heading5":
            return (
              <Typography className="font_book">
                5. If there is any change in your address and phone number, you
                should inform the management immediately. Management will not be
                held responsible in case of failure.
              </Typography>
            );
          case "heading6":
            return (
              <Typography className="font_book">
                6. I / We hereby declare that all the jewelry which I / we are
                bringing to your company for pawning is my / our own jewelry.
           
              </Typography>
            );
          case "heading7":
            return (
              <Typography className="font_book">
                7. In case of a fall in the price of gold, I will immediately
                repay the amount demanded by management. In case of a mistake, I
                wholeheartedly consent to the management's decision on my
                jewelry. I fully agree to the above conditions.
              </Typography>
            );
          case "heading8":
            return (
              <Typography className="font_book">
                *Jewelry cannot be returned on public holidays.
              </Typography>
            );
          case "heading9":
            return (
              <Typography className="font_book">
                *The jewelry can only be returned if the owner comes with this
                receipt when returning the jewelry.
              </Typography>
            );
          case "heading10":
            return (
              <Typography className="font_book">
                Will be in other company Sell / Pawn Gold Jewellery
              </Typography>
            );
          case "heading11":
            return (
              <Typography className="font_book">General Manager</Typography>
            );
          case "heading12":
            return (
              <Typography className="font_book">Credit Manager</Typography>
            );
          case "heading13":
            return (
              <Typography className="font_book">Jewellery Appraiser</Typography>
            );
          case "heading14":
            return <Typography className="font_book">Cashier</Typography>;
          case "heading15":
            return (
              <Typography className="font_book">
                Mortgagor's Signature or Thumbprint
              </Typography>
            );
          case "heading16":
            return (
              <Typography className="font_book">
                of jewelers Signature
              </Typography>
            );
          case "heading17":
            return (
              <Typography className="font_book">
                Office Hours: 9:00 AM to 6:00 PM. Closed on Sundays and major
                festivals.
              </Typography>
            );
          case "schema":
            return <Typography className="font_book"> Schema</Typography>;
          case "heading0":
            return "Terms and Conditions";
          case "percent":
            return <Typography className="font_book"> Percent</Typography>;
          default:
        }
    }
  };
  const [loanNumbers, setLoanNumbers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState({});
  const [proof3, setProof3] = useState(null);
  const [selectedLoanNumber, setSelectedLoanNumber] = useState("");
  useEffect(() => {
    if (customerData.customerId) {
      fetchLoanNumbers(customerData.customerId);
    }
  }, [customerData.customerId]);
  const [jewelList, setJewelList] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalGrossWeight, setTotalGrossWeight] = useState(0);
  const [jewelDetailsString, setJewelDetailsString] = useState("");
  const [customer, setCustomer] = useState(null);

  const fetchLoanNumbers = (customerId) => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/loans/${customerId}`
      )
      .then((response) => {
        console.log("Full response data:", response.data);

        const loans = response.data;
        setLoanNumbers(loans);

        // Ensure customer is defined before accessing its properties
        if (customer) {
          setCurrentCustomer({
            ...customer,
            customerPhoto: customer.customerPhoto,
          });
          setProof3(customer.proof3);
        } else {
          console.error("Customer is not defined.");
        }
      })
      .catch((error) => {
        console.error("Error fetching loan numbers:", error);
      });
  };

  const fetchCustomerData = async (loanNumber) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/loan/${loanNumber}`
      );
      const customer = response.data;

      // Process date
      const date = new Date(customer.date);
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", customer.date);
        return;
      }
      const formattedDate = date.toISOString().split("T")[0];

      const fatherName = customer.fatherhusname;
      const lastDateForLoan = new Date(customer.lastDateForLoan)
        .toISOString()
        .split("T")[0];
      const loanAmountInWords = toWords(customer.loanAmount);

      const jewelListData = customer.jewelList || [];

      console.log("Fetched jewel list:", jewelListData);

      const detailsString = jewelListData
        .map((jewel) => jewel.jDetails || "Unknown")
        .join(", ");
      const totalQuantity = jewelListData.reduce(
        (sum, jewel) => sum + (jewel.quantity || 0),
        0
      );
      const totalGrossWeight = jewelListData.reduce(
        (sum, jewel) => sum + (jewel.gw || 0),
        0
      );

      // Set jewel list and other state updates
      setJewelList(jewelListData); // Update jewelList state here
      setJewelDetailsString(detailsString);
      setTotalQuantity(totalQuantity);
      setTotalGrossWeight(totalGrossWeight);
      setCurrentCustomer(customer);
      setProof3(customer.proof3 ? customer.proof3 : []);
      setCustomerData({
        ...customer,
        date: formattedDate,
        lastDateForLoan,
        rupeesInWords: loanAmountInWords,
        fatherName: fatherName,
      });
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    console.log("Updated customer data:", customerData);
    console.log("Jewel list inside useEffect:", jewelList);
  }, [customerData, jewelList]);

  console.log("Current Customer Photo:", currentCustomer.customerPhoto);
  console.log("Proof 3 URLs:", proof3);

  const handleCustomerIdChange = (event) => {
    const customerId = event.target.value;
    setCustomerData((prevState) => ({
      ...prevState,
      customerId,
    }));
    fetchCustomerData(customerId);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCustomerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "loanNumber") {
      setSelectedLoanNumber(value);
      fetchCustomerData(value);
    } else if (name === "lastDateForLoan") {
      const formattedDate = new Date(value).toISOString().split("T")[0];
      setCustomerData((prevState) => ({
        ...prevState,
        [name]: formattedDate,
      }));
    } else if (name === "date") {
      const formattedDate = value;
      setCustomerData((prevState) => ({
        ...prevState,
        [name]: formattedDate,
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };
  const saveCustomerData = async () => {
    const isValid = validateForm();
    console.log("Form validation result:", isValid);

    if (!isValid) {
      console.log("Validation failed. Customer data not saved.");
      return;
    }

    try {
      console.log("Sending customer data:", customerData);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/customers/create`,
        customerData
      );

      console.log("Customer saved:", response.data);

      swal(
        "Success",
        "Customer data has been saved successfully. Take a printout as needed!",
        "success"
      );
    } catch (error) {
      console.error(
        "Error saving customer data:",
        error.response ? error.response.data : error.message
      );

      swal(
        "Error",
        `There was an error saving the customer data: ${
          error.response ? error.response.data.message : error.message
        }`,
        "error"
      );
    }
  };

  return (
    <>
      <div className="print-container">
        <Grid
          container
          spacing={2}
          justifyContent="center"
          className="print-button"
          sx={{ mb: 1 }}
        >
          <Grid item xs={12} sm={4} className="print-button">
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                className="print-button"
                id="language-select"
                value={selectedLanguage}
                onChange={handleLanguageChange}
                label="Language"
              >
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="tamil">தமிழ்</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div style={{ marginTop: "0px" }} className="billbook">
          <Paper
            elevation={2}
            style={{ padding: "20px" }}
            sx={{ maxWidth: 750, margin: "auto" }}
            className="paperbg2"
          >
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={3} align="right" sx={{ mt: -2 }}>
                <img
                  src={image}
                  alt="Logo"
                  style={{ width: "70%", height: "auto" }}
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  sx={{ mt: 0 }}
                >
                  {getLabels("companyName")}
                </Typography>
                <Typography
                  variant="subtitle1"
                  className="voucher_font"
                  align="center"
                >
                  {getLabels("cellNumbers")}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  className="voucher_font"
                  align="center"
                >
                  {getLabels("addressLine1")}
                  {getLabels("addressLine2")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      InputProps={{
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      className="font_book"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      id="customerId"
                      label={getLabels("customerId")}
                      variant="outlined"
                      value={customerData.customerId}
                      onChange={handleCustomerIdChange}
                      error={!!validationErrors.customerId}
                      helperText={validationErrors.customerId}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      select
                      fullWidth
                      id="loanNumber"
                      label={getLabels("loanNumber")}
                      name="loanNumber"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      variant="outlined"
                      value={customerData.loanNumber}
                      error={!!validationErrors.loanNumber}
                      helperText={validationErrors.loanNumber}
                      onChange={handleInputChange}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value=""></option>{" "}
                      {/* Empty option for placeholder */}
                      {loanNumbers.map((loan) => (
                        <option key={loan.loanNumber} value={loan.loanNumber}>
                          {loan.loanNumber}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label="Date"
                      name="date"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      value={customerData.date}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!validationErrors.date}
                      helperText={validationErrors.date}
                      InputProps={{
                        readOnly: isReadOnly,
                        style: {
                          fontSize: "12px",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      id="customerName"
                      label={getLabels("customerName")}
                      variant="outlined"
                      value={customerData.customerName}
                      error={!!validationErrors.customerName}
                      helperText={validationErrors.customerName}
                      InputProps={{
                        readOnly: isReadOnly,
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          customerName: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      id="fatherName"
                      InputProps={{
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      label={getLabels("fatherName")}
                      variant="outlined"
                      value={customerData.fatherName}
                      error={!!validationErrors.fatherName}
                      helperText={validationErrors.fatherName}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          fatherName: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      id="mobile"
                      label={getLabels("mobile")}
                      variant="outlined"
                      value={customerData.mobileNumber1}
                      error={!!validationErrors.mobileNumber1}
                      helperText={validationErrors.mobileNumber1}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      InputProps={{
                        readOnly: isReadOnly,
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          mobile: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      id="loanAmount"
                      label={getLabels("loanAmount")}
                      InputProps={{
                        readOnly: isReadOnly,
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      variant="outlined"
                      value={customerData.loanAmount}
                      error={!!validationErrors.loanAmount}
                      helperText={validationErrors.loanAmount}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          loanAmount: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      id="schema"
                      label={getLabels("schema")}
                      InputProps={{
                        readOnly: isReadOnly,
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      variant="outlined"
                      value={customerData.schema}
                      error={!!validationErrors.schema}
                      helperText={validationErrors.schema}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          customerName: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      id="percent"
                      label={getLabels("percent")}
                      variant="outlined"
                      value={customerData.percent}
                      InputProps={{
                        readOnly: isReadOnly,
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      error={!!validationErrors.percent}
                      helperText={validationErrors.percent}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          customerName: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      id="rupeesInWords"
                      label={getLabels("rupeesInWords")}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      InputProps={{
                        readOnly: isReadOnly,
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      value={customerData.rupeesInWords}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          rupeesInWords: e.target.value,
                        })
                      }
                      error={!!validationErrors.rupeesInWords}
                      helperText={validationErrors.rupeesInWords}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      label={getLabels("address")}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "black",
                          },
                        },
                      }}
                      InputProps={{
                        readOnly: isReadOnly,
                        style: {
                          fontSize: "12px",
                        },
                      }}
                      value={customerData.address}
                      onChange={(e) =>
                        setCustomerData({
                          ...customerData,
                          address: e.target.value,
                        })
                      }
                      error={!!validationErrors.address}
                      helperText={validationErrors.address}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ border: "1px solid black" }}
                          colSpan={2}
                        >
                          {getLabels("jewelDetails")}
                        </TableCell>
                        <TableCell
                          sx={{ border: "1px solid black" }}
                          colSpan={2}
                        >
                          {getLabels("quantity")}
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                          {getLabels("weight")}
                        </TableCell>
                        <TableCell sx={{ border: "1px solid black" }}>
                          {getLabels("lastDateForLoan")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {jewelList.map((jewel, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{ border: "1px solid black" }}
                            colSpan={2}
                          >
                            {jewel.jDetails || "N/A"}
                          </TableCell>
                          <TableCell
                            sx={{ border: "1px solid black" }}
                            colSpan={2}
                          >
                            {jewel.quantity || 0}
                          </TableCell>

                          {index === 0 && (
                            <>
                              <TableCell
                                sx={{ border: "1px solid black" }}
                                rowSpan={jewelList.length}
                              >
                                {customerData.gw || 0}
                              </TableCell>
                              <TableCell
                                sx={{ border: "1px solid black" }}
                                rowSpan={jewelList.length}
                              >
                                {customerData.lastDateForLoan || "N/A"}{" "}
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer sx={{ mt: 1, height: "390px" }}>
                  {" "}
                  {/* Adjust this height as needed */}
                  <Table>
                    <TableRow>
                      {/* Customer Photo */}
                      <TableCell
                        sx={{
                          border: "1px solid black",
                          width: "40%",
                          height: "150px", // Reduced height
                          padding: "10px", // Added padding for better spacing
                        }}
                      >
                        <Typography variant="body1" className="font_book">
                          Customer Photo
                        </Typography>
                        {currentCustomer.customerPhoto ? (
                          <Box sx={{ marginBottom: "10px", width: "100%" }}>
                            <img
                              src={currentCustomer.customerPhoto}
                              alt="Customer Photo"
                              style={{
                                width: "150px", // Adjust width
                                height: "150px", // Adjust height
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        ) : (
                          <Typography className="font_book">
                            No customer photo available
                          </Typography>
                        )}
                      </TableCell>

                      {/* Jewel Photo */}
                      <TableCell
                        sx={{
                          border: "1px solid black",
                          width: "60%",
                          height: "150px", // Reduced height
                          padding: "10px", // Added padding for better spacing
                        }}
                      >
                        <Typography variant="body1" className="font_book">
                          Jewel Photo
                        </Typography>
                        {proof3 && proof3.length > 0 ? (
                          <Box
                            sx={{
                              marginBottom: "10px",
                              width: "100%",
                              display: "flex",
                              flexWrap: "wrap",
                            }}
                          >
                            {proof3.map((url, idx) => (
                              <img
                                key={idx}
                                src={`${url}`}
                                alt={`Proof 3 - ${idx}`}
                                style={{
                                  width: "150px", // Adjust width
                                  height: "150px", // Adjust height
                                  objectFit: "contain",
                                  marginRight: "10px",
                                }}
                              />
                            ))}
                          </Box>
                        ) : (
                          <Typography className="font_book">
                            No jewel photo available
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  </Table>
                </TableContainer>

                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mt: -23 }}>
                    {getLabels("condition")}
                  </Typography>

                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ mt: 2 }}
                  >
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        {getLabels("heading11")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        {getLabels("heading12")}
                      </Typography>
                    </Grid>{" "}
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        {getLabels("heading13")}
                      </Typography>
                    </Grid>{" "}
                    <Grid item xs={12} sm={2}>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        {getLabels("heading14")}
                      </Typography>
                    </Grid>{" "}
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        {getLabels("heading15")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} align="center">
                <Typography variant="body2" sx={{ mt: -1 }}>
                  {getLabels("heading17")}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </div>
        <div
          style={{ padding: "20px", marginTop: "40px" }}
          className="billbooks"
        >
          <Paper
            elevation={2}
            style={{ padding: "20px" }}
            sx={{ maxWidth: 750, margin: "auto" }}
            className="paperbg2"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ mt: 0 }}>
                <Typography textAlign="center" sx={{ mb: 2 }}>
                  {getLabels("heading0")}
                </Typography>

                <Typography>{getLabels("heading1")}</Typography>
                <Typography>{getLabels("heading2")}</Typography>
                <Typography>{getLabels("heading3")}</Typography>
                <Typography>{getLabels("heading4")}</Typography>
                <Typography>{getLabels("heading5")}</Typography>
                <Typography>{getLabels("heading6")}</Typography>
                <Typography>{getLabels("heading7")}</Typography>
                <Typography textAlign={"center"}>{getLabels("headingsign")}</Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <TableContainer>
                  <Table>
                    <TableHead sx={{ border: "1px solid black" }}>
                      <TableRow align="center">
                        {" "}
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid black" }}
                        >
                          <Typography>{getLabels("heading8")}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow align="center">
                        {" "}
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid black" }}
                        >
                          {" "}
                          <Typography>{getLabels("heading9")}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        {" "}
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid black" }}
                        >
                          {" "}
                          <Typography>
                            <strong>{getLabels("heading10")}</strong>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
                <Grid
                  container
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {getLabels("heading11")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {getLabels("heading12")}
                    </Typography>
                  </Grid>{" "}
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {getLabels("heading14")}
                    </Typography>
                  </Grid>{" "}
                  <Grid item xs={12} sm={3}>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {getLabels("heading16")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              style={{ textAlign: "center", marginTop: "30px" }}
            >
              <Button
                variant="contained"
                color="primary"
                className="sub-green print-button"
                onClick={saveCustomerData}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrint}
                className="print-button sub-green1"
                sx={{ mt: 2 }}
              >
                {getLabels("print")} PRINT
              </Button>
            </Grid>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default Books;
