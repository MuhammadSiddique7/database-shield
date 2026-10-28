import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ds_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ds_token');
    }
    return Promise.reject(error);
  }
);

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const logoutUser = () => api.post('/auth/logout');
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const changePassword = (data) => api.put('/auth/change-password', data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);

export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);
export const getProject = (id) => api.get(`/projects/${id}`);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const regenerateProjectKey = (id) => api.post(`/projects/${id}/regenerate-key`);

export const getDashboardStats = (project) => api.get('/dashboard/stats', { params: { project } });
export const getDashboardRecent = (project) => api.get('/dashboard/recent', { params: { project } });
export const getDashboardChart = (days = 7, project) => api.get('/dashboard/chart', { params: { days, project } });

export const getLogs = (params) => api.get('/logs', { params });
export const getLog = (id) => api.get(`/logs/${id}`);

export const analyzeQuery = (data) => api.post('/analyze-query', data);

export default api;
