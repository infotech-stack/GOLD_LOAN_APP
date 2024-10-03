import React, { useState ,useEffect} from 'react';
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import AppNavbar from '../Navbar/Navbar';
import { Grid, Paper, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faUsers, faMoneyBill, faCreditCard, faWallet, faClipboardList, faUserPlus, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { BalanceContext } from "../Reminders/BalanceContext";
import  { useContext} from "react";
import './Dashboard.css'
const Dashboard = () => {
  const { openingBalance, closingBalance } = useContext(BalanceContext);


  const [filteredEntries, setFilteredEntries] = useState([]);
 
  const { adminId, logout } = useAuth();

  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [expensesCount, setExpensesCount] = useState(0);
  const [loanEntriesCount, setLoanEntriesCount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState('');
const[numberOfEntries,setNumberOfEntries]=useState('0');
const[numberOfEntries1,setNumberOfEntries1]=useState('0');
  const [totalRupees, setTotalRupees] = useState(0); 
  const [lglCount, setLglCount] = useState(0);
  const [mglCount, setMglCount] = useState(0);
  const [hglCount, setHglCount] = useState(0);
  const[liveCount,setLiveCount]=useState('0');
  const[closedCount,setClosedCount]=useState('0');
const [salaryamt, setSalaryAmt ] = useState(0);
  const [voucheramt, setVoucherAmt] = useState(0);
  const [appraisalamt, setAppraisalAmt ] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vouchersRes, expensesRes, loanEntriesRes, salaryRes, customerEntriesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/vouchers/all`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/expenses`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/all`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/salary`), // Separate salary API
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/all`), // Add customer entries API
        ]);
  
        // Get current month and year
        const today = new Date();
        const currentMonth = today.getMonth(); // Current month (0-11)
        const currentYear = today.getFullYear(); // Current year
  
        // 1. Calculate day-to-day expenses for the current month
        const monthlyExpenses = expensesRes.data.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        });
        const totalRupeesForMonth = monthlyExpenses.reduce((total, entry) => total + (entry.totalRupees || 0), 0);
        setTotalRupees(totalRupeesForMonth);
  
        // 2. Calculate total salary for the current month
        const totalSalaryForMonth = salaryRes.data.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        }).reduce((total, entry) => total + (entry.salaryAmount || 0), 0);
        setSalaryAmt(totalSalaryForMonth);
  
        // 3. Calculate voucher amounts for the current month
        const monthlyVouchers = vouchersRes.data.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        });
        const totalVouchersForMonth = monthlyVouchers.reduce((total, entry) => total + Number(entry.amount || 0), 0);
        setVoucherAmt(totalVouchersForMonth);
  
// Filter loan entries for the current month
const monthlyLoanEntries = loanEntriesRes.data.filter(entry => {
  const entryDate = new Date(entry.paymentDate);
  return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
});

// Initialize counters and totals
let liveCount = 0;
let closedCount = 0;
let totalAppraisalForMonth = 0;

// Iterate through the filtered entries
monthlyLoanEntries.forEach(entry => {
  const interestAmount = Number(entry.interestamount) || 0; // Assuming interestAmount is the correct field
  const interestPrinciple = Number(entry.interestPrinciple) || 0;

  // Add to the total appraisal
  totalAppraisalForMonth += interestAmount + interestPrinciple;

  // Check balance to determine if it's live or closed
  const lastBalance = Number(entry.balance) || 0; // Assuming balance is a property in your entries
  if (lastBalance === 0) {
    closedCount += 1; // Increment closed count
  } else {
    liveCount += 1; // Increment live count
  }
});

// Set states for display
setLiveCount(liveCount);     // Assuming you have this state
setClosedCount(closedCount); // Assuming you have this state
setAppraisalAmt(totalAppraisalForMonth); // Set the total appraisal amount

console.log("Total Number of Live Entries:", liveCount);
console.log("Total Number of Closed Entries:", closedCount);
console.log("Total Appraisal for the Month:", totalAppraisalForMonth);


  
// 5. Count total customer entries for the current month
const monthlyCustomerEntries = customerEntriesRes.data.filter(entry => {
  const entryDate = new Date(entry.date); // Ensure this is the correct date field
  return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
});

// Initialize counts for each schema
let lglCount = 0;
let mglCount = 0;
let hglCount = 0;

// Count entries based on schema
monthlyCustomerEntries.forEach(entry => {
  if (entry.schema === 'LGL') {
    lglCount++;
  } else if (entry.schema === 'MGL') {
    mglCount++;
  } else if (entry.schema === 'HGL') {
    hglCount++;
  }
});

// Set state or log the counts
setNumberOfEntries1(monthlyCustomerEntries.length);
setLglCount(lglCount); // Set the LGL count
setMglCount(mglCount); // Set the MGL count
setHglCount(hglCount); 
console.log("Total Number of Customer Entries for Current Month:", monthlyCustomerEntries.length);



      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  
  
  
  



  useEffect(() => {
    const today = new Date();
    const options = { month: 'long', year: 'numeric' };
    setCurrentMonth(today.toLocaleDateString('en-US', options)); // e.g., "September 2024"
  }, []);
  
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/all`)
      .then((response) => {
        const formattedData = response.data.reverse(); 
        setLedgerEntries(formattedData); 
        setFilteredEntries(formattedData); 
      
        const entriesCount = formattedData.length;
        setNumberOfEntries(entriesCount); // Update the state with the number of entries
      })
      .catch((error) => {
        console.error("Error fetching ledger entries:", error);
      });
  }, []);
  


  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString();
  const formattedDay = time.toLocaleDateString('en-US', { weekday: 'long' });
  
    
  return (
    <div>
     
     <Container >
        <Row>
          <Col lg={2} className="d-none d-lg-block sidebar-wrapper">
            <Sidebar isOpen={false} />
          </Col>
          <Col lg={15} className="main-content">
          <Grid container spacing={3} sx={{ mt:0 }}>
              {/* Time Paper Component */}
              <Grid item xs={12} md={4}>
                <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#F3CFC6' }}>
                  <Typography variant="h6" gutterBottom style={{ textAlign: 'center', marginBottom: '10px',color:'rgb(7, 101, 70)',fontWeight:'550' }}>
                     Time
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    {time.toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Grid>
              {/* Date Paper Component */}
              <Grid item xs={12} md={4}>
                <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#F3CFC6' }}>
                  <Typography variant="h6" gutterBottom style={{ textAlign: 'center', marginBottom: '10px' ,color:'blue',fontWeight:'550' }}>
                   Date
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    {formattedDate}
                  </Typography>
                </Paper>
              </Grid>
              {/* Day Paper Component */}
              <Grid item xs={12} md={4}>
                <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#F3CFC6' }}>
                  <Typography variant="h6" gutterBottom style={{ textAlign: 'center', marginBottom: '10px' ,color:'red',fontWeight:'550' }}>
                  Day
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    {formattedDay}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{mt:2}}>
          
              {/* Dashboard Summary Card */}
              <Grid item xs={12} sm={3} md={3}>
                <Paper elevation={3} className="p-3 dash_card" style={{ height: '200px', marginTop: '5px' }}>
                  <FontAwesomeIcon icon={faChartBar} size="3x" style={{ marginBottom: '10px' }} className='dashb-icon'/>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
                  Admin
                  </Typography>
                  <Typography variant="h6" > {adminId}</Typography>
                
                </Paper>
              </Grid>
              {/* Customer Summary Card */}
              <Grid item xs={12} sm={3} md={3}>
                <Paper elevation={3} className="p-3 dash_card" style={{ height: '200px', marginTop: '5px' }} >
                  <FontAwesomeIcon icon={faUsers} size="3x" style={{ marginBottom: '10px' }} className='dashb-icon3'/>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
                    Customer
                  </Typography>
                  <Typography variant="h6"> {numberOfEntries}</Typography>

                 
                </Paper>
              </Grid>
              {/* Adagu Summary Card */}
              <Grid item xs={12} sm={3} md={3}>
                <Paper elevation={3} className="p-3 dash_card" style={{ height: '200px', marginTop: '5px' }}>
                  <FontAwesomeIcon icon={faMoneyBill} size="3x" style={{ marginBottom: '10px' }} className='dashb-icon1'/>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
                  Opening Account
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>
                  {openingBalance !== null ? `₹${openingBalance}` : "Loading..."}
                  </Typography>
                 
                </Paper>
              </Grid>
              {/* Payment Summary Card */}
              <Grid item xs={12} sm={3} md={3}>
                <Paper elevation={3} className="p-3 dash_card" style={{ height: '200px', marginTop: '5px' }}>
                  <FontAwesomeIcon icon={faCreditCard} size="3x" style={{ marginBottom: '10px' }} className='dashb-icon2'/>
                  <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
                   Closing Account
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>
                  {closingBalance !== null ? `₹${closingBalance}` : "Loading..."}
                  </Typography>
                 
                </Paper>
              </Grid>
             
            </Grid>
          </Col>
        </Row>
        <Container>
        <Grid item xs={12} >
  <Typography variant="h6" align="center" gutterBottom sx={{mt:3,mb:-3 ,color:'#176FB9',fontWeight:'600'}}>
    {currentMonth}
  </Typography>
</Grid>
<Grid container spacing={3} sx={{ mt: 2 }}>
  {/* Day to Day Expenses */}
  <Grid item xs={12} sm={3}>
    <Paper
      elevation={3}
      className="p-3 dash_card"
      style={{
        height: '200px',
        marginTop: '5px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ backgroundColor: '#ff6f61', borderRadius: '50%', padding: '10px', width: '60px', margin: 'auto' }}>
        <FontAwesomeIcon icon={faWallet} size="2x" color="#ffffff" />
      </div>
      <Typography variant="h6" gutterBottom align="center" style={{ marginTop: '10px' }}>
        Outgoing Amount
      </Typography>
      <Typography align="center">Day to Day : ₹{totalRupees}</Typography>
      <Typography align="center">Salary Payment : ₹{salaryamt}</Typography>
    </Paper>
  </Grid>

  {/* Appraisal Payment */}
  <Grid item xs={12} sm={3}>
    <Paper
      elevation={3}
      className="p-3 dash_card"
      style={{
        height: '200px',
        marginTop: '5px',
        backgroundColor: '#e0f7fa',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ backgroundColor: '#00796b', borderRadius: '50%', padding: '10px', width: '60px', margin: 'auto' }}>
        <FontAwesomeIcon icon={faClipboardList} size="2x" color="#ffffff" />
      </div>
      <Typography variant="h6" gutterBottom align="center" style={{ marginTop: '10px' }}>
        Incoming Amount
      </Typography>
      <Typography align="center">Appraisal Payment : ₹{appraisalamt}</Typography>
      <Typography align="center">MD Voucher : ₹{voucheramt}</Typography>
    </Paper>
  </Grid>

  {/* Total Customer Entry */}
  <Grid item xs={12} sm={3}>
    <Paper
      elevation={3}
      className="p-3 dash_card"
      style={{
        height: '200px',
        marginTop: '5px',
        backgroundColor: '#fff3e0',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ backgroundColor: '#ffb300', borderRadius: '50%', padding: '10px', width: '60px', margin: 'auto' }}>
        <FontAwesomeIcon icon={faUserPlus} size="2x" color="#ffffff" />
      </div>
      <Typography variant="h6" gutterBottom align="center" style={{ marginTop: '10px' }}>
        Total Customer Entry
      </Typography>
      <Typography  align="center">
        {numberOfEntries1}
      </Typography>
    </Paper>
  </Grid>

  {/* Detailed Customer Entry Counts */}
  <Grid item xs={12} sm={3}>
    <Paper
      elevation={3}
      className="p-3 dash_card"
      style={{
        height: '200px',
        marginTop: '5px',
        backgroundColor: '#fff3e0',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ backgroundColor: '#913B00', borderRadius: '50%', padding: '10px', width: '60px', margin: 'auto' }}>
        <FontAwesomeIcon icon={faUsers} size="2x" color="#ffffff" /> {/* Change to a different schema icon */}
      </div>
      <Typography variant="h6" gutterBottom align="center" style={{ marginTop: '10px' }}>
        Customer Entry Breakdown
      </Typography>
      <Typography  align="center">
        LGL: {lglCount} ,
        MGL: {mglCount} ,
        HGL: {hglCount}<br />
        Live: {liveCount} ,
        Closed: {closedCount}
      </Typography>
    </Paper>
  </Grid>
</Grid>


    </Container>
      </Container>
    </div>
  );
};

export default Dashboard;
