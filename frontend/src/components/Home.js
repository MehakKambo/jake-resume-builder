import React, { useState } from 'react';
import { Container, TextField, Button, Tabs, Tab, Box, Typography } from '@mui/material';

const Home = () => {

  const [activeTab, setActiveTab] = useState(0);

  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
    confirmPasswordError: false,
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSignInData({
      email: '',
      password: '',
    });
    setSignUpData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({
      emailError: false,
      passwordError: false,
      confirmPasswordError: false,
    });
  };

  const handleSignInChange = (e) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignInSubmit = () => {
    const newErrors = {
      emailError: !signInData.email,
      passwordError: !signInData.password,
    };
    setErrors(newErrors);
    if (newErrors.emailError || newErrors.passwordError) {
      return;
    }
    console.log('Sign In:', signInData);
  };

  const handleSignUpSubmit = () => {
    const newErrors = {
      emailError: !signUpData.email,
      passwordError: !signUpData.password,
      confirmPasswordError: signUpData.password !== signUpData.confirmPassword,
    };
    setErrors(newErrors);
    if (newErrors.emailError || newErrors.passwordError || newErrors.confirmPasswordError) {
      return;
    }
    console.log('Sign Up:', signUpData);
  };

  const handleNoticeClick = () => {
    setActiveTab(activeTab === 0 ? 1 : 0);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 'bold' }}
        >
          LaTeX Resume Builder
        </Typography>

        <Typography
          variant="h5"
          component="p"
          gutterBottom
          sx={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          Easily create professional LaTeX resumes without writing a single line of code.
        </Typography>

        <Box sx={{ width: '100%', bgcolor: 'background.paper', marginBottom: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <>
            <TextField
              name="email"
              label="Email"
              value={signInData.email}
              onChange={handleSignInChange}
              fullWidth
              margin="normal"
              required
              error={errors.emailError}
              helperText={errors.emailError ? 'Email is required' : ''}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              value={signInData.password}
              onChange={handleSignInChange}
              fullWidth
              margin="normal"
              required
              error={errors.passwordError}
              helperText={errors.passwordError ? 'Password is required' : ''}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSignInSubmit}
              sx={{ marginTop: 2 }}
            >
              Sign In
            </Button>
          </>
        )}

        {activeTab === 1 && (
          <>
            <TextField
              name="firstName"
              label="First Name"
              value={signUpData.firstName}
              onChange={handleSignUpChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              name="lastName"
              label="Last Name"
              value={signUpData.lastName}
              onChange={handleSignUpChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              name="email"
              label="Email"
              value={signUpData.email}
              onChange={handleSignUpChange}
              fullWidth
              margin="normal"
              required
              error={errors.emailError}
              helperText={errors.emailError ? 'Email is required' : ''}
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              value={signUpData.password}
              onChange={handleSignUpChange}
              fullWidth
              margin="normal"
              required
              error={errors.passwordError}
              helperText={errors.passwordError ? 'Password is required' : ''}
            />

            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={signUpData.confirmPassword}
              onChange={handleSignUpChange}
              fullWidth
              margin="normal"
              required
              error={errors.confirmPasswordError}
              helperText={errors.confirmPasswordError ? 'Passwords do not match' : ''}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSignUpSubmit}
              sx={{ marginTop: 2 }}
            >
              Sign Up
            </Button>
          </>
        )}

        <Typography
          variant="body2"
          sx={{ marginTop: 2, color: '#777', cursor: 'pointer' }}
          onClick={handleNoticeClick}
        >
          {activeTab === 0 ? (
            <>
              Don't have an account? <span style={{ textDecoration: 'underline' }}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account? <span style={{ textDecoration: 'underline' }}>Sign In</span>
            </>
          )}
        </Typography>

      </Box>
    </Container>
  );
};

export default Home;