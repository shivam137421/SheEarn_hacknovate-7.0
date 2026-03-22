import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({ baseURL: BASE_URL });

// Attach JWT on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally (token expired)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ---- AUTH ----
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login:  (data) => api.post('/auth/login', data),
};

// ---- GIGS ----
export const gigAPI = {
  getAll:         ()              => api.get('/gigs/public'),
  getUrgent:      ()              => api.get('/gigs/urgent'),
  getById:        (id)            => api.get(`/gigs/public/${id}`),
  getByCategory:  (cat)           => api.get(`/gigs/public/category/${cat}`),
  getNearby:      (lat, lng)      => api.get(`/gigs/nearby?lat=${lat}&lng=${lng}`),
  create:         (data)          => api.post('/gigs', data),
  getMine:        (view='customer') => api.get(`/gigs/my?view=${view}`),
  accept:         (id)            => api.post(`/gigs/${id}/accept`),
  start:          (id)            => api.patch(`/gigs/${id}/start`),
  complete:       (id)            => api.patch(`/gigs/${id}/complete`),
  review:         (id, data)      => api.post(`/gigs/${id}/review`, data),
};

// ---- USERS ----
export const userAPI = {
  getMe:           ()             => api.get('/users/me'),
  updateMe:        (data)         => api.put('/users/me', data),
  updateLocation:  (data)         => api.patch('/users/me/location', data),
  getDashboard:    ()             => api.get('/users/me/dashboard'),
  getProviders:    (skill)        => api.get(`/users/providers${skill ? `?skill=${skill}` : ''}`),
  getNearby:       (lat, lng)     => api.get(`/users/providers/nearby?lat=${lat}&lng=${lng}`),
  getById:         (id)           => api.get(`/users/${id}`),
};

// ---- SKILLS AI ----
export const skillAPI = {
  analyze: (data) => api.post('/skills/analyze', data),
  getMine: ()     => api.get('/skills/my'),
};

// ---- SOS ----
export const sosAPI = {
  trigger: (data) => api.post('/sos/trigger', data),
  resolve: (id)   => api.patch(`/sos/${id}/resolve`),
  getMine: ()     => api.get('/sos/my'),
};

export default api;
