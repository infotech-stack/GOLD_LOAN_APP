import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Dashboard from "./Dashboard/Dashboard";
import Login from "./Login/Login";
import Master from "./Master/Master";
import AddedAdm from "./Added_admin/Added_adm";
import Customer from "./Customer/Customer";
import Repledge from "./Repledge/Repledge";
import Accounts from "./Expenses/daytoday";
import Reminders from "./Reminders/Reminders";
import Books from "./Books/Books";
import Tools from "./Tools/Tools";
import { AuthProvider } from "./AuthContext";
import AddAdminPage from "./Newrootadmin/Newrootadmin";
import GoldLoanSchema from "./Master/Goldloanschema";
import GoldLoanAmount from "./Master/GoldloanAmount";
import GoldLoanCategory from "./Master/Goldcategory";
import User from "./User/User";
import Branch from "./Branch/Branch";
import Voucher from "./Voucher/Voucher";
import Employee from "./Employee/Employee";
import Report from "./Report/Report";
import LoanRetrieved from "./Loan Retrieved/LoanRetrived";
import Salary from "./Expenses/Salary";
import { BalanceProvider } from "../src/Reminders/BalanceContext";
import ProtectedRoute from "./ProtectedRoute";
import CustomerDashboard from "./Cust_dashboard/cust_dashboard";
import { LedgerProvider } from './LedgerContext';
import Editmaster from "./Customer/editmaster";
function App() {
  const [permissions, setPermissions] = useState([]);

  return (
    <AuthProvider>
      <BalanceProvider>
      <LedgerProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cust_dashboard" element={<CustomerDashboard />} />
            <Route path="/login" element={<Login setPermissions={setPermissions} />} />
            <Route element={<Layout permissions={permissions} />}>
              <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
              <Route path="/master" element={<ProtectedRoute element={Master} />} />
              <Route path="/edit_master" element={<ProtectedRoute element={Editmaster} />} />
              <Route path="/master/loan" element={<ProtectedRoute element={GoldLoanSchema} />} />
              <Route path="/master/amount" element={<ProtectedRoute element={GoldLoanAmount} />} />
              <Route path="/master/category" element={<ProtectedRoute element={GoldLoanCategory} />} />
              <Route path="/added_admin" element={<ProtectedRoute element={AddedAdm} />} />
              <Route path="/customer" element={<ProtectedRoute element={Customer} />} />
              <Route path="/root_man" element={<ProtectedRoute element={User} />} />
              <Route path="/branch" element={<ProtectedRoute element={Branch} />} />
              <Route path="/voucher" element={<ProtectedRoute element={Voucher} />} />
              <Route path="/admin_man" element={<ProtectedRoute element={Employee} />} />
              <Route path="/report" element={<ProtectedRoute element={Report} />} />
              <Route path="/repledge" element={<ProtectedRoute element={Repledge} />} />
              <Route path="/loan_retrieved" element={<ProtectedRoute element={LoanRetrieved} />} />
              <Route path="/expenses" element={<ProtectedRoute element={Accounts} />} />
              <Route path="/expenses/salary-payment" element={<ProtectedRoute element={Salary} />} />
              <Route path="/reminders" element={<ProtectedRoute element={Reminders} />} />
              <Route path="/books" element={<ProtectedRoute element={Books} />} />
              <Route path="/tools" element={<ProtectedRoute element={Tools} />} />
              <Route path="/new_root" element={<ProtectedRoute element={AddAdminPage} />} />
            </Route>
          </Routes>
        </Router>
        </LedgerProvider>
      </BalanceProvider>
    </AuthProvider>
  );
}

export default App;
