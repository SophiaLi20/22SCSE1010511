import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { logAction } from '../middleware/loggingMiddleware';

const StatsPage = ({ urls, fingerprint }) => {
  if (urls.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          URL Statistics
        </Typography>
        <Typography variant="body1">
          No URLs have been shortened yet. Create some URLs to see statistics.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      <Typography variant="body1" gutterBottom>
        View analytics for your shortened URLs. All data is protected with your unique fingerprint.
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontFamily: 'monospace', position: 'relative' }}>
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
                </TableCell>
                <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {url.longUrl}
                </TableCell>
                <TableCell>{url.clicks || 0}</TableCell>
                <TableCell>{new Date(url.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(url.expiresAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StatsPage;