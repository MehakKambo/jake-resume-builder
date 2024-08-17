import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PersonalInfoForm from './components/PersonalInfoForm';
import Home from './components/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route for the homepage */}
        <Route path="/" element={<Home />} />
        <Route path="/resume-builder" element={<PersonalInfoForm />} />
      </Routes>
    </Router>
  );
};

export default App;