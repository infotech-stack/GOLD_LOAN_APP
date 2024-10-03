import React, { createContext, useState, useContext } from 'react';

const LedgerContext = createContext();

export const LedgerProvider = ({ children }) => {
  const [ledgerEntries, setLedgerEntries] = useState(null);
  const [ fatherhusname, setFatherhusname] = useState(''); 


  const updateLedgerEntries = (entries) => {
    setLedgerEntries(entries);
  };

  const updateFatherHusName = (name) => {
    setFatherhusname(name);
  };

  return (
    <LedgerContext.Provider value={{ ledgerEntries, setLedgerEntries: updateLedgerEntries,  fatherhusname, setFatherhusname: updateFatherHusName }}>
      {children}
    </LedgerContext.Provider>
  );
};

export const useLedger = () => useContext(LedgerContext);
