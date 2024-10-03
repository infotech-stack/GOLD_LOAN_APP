import React, { useState } from 'react';
import Reminders from './Reminders';
import Dashboard from '../Dashboard/Dashboard';

const ParentComponent = () => {
  const [openingBalance, setOpeningBalance] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

  return (
    <>
      <Reminders setOpeningBalance={setOpeningBalance} setClosingBalance={setClosingBalance} />
      <Dashboard openingBalance={openingBalance} closingBalance={closingBalance} />
    </>
  );
};

export default ParentComponent;
