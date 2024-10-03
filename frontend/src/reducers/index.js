// reducers/index.js
import { combineReducers } from 'redux';
import customerReducer from './customerReducer'; 
import customerSlice from './customerSlice';
const rootReducer = combineReducers({
  customerData: customerReducer,
  customer: customerSlice,
});

export default rootReducer;

