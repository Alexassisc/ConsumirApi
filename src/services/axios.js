import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // pega o token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // adiciona no header
  }
  return config;
});

export default api;
