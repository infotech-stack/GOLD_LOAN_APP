// PrintTable.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PrintTable = ({ data }) => {
  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: '1px solid black' }}>Customer ID</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Loan Number</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Date</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Customer Name</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Mobile Number</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Jewel Number</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Alter Mob.No</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Landmark</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Address</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Jewel Details</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Quality</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Quantity</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Itemweight</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Grossweight</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Netweight</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Schema</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Percent</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Loan Amount</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Download Proof</TableCell>
            <TableCell sx={{ border: '1px solid black' }}>Payment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry._id}>
              <TableCell sx={{ border: '1px solid black' }}>{entry.customerId}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.loanNumber}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.date}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.customerName}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.mobileNumber1}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.mobileNumber2}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.landmark}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.address}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.jDetails}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.quality}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.quantity}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.iw}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.gw}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.nw}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.schema}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.percent}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{entry.loanAmount}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{/* Add download proof if applicable */}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>{/* Add payment button if applicable */}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PrintTable;
