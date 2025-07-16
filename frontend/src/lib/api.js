import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://powerbi.laboratoriosobral.com.br/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor para adicionar Authorization
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Refresh automático
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
          Cookies.set('access_token', access, {
            expires: 1,
            secure: true,
            sameSite: 'Strict',
          });
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (err) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Autenticação
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/token/', {
      username: email,
      password,
    });

    const { access, refresh } = response.data;

    // ✅ Salvar tokens
    Cookies.set('access_token', access, {
      expires: 1,
      secure: true,
      sameSite: 'Strict',
    });
    Cookies.set('refresh_token', refresh, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
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

export default api;
