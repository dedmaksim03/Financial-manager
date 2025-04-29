import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';

export const API_URL = `http://localhost:3000/api`;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    console.log('error.response.status');
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(error.response.status);
    if (error.response.status === 401) {
      try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        localStorage.setItem('access_token', response.data.access_token);
        return $api.request(originalRequest);
      } catch (e) {
        console.log('Не авторизован');
      }
    }
  },
);

export default $api;