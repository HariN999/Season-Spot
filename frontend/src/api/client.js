const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  return (hostname === 'localhost' || hostname === '127.0.0.1')
    ? 'http://localhost:8000'
    : ''; // Serves relative on production deployment / Vercel
};

export const apiFetch = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Set up request timeout
  const timeoutMs = options.timeout || 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  config.signal = controller.signal;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errData = {};
      try {
        errData = await response.json();
      } catch (e) {
        // Fallback for non-JSON responses
      }
      
      const errorMsg = errData.error?.message || errData.message || `HTTP Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.code = errData.error?.code || 'HTTP_ERROR';
      err.details = errData.error?.details || null;
      throw err;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutErr = new Error('API Request timed out. Please try again.');
      timeoutErr.status = 408;
      timeoutErr.code = 'TIMEOUT';
      throw timeoutErr;
    }
    throw error;
  }
};
