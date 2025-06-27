// loggingMiddleware.js
const createLoggingMiddleware = () => {
  // Session storage key for logs
  const LOG_STORAGE_KEY = 'urlShortenerLogs';

  // Initialize logs array if not exists
  const initializeLogs = () => {
    if (!sessionStorage.getItem(LOG_STORAGE_KEY)) {
      sessionStorage.setItem(LOG_STORAGE_KEY, JSON.stringify([]));
    }
  };

  // Log an action with timestamp
  const logAction = (actionType, data = {}) => {
    initializeLogs();
    const logs = JSON.parse(sessionStorage.getItem(LOG_STORAGE_KEY));
    
    const newLog = {
      timestamp: new Date().toISOString(),
      action: actionType,
      data: {
        ...data,
        route: window.location.pathname,
        userAgent: navigator.userAgent
      }
    };

    logs.push(newLog);
    sessionStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));

    // For debugging (remove in production)
    console.log(`[LOG] ${actionType}`, data);
  };

  // Get all logs
  const getLogs = () => {
    initializeLogs();
    return JSON.parse(sessionStorage.getItem(LOG_STORAGE_KEY));
  };

  // Clear all logs
  const clearLogs = () => {
    sessionStorage.removeItem(LOG_STORAGE_KEY);
  };

  return { logAction, getLogs, clearLogs };
};

export default createLoggingMiddleware();
