import React, { useState } from 'react';
import PersonalInfoForm from './components/PersonalInfoForm';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Button } from '@mui/material';

const App = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/resume', formData, {
        responseType: 'blob',
      });
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
    <div>
      {step === 0 && <PersonalInfoForm onNext={handleNext} />}
      {/* Add other forms for different steps, e.g., <EducationForm onNext={handleNext} /> */}
      {step === 1 && (
        <div>
          <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        </div>
      )}
    </div>
  );
};

export default App;
