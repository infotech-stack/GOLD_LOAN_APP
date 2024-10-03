import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Button, TextField, Paper, Grid, Typography } from '@mui/material';
import axios from 'axios';

const GoldLoanSchema = () => {
  const [schemaData, setSchemaData] = useState([]);
  const [newSchema, setNewSchema] = useState({
    id: null,
    name: '',
    interestPercent: '',
    timePeriod: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/schemas`);
      setSchemaData(response.data);
    } catch (error) {
      console.error('Error fetching schemas:', error);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Schema Name validation
    if (!newSchema.name || !/^[a-zA-Z\s]*$/.test(newSchema.name)) {
      newErrors.name = 'Schema Name is required and must contain only letters and spaces';
    }
    
    // Interest Percent validation
    if (!newSchema.interestPercent || isNaN(newSchema.interestPercent)) {
      newErrors.interestPercent = 'Interest Percent is required and must be a number';
    }

    // Time Period validation
    if (!newSchema.timePeriod) {
      newErrors.timePeriod = 'Time Period is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchema({ ...newSchema, [name]: value });
  };

  const handleAddOrUpdateSchema = async () => {
    if (!validate()) return;

    try {
      if (newSchema.id === null) {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/schemas`, {
          name: newSchema.name,
          interestPercent: newSchema.interestPercent,
          timePeriod: newSchema.timePeriod,
        });
        setSchemaData([...schemaData, response.data]);
      } else {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/schemas/${newSchema.id}`, {
          name: newSchema.name,
          interestPercent: newSchema.interestPercent,
          timePeriod: newSchema.timePeriod,
        });
        setSchemaData(schemaData.map((schema) =>
          schema.id === newSchema.id ? response.data : schema
        ));
      }
      setNewSchema({
        id: null,
        name: '',
        interestPercent: '',
        timePeriod: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Error saving schema:', error);
    }
  };

  return (
    <div style={{ padding: '20px', marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }} sx={{ mt: 6 }} className='paperbg'>
        <Typography variant="h6" align="center" gutterBottom sx={{color:'#D72122',fontWeight:'550'}}>
         GOLD SCHEMA
        </Typography>
        <Table responsive striped bordered hover style={{ marginTop: '13px' }}>
          <thead >
            <tr >
              <th style={{color:'#D72122'}}>Schema Name</th>
              <th style={{color:'#D72122'}}>Interest Percent</th>
              <th style={{color:'#D72122'}}>Time Period</th>
            </tr>
          </thead>
          <tbody>
            {schemaData.length > 0 ? (
              schemaData.map((schema) => (
                <tr key={schema._id}>
                  <td>{schema.name}</td>
                  <td>{schema.interestPercent }</td>
                  <td>{schema.timePeriod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No data available</td>
              </tr>
            )}
          </tbody>
        </Table>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{color:'#D72122',fontWeight:'550',textAlign:'center'}}>
              {newSchema.id ? 'Edit Schema' : 'Add New Schema'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Schema Name"
              name="name"
              value={newSchema.name}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              style={{ marginBottom: '10px' }}
            />
          </Grid>
        
          <Grid item xs={12} sm={4}>
            <TextField
              label="Interest Percent %"
              name="interestPercent"
              type="number"
              value={newSchema.interestPercent}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              error={!!errors.interestPercent}
              helperText={errors.interestPercent}
              style={{ marginBottom: '10px' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Time Period"
              name="timePeriod"
              value={newSchema.timePeriod}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              error={!!errors.timePeriod}
              helperText={errors.timePeriod}
              style={{ marginBottom: '10px' }}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <Button variant="contained" color="primary" onClick={handleAddOrUpdateSchema} sx={{width:200}}  className=' sub-green'>
              {newSchema.id ? 'Update' : 'Add'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default GoldLoanSchema;
