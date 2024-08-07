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
      const response = await axios.post('http://localhost:8080/api/resume', formData, {
        responseType: 'blob', // Important to handle binary data
      });

      // Create a blob from the PDF response
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

      // Use file-saver to save the PDF
      saveAs(pdfBlob, 'resume.pdf');
    } catch (error) {
      // Handle error
      console.error(error);
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
