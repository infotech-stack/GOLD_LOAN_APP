import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPermissions = Cookies.get('permissions');
    const storedIsAuthenticated = Cookies.get('isAuthenticated');
    const storedAdminId = Cookies.get('adminId');

    if (storedPermissions && storedIsAuthenticated && storedAdminId) {
      setPermissions(JSON.parse(storedPermissions));
      setIsAuthenticated(storedIsAuthenticated === 'true');
      setAdminId(storedAdminId);
    }
    setLoading(false); // Authentication check is complete
  }, []);

  const login = async (adminId, password, isRootAdmin = false) => {
    try {
      const url = isRootAdmin
        ? `${process.env.REACT_APP_BACKEND_URL}/api/rootadmin/login`
        : `${process.env.REACT_APP_BACKEND_URL}/api/admins/login`;
  
      const body = isRootAdmin
        ? JSON.stringify({ rootAdminId: adminId, password })
        : JSON.stringify({ adminId, password });
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.message === 'Login successful') {
          const permissions = isRootAdmin
            ? ['Dashboard', 'Ledger Entry', 'Customer Management', 'Branch Management', 'Appraisal Schema', 'Voucher', 'Repledge', 'Expenses', 'Day Book', 'MD Voucher', 'Bill Book', 'Added Admin', 'Added Root']
            : await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admins/${adminId}/permissions`)
                .then(res => res.json())
                .then(data => data.permissions);
  
          setPermissions(permissions);
          setIsAuthenticated(true);
          setAdminId(adminId);
          Cookies.set('permissions', JSON.stringify(permissions));
          Cookies.set('isAuthenticated', 'true');
          Cookies.set('adminId', adminId);
          console.log('Login successful');
          return true;
        } else {
          console.error('Login failed:', data.message);
          return false;
        }
      } else {
        console.error('Login failed with status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error.message);
      return false;
    }
  };
  

  const logout = () => {
    setPermissions([]);
    setIsAuthenticated(false);
    setAdminId('');
    Cookies.remove('permissions');
    Cookies.remove('isAuthenticated');
    Cookies.remove('adminId');
  };

  return (
    <AuthContext.Provider value={{ 
      permissions, 
      isAuthenticated, 
      login, 
      logout, 
      adminId,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
