// src/selectors/customerSelectors.js
import { createSelector } from 'reselect';

const selectCustomerData = state => state.customerData;

export const makeSelectCustomerDetails = () => createSelector(
  [selectCustomerData],
  customerData => customerData.customerDetails || {}
);

export const makeSelectPaymentEntries = () => createSelector(
  [selectCustomerData],
  customerData => customerData.paymentEntries || []
);
