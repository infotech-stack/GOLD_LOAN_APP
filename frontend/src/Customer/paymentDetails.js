// src/components/paymentDetails.js
import React,{useEffect} from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper } from '@mui/material';

  
const PaymentDetails = ({ paymentEntries  }) => {

  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ border: '1px solid black' }}>
        <TableHead sx={{ backgroundColor: "#FFFFC5"}}>
          <TableRow>
            <TableCell sx={{ border: '1px solid black', color: '#02437E', fontWeight: 550 }}>Date</TableCell>
            <TableCell sx={{ border: '1px solid black', color: '#02437E', fontWeight: 550 }}>Loan No</TableCell>
            <TableCell sx={{ border: '1px solid black', color: '#02437E', fontWeight: 550 }}>Customer ID</TableCell>
            <TableCell sx={{ border: '1px solid black', color: '#02437E', fontWeight: 550 }}>No of Days</TableCell>
            <TableCell sx={{ border: '1px solid black', color: '#02437E', fontWeight: 550 }}>Principal Paid</TableCell>
            <TableCell sx={{ border: '1px solid black', color: '#02437E', fontWeight: 550 }}>Interest Paid</TableCell>
            <TableCell sx={{ border: '1px solid black', color: '#02437E', fontWeight: 550 }}>Total Balance</TableCell>
            <TableCell sx={{ border: '1px solid black', color: '#02437E', fontWeight: 550 }}>Balance Principal</TableCell>
            <TableCell sx={{ border: '1px solid black', color: '#02437E', fontWeight: 550 }}>Balance Interest</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paymentEntries.length > 0 ? (
            paymentEntries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell sx={{ border: '1px solid black' }}>{entry.paymentDate}</TableCell>
                <TableCell sx={{ border: '1px solid black' }}>{entry.loanNo}</TableCell>
                <TableCell sx={{ border: '1px solid black' }}>{entry.customerId}</TableCell>
                <TableCell sx={{ border: '1px solid black' }}>{entry.noOfDays}</TableCell>
                <TableCell sx={{ border: '1px solid black' }}>{entry.interestamount}</TableCell>
                <TableCell sx={{ border: '1px solid black' }}>{entry.interestPrinciple}</TableCell>
                <TableCell sx={{ border: '1px solid black' }}>{entry.balance}</TableCell>
                <TableCell sx={{ border: '1px solid black' }}>{entry.loanamountbalance}</TableCell>
                <TableCell sx={{ border: '1px solid black' }}>{entry.interestbalamount}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} sx={{ textAlign: 'center', border: '1px solid black' }}>No entries available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentDetails;
