import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, Snackbar, Alert } from '@mui/material';
import { generateShortCode } from '../utils/shortcode';
import { validateUrl } from '../utils/validation';
import { logAction } from '../middleware/loggingMiddleware';

const URLShortener = ({ addUrl, fingerprint }) => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: 30, shortCode: '', customCode: '' }]);
  const [errors, setErrors] = useState(Array(5).fill(null));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleUrlChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);
    
    if (field === 'longUrl' && value) {
      const newErrors = [...errors];
      newErrors[index] = validateUrl(value) ? null : 'Invalid URL format';
      setErrors(newErrors);
    }
  };

  const handleAddMore = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: 30, shortCode: '', customCode: '' }]);
    }
  };

  const handleRemove = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };

  const handleSubmit = async (index) => {
    const urlData = urls[index];
    if (!urlData.longUrl) {
      setSnackbar({ open: true, message: 'URL cannot be empty', severity: 'error' });
      return;
    }
    
    if (errors[index]) {
      setSnackbar({ open: true, message: 'Please fix errors before submitting', severity: 'error' });
      return;
    }

    try {
      // Generate short code with biometric fingerprint
      const shortCode = urlData.customCode 
        ? urlData.customCode 
        : await generateShortCode(urlData.longUrl, fingerprint);
      
      const newUrl = {
        ...urlData,
        shortCode,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + urlData.validity * 60000),
        clicks: 0,
        clickData: []
      };

      addUrl(newUrl);
      
      const newUrls = [...urls];
      newUrls[index] = { ...newUrls[index], shortCode };
      setUrls(newUrls);
      
      logAction('URL_SHORTENED', { url: urlData.longUrl, shortCode });
      setSnackbar({ open: true, message: 'URL shortened successfully!', severity: 'success' });
    } catch (error) {
      logAction('SHORTEN_ERROR', { error: error.message });
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <Typography variant="body1" gutterBottom>
        Create up to 5 shortened URLs at once. Each link will be protected with a unique fingerprint.
      </Typography>
      
      {urls.map((url, index) => (
        <Paper key={index} elevation={3} sx={{ p: 3, mb: 3, position: 'relative' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Long URL"
                value={url.longUrl}
                onChange={(e) => handleUrlChange(index, 'longUrl', e.target.value)}
                error={!!errors[index]}
                helperText={errors[index]}
                placeholder="https://example.com"
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                type="number"
                value={url.validity}
                onChange={(e) => handleUrlChange(index, 'validity', parseInt(e.target.value) || 30)}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label="Custom Short Code (optional)"
                value={url.customCode}
                onChange={(e) => handleUrlChange(index, 'customCode', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(index)}
                fullWidth
                sx={{ height: '56px' }}
              >
                Shorten
              </Button>
            </Grid>
          </Grid>
          
          {url.shortCode && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle1">Short URL:</Typography>
              <Typography variant="body1" sx={{ 
                fontFamily: 'monospace',
                backgroundColor: '#e0e0e0',
                p: 1,
                borderRadius: 1,
                position: 'relative'
              }}>
                {`http://localhost:3000/${url.shortCode}`}
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  opacity: 0.1,
                  fontSize: '8px',
                  userSelect: 'none'
                }}>
                  {fingerprint.slice(0, 8)}
                </Box>
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Expires at: {new Date(url.expiresAt).toLocaleString()}
              </Typography>
            </Box>
          )}
          
          {urls.length > 1 && (
            <Button
              size="small"
              color="error"
              onClick={() => handleRemove(index)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              Remove
            </Button>
          )}
        </Paper>
      ))}
      
      {urls.length < 5 && (
        <Button variant="outlined" onClick={handleAddMore} sx={{ mt: 2 }}>
          Add Another URL
        </Button>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default URLShortener;