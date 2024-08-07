import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material'; // Ensure these imports are correct

const PersonalInfoForm = ({ onNext }) => {
  const [data, setData] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onNext(data);
  };

  return (
    <Container>
      <TextField name="name" label="Name" value={data.name} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="email" label="Email" value={data.email} onChange={handleChange} fullWidth margin="normal" />
      <TextField name="phone" label="Phone" value={data.phone} onChange={handleChange} fullWidth margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Next</Button>
    </Container>
  );
};

export default PersonalInfoForm;
