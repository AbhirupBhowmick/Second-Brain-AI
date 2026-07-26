import axios from 'axios';

/**
 * Returns the sanitized base API URL without trailing slashes or trailing /api path.
 * Resolves VITE_API_URL, defaulting to http://localhost:8080 for local development.
 */
export const getBaseApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  let baseUrl = envUrl && envUrl.trim() ? envUrl.trim() : 'http://localhost:8080';

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.slice(0, -4);
  }

  return baseUrl;
};

/**
 * Constructs a safely formatted API endpoint URL.
 * e.g. getApiUrl('/api/chat') -> 'http://localhost:8080/api/chat'
 */
export const getApiUrl = (path: string): string => {
  const baseUrl = getBaseApiUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

export const apiClient = axios.create({
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
