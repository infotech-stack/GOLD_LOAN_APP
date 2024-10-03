import React, { useState } from 'react';
import Master from './Master';
import Customer from './Customer';

const ParentComponent = () => {
  const [formData, setFormData] = useState({
    loanNumber: '',
    date: '',
    customerName: '',
    fatherName: '',
    place: '',
    address: '',
    phone: '',
    metal: '',
    products: [],
    markRate: '',
    loanValue: '',
    intRate: '',
    intType: '',
    monrate: '',
    monfirrate: '',
    docCharges: '',
    party: '',
    returnDate: ''
  });

  const handleFormChange = (newFormData) => {
    setFormData(newFormData);
  };

  return (
    <div>
      <Master formData={formData} onFormChange={handleFormChange} />
      <Customer formData={formData} />
    </div>
  );
};

export default ParentComponent;
