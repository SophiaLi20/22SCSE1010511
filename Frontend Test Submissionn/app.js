import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import URLShortener from './components/URLShortener';
import StatsPage from './components/StatsPage';
import RedirectHandler from './components/RedirectHandler';
import Navbar from './components/Navbar';
import { generateBrowserFingerprint } from './utils/fingerprint';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [urls, setUrls] = useState([]);
  const [fingerprint, setFingerprint] = useState('');

  useEffect(() => {
    // Generate unique browser fingerprint on load
    generateBrowserFingerprint().then(fp => {
      setFingerprint(fp);
    });
  }, []);

  const addUrl = (newUrl) => {
    setUrls(prevUrls => [...prevUrls, newUrl]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<URLShortener addUrl={addUrl} fingerprint={fingerprint} />} />
          <Route path="/stats" element={<StatsPage urls={urls} fingerprint={fingerprint} />} />
          <Route path="/:shortCode" element={<RedirectHandler urls={urls} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

