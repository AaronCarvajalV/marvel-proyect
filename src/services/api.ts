import axios from 'axios';
import { config } from '../config/env';

export const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('marvel_token');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors like 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid, trigger logout
        localStorage.removeItem('marvel_token');
        // A full app reload or event dispatch could be done here to redirect to login
        window.dispatchEvent(new Event('auth:unauthorized'));
      } else if (error.response.status === 403) {
        alert('ACCESS DENIED: Your clearance level (CONSULTA) does not permit this action.');
      }
    }
    return Promise.reject(error);
  }
);
