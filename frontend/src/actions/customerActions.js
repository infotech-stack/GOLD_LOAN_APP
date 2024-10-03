// src/actions/customerActions.js
import axios from 'axios';

// Existing action for fetching customer details
export const fetchCustomerDetails = (customerId) => async (dispatch) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/all/${customerId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    console.log('Fetched customer details:', data);
    dispatch({ type: 'SET_CUSTOMER_DETAILS', payload: data });
  } catch (error) {
    console.error('Error fetching customer details:', error.message);
    dispatch({ type: 'FETCH_CUSTOMER_DETAILS_FAILURE', payload: error.message });
  }
};

export const fetchPaymentEntries = (loanNumber) => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/loanEntry/byLoanNo/${loanNumber}`);
    console.log("Fetched Entries by Loan Number:", response.data);
    dispatch({ type: 'SET_PAYMENT_ENTRIES', payload: response.data });
    return response.data; // Return the data here
  } catch (error) {
    console.error("Error fetching entries by loan number:", error.message);
    dispatch({ type: 'FETCH_PAYMENT_ENTRIES_FAILURE', payload: error.message });
    throw error; // Rethrow the error if needed
  }
};






