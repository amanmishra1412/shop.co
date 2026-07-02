import axios from 'axios';

// ─────────────────────────────────────────────
// Central Axios Instance
// Use this in ALL utility files (auth, products, orders, etc.)
// ─────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URI || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────
// Request Interceptor
// Add auth token or other headers here if needed
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// Response Interceptor
// Handle global errors (401, 500, etc.) here
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Unauthorized — optionally redirect to login
      console.warn('[API] Unauthorized (401)');
    }

    if (status >= 500) {
      console.error('[API] Server error:', error?.response?.data);
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// Helper — unwrap nested `data` from response
// ─────────────────────────────────────────────
export const getData = (response) => {
  const raw = response?.data;
  if (raw?.data && typeof raw.data === 'object') return raw.data;
  return raw;
};

export default api;
