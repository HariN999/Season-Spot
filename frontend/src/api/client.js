
const getApiBaseUrl = () => {
  console.log("process.env =", process.env);
  console.log("REACT_APP_API_URL =", process.env.REACT_APP_API_URL);

  return process.env.REACT_APP_API_URL || "http://localhost:8000";
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

  // Set up request timeout and link caller's signal if provided
  const timeoutMs = options.timeout || 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => {
        controller.abort();
      });
    }
  }

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
      // If the caller explicitly aborted the request, let the AbortError bubble up
      if (options.signal && options.signal.aborted) {
        throw error;
      }
      const timeoutErr = new Error('API Request timed out. Please try again.');
      timeoutErr.status = 408;
      timeoutErr.code = 'TIMEOUT';
      throw timeoutErr;
    }
    throw error;
  }
};
