import React, { useState,useEffect } from "react";
import image from "../../src/Navbar/KRT Gold Finance Logo PNG File.png";
import dayjs from "dayjs";
import RepledgeDialog from "./repledgerdialog";
import {
  Grid,
  Typography,
  TextField,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Checkbox,
  Button,
} from "@mui/material";
import "../User/User.css"; 
import axios from "axios";
import Swal from "sweetalert2";
const translations = {
  english: {
    title: "Gold Finance",
    address:
      "135/5, Velavan Complex, (Near M.G.N Lodge) Salem Main Road, Komarapalayam - 638 183, Namakkal Dt",
    pledgeDetails:
      "Pledge / Sale Declaration Document for Police and Institution",
    sender: "Sender",
    receiver: "Receiver",
    details: "Pledge / Sale Details",
    inspector: "Inspector, Police Station",
    otherBankName: "Name/Place of Other Bank",
    otherBankAmount: "Amount Paid in Other Bank",
    pledgeAmount: "Pledge Amount",
    saleAmount: "Sale Amount",
    goldWeight: "Weight of Gold",
    serviceCharge: "Service Charge",
    amountGiven: "Amount Given to Customer",
    signature: "Customer Signature ",
    signatures:
      "I / I take full responsibility for the money they bring for my requirement based on the document given by me.",
    head1: "Pledge / Sale Documents - Verification - Checklist",
    head2: "1. Customer Authenticity – Verified",
    head3: "2. Quality of Jewelery – Checked ",
    head4:
      "3. Customer Phone Number – Verified (Dial directly on the same day when customer is present and verified)",
    head5:
      "4. Customer Professional Proof / Employment Proof – verified and attached.",
    head6: "5. Customer Address Proof (Address Proof) – verified.",
    head7: "6. Customer Photo - Attached.",
    head8: "7. Photo of purchase items (Jewel Photo) - Attached.",
    head9: "8. Customer Fingerprint (Sign & Thumb Impression) – Received.",
    head10: "9. Bank Pass Book Copy - Attached.",
    head11: "10. Witness Signature Proof (Witness Proof) – Attached.",
    head12:
      "11. Purchase Application Agreement (Application Agreement) - Attached.",
    head13: "12. Takeover Application and Agreement - Attached.",
    head14:
      "13. Customer Pledge / Credit Card Copy (Loan - Jewel Token Copy) - Attached.",
    head15: "14. Loan - Jewel Release Receipt - Attached.",
    head16:
      "Sir, Residing at ................................................................................................. I have procured by myself and according to my experience the following gold jewellery belonging to me in your company for Rs. On .................. I have sold / sold items (Gold / Silver) weighing .................. in their company. My sale / jewellery loan, I have no objection in giving the details of the gold jewelery sold / loaned by me / us, my photograph and my personal details in case the details are required for police investigation. In the following days it is known that these gold jewels were obtained illegally and I/we agree that I will compensate all kinds of losses and damages with my other assets or through the heirs (a) own. In case of mistake, I, my heirs and family members will be bound by the legal action taken by them and the police separately.",
    head17: "Special jewelry loan",
    head18:
      "Jewelery loan from their company JL ................................. for term Rs......... .......................... I have got a loan for jewellery. Further I/We repay the entire interest or principal within the term given by you as the value of the jewelery is only suitable for the term. I assure them that in case of failure they will auction my jewelery without any prior notice and collect the amount due to them. Further, if they incur any loss due to my jewelry, I will take the lead and repair it myself. I / We shall be bound by the legal decision in case of default.",
    headnew: " Customer signature",
    head19: "All this is verified in my view",
    head20: "MANAGER Signature................................................",
    head21: "LEGAL Signature..................................................",
    head22: "Thus,Left Thumbprint ",
    head23:
      "JEWELRY APPRAISER Signature..........................................................",
    head24: "Date :",
    head25: "Place :",
    head26: "Witness: 1.",
    head27: "Witness: 2.",
  },
  tamil: {
    title: "கோல்டு பைனான்ஸ்",
    address:
      "135/5, வேலவன் காம்ப்ளக்ஸ், (M.G.N லாட்ஜ் அருகில்) சேலம் மெயின் ரோடு, கொமாரபாளையம் - 638 183, நாமக்கல் Dt",
    pledgeDetails:
      "காவல்துறை மற்றும் நிறுவனத்திற்கான தங்கம் அடகு / விற்பனை உறுதிமொழி பத்திரம்",
    sender: "அனுப்புநர்",
    receiver: "உயர்திரு",
    details: "அடகு / விற்பனை விபரம்",
    inspector: "காவல் ஆய்வாளர் அவர்கள், காவல் நிலையம்",
    otherBankName: "பிற வங்கியின் பெயர்/ஊர்",
    otherBankAmount: "பிற வங்கியில் கட்டிய தொகை",
    pledgeAmount: "நகைக்கடன் தொகை",
    saleAmount: "நகை விற்பனை தொகை",
    goldWeight: "தங்கத்தின் எடை",
    serviceCharge: "சேவை கட்டணம்",
    amountGiven: "வாடிக்கையாளரிடம் கொடுத்த தொகை",
    signature: "வாடிக்கையாளர் கையொப்பம்",
    signatures:
      "   நான் கொடுத்த ஆவணத்தின் அடிப்படையில் எனது தேவைக்காக தாங்கள் கொண்டு வரும் பணத்திற்கு முழு பொறுப்பையும் ஏற்கின்றோம் / றேன்.",
    head1: "அடகு / விற்பனை ஆவணங்கள் - சரிபார்க்கும் - பட்டியல் - (checklist)",
    head2: "1. வாடிக்கையாளர் உண்மை தன்மை - சரிபார்க்கப்பட்டது",
    head3: "2. நகைகளின் தரம் - சரிபார்க்கப்பட்டது ",
    head4:
      "3. வாடிக்கையாளர் அலைபேசி எண் - சரிபார்க்கப்பட்டது (வாடிக்கையாளர் இருக்கும்போது அன்றை தினமே நேரடியாக டயல் செய்து பார்த்து சரி செய்யப்பட்டது)",
    head5:
      "4.  வாடிக்கையாளர் தொழில் சான்று / வேலை சான்று - சரிபார்க்கப்பட்டு இணைக்கப்பட்டுள்ளது.",
    head6:
      "5. வாடிக்கையாளர் முகவரி சான்று (Address Proof) - சரிபார்க்கப்பட்டது.",
    head7: "6. வாடிக்கையாளர் புகைப்படம் (Customer Photo) - இணைக்கப்பட்டுள்ளது.",
    head8: "7. கொள்முதல் பொருள்களின் படம் (Jewel Photo) - இணைக்கப்பட்டுள்ளது.",
    head9: "8. வாடிக்கையாளர் கைரேகை (Sign & Thumb Impress) - பெறப்பட்டுள்ளது.",
    head10:
      "9. வங்கி கணக்கு புத்தகம் நகல் (Bank Pass Book Copy) - இணைக்கப்பட்டுள்ளது .",
    head11:
      "10. சாட்சி கையொப்பம் சான்று (Witness Proof) -  இணைக்கப்பட்டுள்ளது .",
    head12:
      "11. கொள்முதல் விண்ணப்பம் ஒப்பந்தம் (Application Agreement) - இணைக்கப்பட்டுள்ளது",
    head13:
      "12. அடகு நகை மீட்பு விண்ணப்பம் மற்றும் ஒப்பந்தம் (Takeover Application Agreement) -  இணைக்கப்பட்டுள்ளது.",
    head14:
      "13. வாடிக்கையாளர் அடகு / கடன் அட்டை நகல் (Loan - Jewel Token Copy) -  இணைக்கப்பட்டுள்ளது.",
    head15:
      "14. அடகு நகை மீட்ட ரசீது (Loan - Jewel  Release Receipt) -  இணைக்கப்பட்டுள்ளது.",
    head16:
      "ஐயா, ....................................................................................................................... முகவரியில் வசித்துவரும் நான் என்னால் கிரையம் பெற்று என்னுடைய அனுபவத்தில் உள்ளதும், எனக்கு சொந்தமான கீழ்கண்ட தங்க நகைகளை தங்கள் நிறுவனத்தில் ............................. ரூபாய்க்கு ........................... தேதியில் ................................எடை கொண்ட பொருட்களை (தங்கம் / வெள்ளி) தங்கள் நிறுவனத்தில் விற்பனை / நகைக்கடன் செய்துள்ளேன். என்னுடைய விற்பனை / நகைக்கடன் விபரங்களை தாங்கள் காவல்துறை விசாரணைக்கு தேவைப்படும் பட்சத்தில், நான் / நாங்கள் விற்பனை / நகைக்கடன் செய்த தங்க நகைகளின் விபரங்கள், என்னுடைய புகைப்படம், என்னுடைய சுய விபரங்களை அளிப்பதில் எனக்கு எந்தவித ஆட்சேபனையும் கிடையாது. இந்த தங்க நகைகள் சட்டத்திற்கு புறம்பான வகையில் பெறப்பட்டதாக பின்வரும் நாட்களில் அறியப்பட்டு அதனால் ஏற்படும் சகல விதமான இழப்புகள், நஷ்டங்களை என்னுடைய பிற சொத்துக்களை கொண்டோ, வாரிசுகள் (அ) சொந்தங்கள் மூலம் அதை ஈடு செய்வேன் என்று மனபூர்வமான சம்மதத்துடன் தெரிவித்துக்கொள்கிறேன் / கிறோம். தவறும் பட்சத்தில் தாங்களும், காவல்துறையும் தனித்தனியாக எடுக்கும் சட்ட நடவடிக்கைகளுக்கு நானும், எனது வாரிசுகளும், குடும்பத்தினர்களும் கட்டுப்படுவோம் என மனப்பூர்வமாக என்னுடைய சுய சிந்தனையில் நான் படித்து பார்த்து சரியென்று ஓப்புக்கொண்டு புகைப்படத்துடன் இந்த உறுதிமொழி பத்திரத்தில் கையெழுத்தும், கைரேகையும் செய்துள்ளேன். ",
    head17: "சிறப்பு நகைக்கடன்",
    head18:
      "தங்கள் நிறுவனத்தில் இருந்து நகைக்கடன் JL ................................. கால தவணைக்கு தொகை ரூ.................................. நகைக்கடன் பெற்றுள்ளேன். மேற்கொண்டு தாங்கள் நகையின் மதிப்பு கால தவணைக்கு மட்டும் ஏற்றதாக இருக்கும் காரணத்தினால் தாங்கள் கொடுத்த கால தவணைக்குள் நான் / நாங்கள் வட்டி முழுவதும் அல்லது அசல் முழுவதும் கட்டி திருப்பிக் கொள்கிறோம். தவறும் பட்சத்தில் தாங்கள் எந்த விதமான முன் அறிவிப்பு இல்லாமல் எனது நகையை ஏலம் விட்டு  தங்களுக்கு தரவேண்டிய தொகையை எடுத்துக் கொள்ளுமாறு தங்களுக்கு உறுதியளிக்கிறேன். மேற்கொண்டு எனது நகைக்கடனால் தங்களுக்கு நஷ்டம் ஏற்பட்டால் நானே முன்நின்று சரி செய்து கொடுக்கிறேன். தவறும் பட்சத்தில் சட்ட ரீதியாக எடுக்கும் முடிவுக்கு நான் / நாங்கள் கட்டுப்படுகிறோம்.  ",
    headnew: "வாடிக்கையாளர் கையொப்பம்",
    head19: "இவை அனைத்தும் எனது பார்வையில் சரிபார்க்கப்பட்டது",
    head20: "MANAGER signature...............................................",
    head21: "LEGAL Signature..................................................",
    head22: " இப்படிக்கு,இடது பெருவிரல் ரேகை",
    head23:
      "JEWELRY APPRAISER Signature..........................................................",
    head24: "நாள்:",
    head25: "இடம்:",
    head26: "சாட்சி: 1.",
    head27: "சாட்சி: 2.  ",
  },
};

const Repledge = () => {
  const [formData, setFormData] = useState({
    date: "",
    customerId: "",
    customerName: "",
    fatherName: "",
    address: "",
    aadhaarNumber: "",
    mobileNumber: "",
    occupation: "",
    interestRate: "",
    tenure: "",
    amount: "",
    goldSaleNo: "",
    saleAmount: "",
    grossWeight: "",
    goldWeight: "",
    netWeight: "",
    otherBankName: "",
    otherBankAmount: "",
    pledgeAmount: "",
    serviceCharge: "",
    amountGiven: "",
    goodsDescription: "",
    quantity: "",
    purity: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
 
  };
  const [selectedLanguage, setSelectedLanguage] = useState("tamil");

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };
  const today = dayjs().format("YYYY-MM-DD");
  const t = translations[selectedLanguage];
  const handlePrint = () => {
    window.print();
  };
 

  const [open, setOpen] = useState(false);

  const [entries, setEntries] = useState([]);

  const handleClickOpen = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/repledge/entries`
      );
      setEntries(response.data);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching entries:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue fetching the entries. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/repledge/add`,
        formData
      );
      console.log("Entry added:", response.data);
      Swal.fire({
        title: "Success!",
        text: "Entry has been added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error adding entry:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue adding the entry. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/repledge/entries`);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };
  const [selectedLoanNumber, setSelectedLoanNumber] = useState("");
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "loanNo") {
      setSelectedLoanNumber(value);
      fetchReportData(value);
    }

    if (name === "customerId") {
      fetchReportData(value);
    }
  };
  useEffect(() => {
    if (formData.customerId) {
      fetchLoanNumbers(formData.customerId);
    }
  }, [formData.customerId]);
  const [loanNumbers, setLoanNumbers] = useState([]);
  const fetchLoanNumbers = (customerId) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/loans/${customerId}`)
      .then((response) => {
        setLoanNumbers(response.data);
        console.log("Loan Numbers:", response.data); 
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
        console.log("Fetched report data:", reportData);
  
        console.log("Fetched Customer ID:", reportData.customerId);
  
        const formattedDate = new Date(reportData.date).toISOString().split("T")[0];
        const formattedLastDateForLoan = new Date(reportData.lastDateForLoan).toISOString().split("T")[0];
  
        setFormData((prevData) => ({
          ...prevData,
          date: reportData.date ? new Date(reportData.date).toISOString().split("T")[0] : prevData.date,
          customerId: reportData.customerId || prevData.customerId,
          customerName: reportData.customerName || prevData.customerName,
          fatherName: reportData.fatherName || prevData.fatherName,
          address: reportData.address || prevData.address,
          aadhaarNumber: reportData.aadhaarNumber || prevData.aadhaarNumber,
          mobileNumber: reportData.mobileNumber1 || prevData.mobileNumber,
          occupation: reportData.occupation || prevData.occupation,
          interestRate: reportData.interestRate || prevData.interestRate,
          tenure: reportData.tenure || prevData.tenure,
          amount: reportData.loanAmount || prevData.amount,
          goldSaleNo: reportData.goldSaleNo || prevData.goldSaleNo,
          saleAmount: reportData.saleAmount || prevData.saleAmount,
          grossWeight: reportData.gw || prevData.grossWeight,
          goldWeight: reportData.goldWeight || prevData.goldWeight,
          netWeight: reportData.nw || prevData.netWeight,
          otherBankName: reportData.otherBankName || prevData.otherBankName,
          otherBankAmount: reportData.otherBankAmount || prevData.otherBankAmount,
          pledgeAmount: reportData.pledgeAmount || prevData.pledgeAmount,
          serviceCharge: reportData.serviceCharge || prevData.serviceCharge,
          amountGiven: reportData.amountGiven || prevData.amountGiven,
          goodsDescription: reportData.jDetails || prevData.goodsDescription,
          quantity: reportData.quantity || prevData.quantity,
          purity: reportData.quality || prevData.purity,
        }));
        console.log("Last date for loan:", formattedLastDateForLoan);
      })
      .catch((error) => {
        console.error("Error fetching report data:", error);
      });
  };
  
  return (
    <>
      <Paper
        elevation={2}
        style={{ padding: "20px" }}
        sx={{ maxWidth: 800, margin: "auto", mt: 0 }}
        className="aggre"
      >
        <form onSubmit={handleSubmit}>
          <Box p={3}>
            <Grid item xs={12} align="center" sx={{ mt: -6 }}>
              <img
                src={image}
                alt="Logo"
                style={{ width: "20%", height: "auto" }}
              />
            </Grid>
            <Typography
              variant="h2"
              className="titles"
              align="center"
              sx={{ mt: -2 }}
            >
              {t.title}
            </Typography>
            <Typography align="center" className="tit">
              {t.address}
            </Typography>
            <Typography align="center" className="tit">
              {t.pledgeDetails}
            </Typography>
            <Typography variant="h6" className="title">
              {t.sender}
            </Typography>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="language-select-label">Language</InputLabel>
                  <Select
                    labelId="language-select-label"
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label={
                    selectedLanguage === "tamil"
                      ? "வாடிக்கையாளர் ஐடி"
                      : "Customer Id"
                  }
                  variant="standard"
                  fullWidth
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="textField"
                  error={!!validationErrors.customerId}
                  helperText={validationErrors.customerId}
                />
              </Grid>
              <Grid item xs={12} sm={6} >
      <TextField
        select
        label={selectedLanguage === "tamil" ? "கடன் எண்" : "Loan Number"}
        name="loanNo"
        value={formData.loanNo}
        onChange={handleInputChange}
        variant="standard"
        fullWidth
        SelectProps={{
          native: false, // Make sure SelectProps is not set to native
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "black",
            },
          },
        }}
        error={!!validationErrors.loanNo}
        helperText={validationErrors.loanNo}
      >
        {/* Default option */}
        <MenuItem value="">
      
        </MenuItem>
        {/* Dynamic loan numbers */}
        {loanNumbers.map((loan) => (
          <MenuItem key={loan.loanNumber} value={loan.loanNumber}>
            {loan.loanNumber}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={selectedLanguage === "tamil" ? "பெயர்" : "Name"}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  error={!!validationErrors.customerName}
                  helperText={validationErrors.customerName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={
                    selectedLanguage === "tamil"
                      ? "த / க. பெயர்"
                      : "Father/Husband Name"
                  }
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  error={!!validationErrors.fatherName}
                  helperText={validationErrors.fatherName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={selectedLanguage === "tamil" ? "தேதி" : "Date"}
                  type="date"
                  name="date"
                  variant="standard"
                  fullWidth
                  className="textField"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.date}
                  onChange={handleChange}
                  error={!!validationErrors.date}
                  helperText={validationErrors.date}
                  InputProps={{
                    inputProps: {
                      // Set min and max date to today's date
                      min: today,
                      max: today,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={selectedLanguage === "tamil" ? "முகவரி" : "Address"}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={!!validationErrors.address}
                  helperText={validationErrors.address}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={
                    selectedLanguage === "tamil"
                      ? "ஆதார் எண்"
                      : "Aadhaar Number"
                  }
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  error={!!validationErrors.aadhaarNumber}
                  helperText={validationErrors.aadhaarNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={
                    selectedLanguage === "tamil"
                      ? "மொபைல் எண்"
                      : "Mobile Number"
                  }
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  error={!!validationErrors.mobileNumber}
                  helperText={validationErrors.mobileNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={selectedLanguage === "tamil" ? "தொழில்" : "Occupation"}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  error={!!validationErrors.occupation}
                  helperText={validationErrors.occupation}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={
                    selectedLanguage === "tamil"
                      ? "வட்டி விகிதம்"
                      : "Interest Rate"
                  }
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  error={!!validationErrors.interestRate}
                  helperText={validationErrors.interestRate}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={selectedLanguage === "tamil" ? "கால தவணை" : "Tenure"}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                  error={!!validationErrors.tenure}
                  helperText={validationErrors.tenure}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={selectedLanguage === "tamil" ? "தொகை" : "Amount"}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  error={!!validationErrors.amount}
                  helperText={validationErrors.amount}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={
                    selectedLanguage === "tamil"
                      ? "நகை விற்பனை No"
                      : "Gold Sale No"
                  }
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="goldSaleNo"
                  value={formData.goldSaleNo}
                  onChange={handleChange}
                  error={!!validationErrors.goldSaleNo}
                  helperText={validationErrors.goldSaleNo}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={
                    selectedLanguage === "tamil"
                      ? "எடை: G.W..... "
                      : "Weight: G.W..... "
                  }
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="grossWeight"
                  value={formData.grossWeight}
                  onChange={handleChange}
                  error={!!validationErrors.grossWeight}
                  helperText={validationErrors.grossWeight}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={
                    selectedLanguage === "tamil"
                      ? "எடை: N.W......"
                      : "Weight: N.W......"
                  }
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="netWeight"
                  value={formData.netWeight}
                  onChange={handleChange}
                  error={!!validationErrors.netWeight}
                  helperText={validationErrors.netWeight}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" className="title-1">
                  {t.receiver}
                </Typography>
                <Typography className="title-1">{t.address}</Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <Typography variant="h8" className="title-1">
                  {t.receiver}
                </Typography>
                <br />
                <Typography variant="h8" className="title-1">
                  {t.inspector}
                </Typography>
                <TextField
                  label=""
                  variant="standard"
                  fullWidth
                  className="textField"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.otherBankName}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="otherBankName"
                  value={formData.otherBankName}
                  onChange={handleChange}
                  error={!!validationErrors.otherBankName}
                  helperText={validationErrors.otherBankName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.otherBankAmount}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="otherBankAmount"
                  value={formData.otherBankAmount}
                  onChange={handleChange}
                  error={!!validationErrors.otherBankAmount}
                  helperText={validationErrors.otherBankAmount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.pledgeAmount}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="pledgeAmount"
                  value={formData.pledgeAmount}
                  onChange={handleChange}
                  error={!!validationErrors.pledgeAmount}
                  helperText={validationErrors.pledgeAmount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.saleAmount}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="saleAmount"
                  value={formData.saleAmount}
                  onChange={handleChange}
                  error={!!validationErrors.saleAmount}
                  helperText={validationErrors.saleAmount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.goldWeight}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="goldWeight"
                  value={formData.goldWeight}
                  onChange={handleChange}
                  error={!!validationErrors.goldWeight}
                  helperText={validationErrors.goldWeight}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t.serviceCharge}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="serviceCharge"
                  value={formData.serviceCharge}
                  onChange={handleChange}
                  error={!!validationErrors.serviceCharge}
                  helperText={validationErrors.serviceCharge}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t.amountGiven}
                  variant="standard"
                  fullWidth
                  className="textField"
                  name="amountGiven"
                  value={formData.amountGiven}
                  onChange={handleChange}
                  error={!!validationErrors.amountGiven}
                  helperText={validationErrors.amountGiven}
                />
              </Grid>

              <Grid item xs={12} align="center">
                <Typography variant="h8" className="title-1">
                  {t.signature}
                </Typography>
                <br />
                <Typography variant="h8" className="title-1">
                  {t.signatures}
                </Typography>
                <TextField
                  label=""
                  variant="standard"
                  fullWidth
                  className="textField"
                />
              </Grid>
              <Typography variant="h6" className="title">
                {selectedLanguage === "tamil"
                  ? "அடகு / விற்பனை விபரம்"
                  : "Pledge / Sale Details"}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ border: "1px solid black", width: 290 }}
                        className="textField"
                      >
                        {selectedLanguage === "tamil"
                          ? "பொருட்களின் விபரம்"
                          : "Description of Goods"}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        className="textField"
                      >
                        {selectedLanguage === "tamil"
                          ? "எண்ணிக்கை"
                          : "Quantity"}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        className="textField"
                      >
                        {selectedLanguage === "tamil" ? "தரம்" : "Purity"}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        className="textField"
                      >
                        {selectedLanguage === "tamil"
                          ? "மொத்த ஏடை"
                          : "Gross Weight"}
                      </TableCell>
                      <TableCell
                        sx={{ border: "1px solid black" }}
                        className="textField"
                      >
                        {selectedLanguage === "tamil"
                          ? "நிகர எடை"
                          : "Net Weight"}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          className="textField"
                          name="goodsDescription"
                          onChange={handleChange}
                          value={formData.goodsDescription}
                          error={!!validationErrors.goodsDescription}
                          helperText={validationErrors.goodsDescription}
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          className="textField"
                          name="quantity"
                          onChange={handleChange}
                          value={formData.quantity}
                          error={!!validationErrors.quantity}
                          helperText={validationErrors.quantity}
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          className="textField"
                          name="purity"
                          value={formData.purity}
                          onChange={handleChange}
                          error={!!validationErrors.purity}
                          helperText={validationErrors.purity}
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          className="textField"
                          onChange={handleChange}
                          name="grossWeight"
                          value={formData.grossWeight}
                          error={!!validationErrors.grossWeight}
                          helperText={validationErrors.grossWeight}
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid black" }}>
                        <TextField
                          label=""
                          variant="outlined"
                          fullWidth
                          className="textField"
                          name="netWeight"
                          value={formData.netWeight}
                          onChange={handleChange}
                          error={!!validationErrors.netWeight}
                          helperText={validationErrors.netWeight}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Box>{" "}
        </form>
      </Paper>
      <Paper
        elevation={2}
        style={{ padding: "20px" }}
        sx={{ maxWidth: 800, margin: "auto", mt: 7 }}
        className="aggre"
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6" className="title-1">
              {t.head1}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head2}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head3}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head4}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head5}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head6}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head7}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head8}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head9}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head10}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head11}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head12}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head13}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head14}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Checkbox color="success" />
            <Typography variant="h8" className="title-1">
              {t.head15}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h8" className="title-1">
              {t.head16}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h8" className="title-1">
              {t.head17}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sx={{ mt: 5 }}>
            <Typography variant="h8" className="title-1">
              {t.head18}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sx={{ mt: 5 }}>
            <Typography variant="h8" className="title-1">
              {t.headnew}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} align="center" sx={{ mt: 5 }}>
            <Typography variant="h3" className="title-1">
              {t.head19}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
            <Typography variant="h3" className="title-1">
              {t.head20}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
            <Typography variant="h3" className="title-1">
              {t.head21}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
            <Typography variant="h3" className="title-1">
              {t.head22}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
            <Typography variant="h3" className="title-1">
              {t.head23}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 4 }}>
            <Typography variant="h3" className="title-1">
              {t.head24}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 4 }}>
            <Typography variant="h3" className="title-1">
              {t.head25}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
            <Typography variant="h3" className="title-1">
              {t.head26}
            </Typography>{" "}
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
            <Typography variant="h3" className="title-1">
              {t.head27}
            </Typography>{" "}
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }} sx={{ mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            className="print-button"
          >
            PRINT
          </Button>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }} sx={{ mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="print-button sub-print"
          >
            Submit
          </Button>
        </Grid>
      </Paper>
      <Grid xs={12} align="center" sx={{ mt: 2, mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleClickOpen}>
          View Repledge
        </Button>
      </Grid>
      <RepledgeDialog
        open={open}
        handleClose={handleClose}
        entries={entries}
        fetchEntries={fetchEntries}
      />
    </>
  );
};

export default Repledge;
