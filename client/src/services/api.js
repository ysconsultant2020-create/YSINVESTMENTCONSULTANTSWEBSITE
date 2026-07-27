import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ys_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ys_token');
      localStorage.removeItem('ys_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Insurance API
export const insuranceAPI = {
  getAll: (category) => api.get(`/insurance${category ? `?category=${category}` : ''}`),
  getById: (id) => api.get(`/insurance/${id}`),
  create: (data) => api.post('/insurance', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/insurance/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/insurance/${id}`),
};

// Mutual Fund API
export const mutualFundAPI = {
  getAll: () => api.get('/mutual-funds'),
  getById: (id) => api.get(`/mutual-funds/${id}`),
  create: (data) => api.post('/mutual-funds', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/mutual-funds/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/mutual-funds/${id}`),
};

// SIP Plan API
export const sipPlanAPI = {
  getAll: () => api.get('/sip-plans'),
  getById: (id) => api.get(`/sip-plans/${id}`),
  create: (data) => api.post('/sip-plans', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/sip-plans/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/sip-plans/${id}`),
};

// Lumpsum Plan API
export const lumpsumPlanAPI = {
  getAll: () => api.get('/lumpsum-plans'),
  getById: (id) => api.get(`/lumpsum-plans/${id}`),
  create: (data) => api.post('/lumpsum-plans', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/lumpsum-plans/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/lumpsum-plans/${id}`),
};

// Appointment API
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getAll: (params) => api.get('/appointments', { params }),
  getMy: () => api.get('/appointments/my'),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Customer API
export const customerAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  getStats: () => api.get('/customers/stats'),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Contact API
export const contactAPI = {
  create: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  markRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

export default api;
