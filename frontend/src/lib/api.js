// api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://apibi.laboratoriosobral.com.br/api/';

const setAccess = (access) =>
  Cookies.set('access_token', access, { expires: 1, sameSite: 'Lax', secure: true, path: '/' });

const setRefresh = (refresh) =>
  Cookies.set('refresh_token', refresh, { expires: 7, sameSite: 'Lax', secure: true, path: '/' });

const clearTokens = () => {
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
};

const unwrapAxiosError = (error) => {
  const data = error?.response?.data;
  if (data && typeof data === 'object') {
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.mensagem === 'string') return data.mensagem;
    const key = Object.keys(data)[0];
    if (key) {
      const v = data[key];
      return Array.isArray(v) ? v[0] : String(v);
    }
  }
  return error?.message || 'Erro inesperado';
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// === REQUEST: anexa Authorization, exceto em trocar-senha-expirada ===
api.interceptors.request.use(
  (config) => {
    const url = (config.url || '').toLowerCase();

    // NUNCA enviar Authorization na rota pública
    if (url.includes('trocar-senha-expirada')) {
      if (config.headers?.Authorization) delete config.headers.Authorization;
      return config;
    }

    const token = Cookies.get('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE: não tentar refresh para login nem para trocar-senha-expirada ===
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    const url = (originalRequest?.url || '').toLowerCase();
    const isAuthCall = url.includes('token/');             // /token/ (login)
    const isRefreshCall = url.includes('token/refresh/');  // /token/refresh/
    const isChangeExpired = url.includes('trocar-senha-expirada');

    // Nunca tente refresh no erro do login ou da troca expirada
    if ((isAuthCall && !isRefreshCall) || isChangeExpired) {
      return Promise.reject(error);
    }

    // Tente refresh apenas uma vez em chamadas protegidas
    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) {
        clearTokens();
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
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ================== Autenticação ==================
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('token/', { email, password });
    const data = response.data || {};
    if (data.access) setAccess(data.access);
    if (data.refresh) setRefresh(data.refresh);
    return data;
  },

  getMe: async () => (await api.get('me/')).data,

  // Troca autenticada
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    const response = await api.post('trocar-senha/', {
      senha_atual: oldPassword,
      nova_senha: newPassword,
      confirmacao: confirmPassword,
    });
    return response.data;
  },

  // Troca expirada (AllowAny) — força sem Authorization
  changePasswordExpired: async (email, oldPassword, newPassword, confirmPassword) => {
    const response = await api.post(
      'trocar-senha-expirada/',
      {
        email,
        senha_atual: oldPassword,
        nova_senha: newPassword,
        confirmacao: confirmPassword,
      },
      { headers: { Authorization: undefined } }
    );
    return response.data;
  },

  logout: () => clearTokens(),
};

// ============ Dashboards & Categorias ============
export const dashboardAPI = {
  getDashboards: async () => (await api.get('dashboards/')).data,
  getDashboardById: async (id) => (await api.get(`dashboards/${id}/`)).data,
  updateDashboard: async (id, data) => (await api.put(`dashboards/${id}/`, data)).data,
  getCategories: async () => (await api.get('categories/')).data,
  createDashboard: async (data) => (await api.post('dashboards/', data)).data,
  deleteDashboard: async (id) => (await api.delete(`dashboards/${id}/`)).data,
};

// ================== Admin: usuários ==================
export const userAPI = {
  getUsers: async () => (await api.get('users/')).data,
  getUser: async (id) => (await api.get(`users/${id}/`)).data,
  createUser: async (data) => (await api.post('users/', data)).data,
  updateUser: async (id, data) => (await api.patch(`users/${id}/`, data)).data,
  deleteUser: async (id) => (await api.delete(`users/${id}/`)).data,
};

export default api;
export const parseApiError = unwrapAxiosError;
