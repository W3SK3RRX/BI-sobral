import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para refresh automático
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
        } catch (err) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Autenticação
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

// Dashboards e Categorias
export const dashboardAPI = {
  getDashboards: async () => {
    const response = await api.get('/dashboards/');
    return response.data;
  },

  getDashboardById: async (id) => {
    const response = await api.get(`/dashboards/${id}/`);
    return response.data;
  },

  updateDashboard: async (id, data) => {
    const response = await api.put(`/dashboards/${id}/`, data);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },

  createDashboard: async (data) => {
    const response = await api.post('/dashboards/', data);
    return response.data;
  },

  deleteDashboard: async (id) => {
    const response = await api.delete(`/dashboards/${id}/`);
    return response.data;
  },
};


// Admin: gerenciamento de usuários
export const userAPI = {
  getUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  createUser: async (data) => {
    const response = await api.post('/users/', data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.patch(`/users/${id}/`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}/`);
    return response.data;
  },
};


export default api;
