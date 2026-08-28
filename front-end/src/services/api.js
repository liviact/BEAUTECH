import axios from 'axios';

export const api = axios.create({
  // Em desenvolvimento usa http://localhost:8000.
  // Para outro computador/servidor, defina VITE_API_URL no .env do front-end.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const tokenMedico = localStorage.getItem('tokenMedico');
    const activeToken = token || tokenMedico;

    if (activeToken) {
      config.headers.Authorization = `Bearer ${activeToken}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error(
        'Não foi possível conectar ao Back-End. Verifique se a API está rodando e se a URL está correta.'
      );
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenMedico');
      localStorage.removeItem('usuario');
    }

    return Promise.reject(error);
  }
);
