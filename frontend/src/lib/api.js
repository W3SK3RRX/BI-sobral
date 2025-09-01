// api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://apibi.laboratoriosobral.com.br/api/';

const setAccess = (access) =>
  Cookies.set('access_token', access, { expires: 1, sameSite: 'Lax', secure: true, path: '/' });

const setRefresh = (refresh) =>
  Cookies.set('refresh_token', refresh, { expires: 1, sameSite: 'Lax', secure: true, path: '/' });

const clearTokens = () => {
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
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

// Interceptor de refresh (não tentar quando o erro é no próprio /token/)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthCall = originalRequest?.url?.includes('token/');
    const isRefreshCall = originalRequest?.url?.includes('token/refresh/');

    // Não tente refresh se o erro foi no login (/token/)
    if (isAuthCall && !isRefreshCall) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refresh_token');

      if (!refreshToken) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const resp = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh: refreshToken });
        const { access } = resp.data || {};
        if (!access) throw new Error('Refresh sem access token');
        setAccess(access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ------------------ Autenticação ------------------
export const authAPI = {
  login: async (email, password) => {
    // retorna tokens; o app pode chamar getMe em seguida
    const response = await api.post('token/', { email, password });
    const data = response.data;
    if (data?.access) setAccess(data.access);
    if (data?.refresh) setRefresh(data.refresh);
    return data;
  },

  getMe: async () => {
    const response = await api.get('me/');
    return response.data;
  },

  // troca de senha autenticado (exige senha atual, nova e confirmação)
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    const response = await api.post('trocar-senha/', {
      senha_atual: oldPassword,
      nova_senha: newPassword,
      confirmacao: confirmPassword, // <-- padronizado com backend
    });
    return response.data;
  },

  // troca de senha expirada (AllowAny)
  changePasswordExpired: async (email, oldPassword, newPassword, confirmPassword) => {
    const response = await api.post('trocar-senha-expirada/', {
      email,
      senha_atual: oldPassword,
      nova_senha: newPassword,
      confirmacao: confirmPassword,
    });
    return response.data;
  },

  logout: () => {
    clearTokens();
  },
};

// ---------------- Dashboards e Categorias ----------------
export const dashboardAPI = {
  getDashboards: async () => (await api.get('dashboards/')).data,
  getDashboardById: async (id) => (await api.get(`dashboards/${id}/`)).data,
  updateDashboard: async (id, data) => (await api.put(`dashboards/${id}/`, data)).data,
  getCategories: async () => (await api.get('categories/')).data,
  createDashboard: async (data) => (await api.post('dashboards/', data)).data,
  deleteDashboard: async (id) => (await api.delete(`dashboards/${id}/`)).data,
};

// ---------------- Admin: usuários ----------------
export const userAPI = {
  getUsers: async () => (await api.get('users/')).data,
  getUser: async (id) => (await api.get(`users/${id}/`)).data,
  createUser: async (data) => (await api.post('users/', data)).data,
  updateUser: async (id, data) => (await api.patch(`users/${id}/`, data)).data,
  deleteUser: async (id) => (await api.delete(`users/${id}/`)).data,
};

export default api;
