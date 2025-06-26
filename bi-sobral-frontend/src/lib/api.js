import axios from 'axios';
import Cookies from 'js-cookie';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Instância do axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          Cookies.set('access_token', access, { expires: 1 });

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Token de refresh inválido, redirecionar para login
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/login';
        }
      } else {
        // Sem token de refresh, redirecionar para login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Funções de autenticação
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/token/', {
      username: email,
      password,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/me/');
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/trocar-senha/', {
      senha_atual: oldPassword,
      nova_senha: newPassword,
      confirmar_senha: newPassword,
    });
    return response.data;
  },

  logout: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  },
};

// Funções para dashboards
export const dashboardAPI = {
  getDashboards: async () => {
    const response = await api.get('/dashboards/');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
};

export default api;

