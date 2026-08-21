import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const tokenMedico = localStorage.getItem('tokenMedico');
  const activeToken = token || tokenMedico;

  if (activeToken) {
    config.headers.Authorization = `Bearer ${activeToken}`;
  }

  return config;
});
