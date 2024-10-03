import React, { createContext, useState, useEffect } from 'react';

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [openingBalance, setOpeningBalance] = useState(null);
  const [closingBalance, setClosingBalance] = useState(null);

  useEffect(() => {
    const storedOpeningBalance = sessionStorage.getItem('openingBalance');
    const storedClosingBalance = sessionStorage.getItem('closingBalance');

    if (storedOpeningBalance) setOpeningBalance(JSON.parse(storedOpeningBalance));
    if (storedClosingBalance) setClosingBalance(JSON.parse(storedClosingBalance));
  }, []);

  const updateBalances = (filteredRows) => {
    const todayDate = new Date().toISOString().split('T')[0];
    const todayRow = filteredRows.find(row => row.date === todayDate);

    if (todayRow) {
      setOpeningBalance(todayRow.openingBalance);
      setClosingBalance(todayRow.closingBalance);
      // Store in session storage
      sessionStorage.setItem('openingBalance', JSON.stringify(todayRow.openingBalance));
      sessionStorage.setItem('closingBalance', JSON.stringify(todayRow.closingBalance));
    }
  };

  return (
    <BalanceContext.Provider value={{ openingBalance, closingBalance, updateBalances }}>
      {children}
    </BalanceContext.Provider>
  );
};

