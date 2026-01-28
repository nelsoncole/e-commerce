import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Usa a URL definida no .env
  withCredentials: false, // Usa true se estiver a lidar com autenticação via cookies
});

export default api;
