import axios from 'axios';

// Dynamically compute the API Base URL with safety fallbacks
const getBaseURL = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;

  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    let cleanUrl = envUrl.trim().replace(/\/+$/, '');
    // If user configured the root domain without /api, append /api
    if (!cleanUrl.endsWith('/api') && cleanUrl.startsWith('http')) {
      cleanUrl = `${cleanUrl}/api`;
    }
    return cleanUrl;
  }

  // If in production environment (e.g., deployed on Vercel), fallback to the deployed Render backend
  if (
    import.meta.env.PROD ||
    (typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1')
  ) {
    return 'https://swapspace-2.onrender.com/api';
  }

  // Local development fallback through Vite proxy
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('swapspace_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages & handle session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint =
        requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

      // Only wipe session and redirect if 401 happened on an authenticated action with an active session
      if (!isAuthEndpoint && localStorage.getItem('swapspace_token')) {
        localStorage.removeItem('swapspace_token');
        localStorage.removeItem('swapspace_user');

        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')
        ) {
          window.location.href = '/login?expired=true';
        }
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
