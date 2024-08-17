import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material'; 
import axios from 'axios';

const PersonalInfoForm = ({ onNext }) => {
  const [data, setData] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // Send the form data to the backend API
      const response = await axios.post('http://localhost:5000/api/resume', data, {
        responseType: 'blob',
      });

      // Create a blob object for the PDF and trigger download
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = 'resume.pdf';
      link.click();
    } catch (error) {
      console.error('Error generating resume:', error);
    }
  };

  return (
    <Container>
      <TextField name="name" label="Name" value={data.name} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="email" label="Email" value={data.email} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="phone" label="Phone" value={data.phone} onChange={handleChange} fullWidth margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
    </Container>
  );
};

export default PersonalInfoForm;
