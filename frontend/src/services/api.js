import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dhp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for global response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      if (localStorage.getItem('dhp_token')) {
        localStorage.removeItem('dhp_token');
        localStorage.removeItem('dhp_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (patientData) => api.post('/auth/register', patientData),
  getProfile: () => api.get('/auth/profile'),
};

export const testsAPI = {
  getAll: (params) => api.get('/tests', { params }),
  getById: (id) => api.get(`/tests/${id}`),
  create: (testData) => api.post('/tests', testData),
  update: (id, testData) => api.put(`/tests/${id}`, testData),
  delete: (id) => api.delete(`/tests/${id}`),
};

export const slotsAPI = {
  getAll: (params) => api.get('/slots', { params }),
  create: (slotData) => api.post('/slots', slotData),
  delete: (id) => api.delete(`/slots/${id}`),
};

export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, data) => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

    return api.put(`/bookings/${id}/status`, data, isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {});
  },
  uploadReport: (id, formData) =>
    api.post(`/bookings/${id}/report`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  updateRole: (id, roleData) => api.put(`/users/${id}/role`, roleData),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
