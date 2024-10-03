// src/reducers/customerSlice.js (Updated)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerDetails: null,
  paymentEntries: [],
  error: null,
  isDialogOpen: false,
  selectedEntry: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerDetails: (state, action) => {
      state.customerDetails = action.payload;
    },
    setPaymentEntries: (state, action) => {
      state.paymentEntries = action.payload;
    },
    fetchPaymentEntriesFailure: (state, action) => {
      state.error = action.payload;
    },
    openDialog: (state, action) => {
      state.isDialogOpen = true;
      state.selectedEntry = action.payload;
    },
    closeDialog: (state) => {
      state.isDialogOpen = false;
      state.selectedEntry = null;
    },
  },
});

export const {
  setCustomerDetails,
  setPaymentEntries,
  fetchPaymentEntriesFailure,
  openDialog,
  closeDialog,
} = customerSlice.actions;
export default customerSlice.reducer;

