import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCogs, 
  faUser, 
  faMoneyBillWave, 
  faRedo, 
  faBook, 
  faBell, 
  faTools,
  faCoins, 
  faChartBar,
  faReceipt, faUserShield, faKey 
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { permissions } = useAuth();
  const location = useLocation();

  // State to handle submodule toggle under 'Master Entry'
  const [masterSubOpen, setMasterSubOpen] = useState(false);
  // State to handle submodule toggle under 'Expenses'
  const [expensesSubOpen, setExpensesSubOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: faHome, label: 'Dashboard', permission: 'Dashboard' },
    { 
      path: '/master', icon: faCogs, label: 'Ledger Entry', permission: 'Ledger Entry', 
      submodules: [
        { path: '/master/loan', icon: faCoins, label: 'Gold Loan Schema', permission: 'Ledger Entry' },
     
      ]
    },
    { path: '/customer', icon: faUser, label:'Customer Management', permission: 'Customer Management' },
    { path: '/branch', icon: faMoneyBillWave, label:'Branch Management', permission: 'Branch Management' },
  // { path: '/report', icon: faChartBar, label:'Appraisal Schema', permission: 'Appraisal Schema' },
    { path: '/voucher', icon: faReceipt, label: 'Voucher', permission: 'Voucher' },
    { path: '/repledge', icon: faRedo, label: 'Repledge', permission: 'Repledge' },
    { 
      path: '/expenses', icon: faBook, label: 'Expenses', permission: 'Expenses',
      submodules: [
        { path: '/expenses/salary-payment', icon: faMoneyBillWave, label: 'Salary Payment', permission: 'Expenses' },
      ] 
    },
    { path: '/reminders', icon: faBell, label: 'Day Book', permission: 'Day Book' },
    { path: '/tools', icon: faTools, label: 'MD Voucher', permission: 'MD Voucher' },
    { path: '/books', icon: faBook, label: 'Bill Book', permission: 'Bill Book' },
    { path: '/added_admin', icon: faUserShield, label: 'Added Admin', permission: 'Added Admin' },
    { path: '/new_root', icon: faKey, label: 'RootAdmin Password', permission: 'Added Root' },
    {path:'/cust_dashboard',icon:faHome,label:'Customer Dashboard',permission:'cust_dashboard'},
  ];

  const toggleMasterSubOpen = () => {
    setMasterSubOpen(!masterSubOpen);
  };

  // Function to toggle submodules under 'Expenses'
  const toggleExpensesSubOpen = () => {
    setExpensesSubOpen(!expensesSubOpen);
  };

  return (
    <Nav className={`flex-column sidebar ${isOpen ? 'open' : ''}`}>
      {navItems.map(item => {
        const hasPermission = permissions.includes(item.permission);
        if (!hasPermission) return null;

        const isActive = location.pathname.startsWith(item.path);
        const linkStyle = isActive ? 'nav-link active' : 'nav-link';
        const iconStyle = isActive ? 'icons active' : 'icons';
        const arrowIconStyle = isActive ? 'dropdown-icon active' : 'dropdown-icon';

        return (
          <React.Fragment key={item.path}>
            <Link to={item.path} className={linkStyle} onClick={() => {
              if (item.path === '/master') toggleMasterSubOpen();
              if (item.path === '/expenses') toggleExpensesSubOpen();
            }}>
              <FontAwesomeIcon icon={item.icon} className={iconStyle} />{' '} {item.label}
              {item.submodules && (item.path === '/master' || item.path === '/expenses') && (
                <span className={arrowIconStyle}>
                  {item.path === '/master' && (masterSubOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                  {item.path === '/expenses' && (expensesSubOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                </span>
              )}
            </Link>
            {item.submodules && item.path === '/master' && masterSubOpen && (
              <Nav className="flex-column ml-3">
                {item.submodules.map(sub => {
                  const isSubActive = location.pathname.startsWith(sub.path);
                  const subLinkStyle = isSubActive ? 'nav-links active' : 'nav-links';
                  const subIconStyle = isSubActive ? 'sub-icon active' : 'sub-icon';

                  return (
                    <Link key={sub.path} to={sub.path} className={subLinkStyle}>
                      <FontAwesomeIcon icon={sub.icon} className={subIconStyle} />{' '} {sub.label}
                    </Link>
                  );
                })}
              </Nav>
            )}
            {item.submodules && item.path === '/expenses' && expensesSubOpen && (
              <Nav className="flex-column ml-3">
                {item.submodules.map(sub => {
                  const isSubActive = location.pathname.startsWith(sub.path);
                  const subLinkStyle = isSubActive ? 'nav-links active' : 'nav-links';
                  const subIconStyle = isSubActive ? 'sub-icon active' : 'sub-icon';

                  return (
                    <Link key={sub.path} to={sub.path} className={subLinkStyle}>
                      <FontAwesomeIcon icon={sub.icon} className={subIconStyle} />{' '} {sub.label}
                    </Link>
                  );
                })}
              </Nav>
            )}
          </React.Fragment>
        );
      })}
    </Nav>
  );
};

export default Sidebar;
