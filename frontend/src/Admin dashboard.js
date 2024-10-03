// AdminDashboard.js

import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const AdminDashboard = () => {
  // Retrieve adminData from localStorage or context
  const adminData = JSON.parse(localStorage.getItem('adminData'));

  return (
    <div>
      <h2>Welcome, {adminData.name}!</h2>
      <h3>Your Permissions:</h3>
      <List>
        {adminData.permissions.map((permission, index) => (
          <ListItem key={index}>
            <ListItemText primary={permission} />
          </ListItem>
        ))}
      </List>
      {/* Display other dashboard components based on permissions */}
    </div>
  );
};

export default AdminDashboard;
