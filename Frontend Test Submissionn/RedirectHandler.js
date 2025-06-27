import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { logAction } from '../middleware/loggingMiddleware';

const RedirectHandler = ({ urls }) => {
  const { shortCode } = useParams();
  const urlData = urls.find(url => url.shortCode === shortCode);

  useEffect(() => {
    if (urlData) {
      logAction('REDIRECT_ATTEMPT', { shortCode });
      
      // In a real app, you would track the click here
      // For now, we'll just simulate it
      console.log(`Redirecting to: ${urlData.longUrl}`);
    }
  }, [shortCode, urlData]);

  if (!urlData) {
    return <Navigate to="/" />;
  }

  if (new Date() > new Date(urlData.expiresAt)) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Link Expired</h2>
        <p>This shortened link has expired and is no longer available.</p>
      </div>
    );
  }

  // In a real implementation, you would track the click here
  // and then redirect
  return <Navigate to={urlData.longUrl} />;
};

export default RedirectHandler;