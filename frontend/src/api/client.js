/**
 * API Client for FastAPI backend
 * Handles requests, response formatting, and fallback URLs
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || 
        (Array.isArray(data?.error) ? data.error.join(', ') : data?.error) || 
        data?.detail || 
        `Server responded with HTTP ${response.status}`;
      
      const error = new Error(errorMsg);
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  } catch (err) {
    // If relative request failed (e.g. proxy issue), try absolute http://127.0.0.1:8000 directly as fallback
    if (!BASE_URL && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
      try {
        const fallbackUrl = `http://127.0.0.1:8000${endpoint}`;
        const fallbackResp = await fetch(fallbackUrl, {
          ...options,
          headers
        });
        const fallbackData = await fallbackResp.json().catch(() => null);
        if (fallbackResp.ok) return fallbackData;
      } catch {
        // preserve original error
      }
    }
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
    throw err;
  }
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
};
