export const config = {
  // Use VITE_API_URL if defined, otherwise fallback to standard Laravel local dev url
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};
