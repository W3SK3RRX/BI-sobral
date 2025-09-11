import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '@/lib/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const removeTokens = () => {
    try {
      Cookies.remove('access_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } catch {}
  };

  const checkAuth = async () => {
    try {
      const token = Cookies.get('access_token');
      if (token) {
        const userData = await authAPI.getMe();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      removeTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      // tokens já foram salvos pelo authAPI.login
      const userData = await authAPI.getMe();
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      const data = error?.response?.data;
      const detail = data?.detail;

      // detail pode ser objeto {code, message} OU string ("BAD_PASSWORD", "SENHA_EXPIRADA", etc.)
      const codeFromObj  = typeof detail === 'object' ? detail?.code : undefined;
      const msgFromObj   = typeof detail === 'object' ? (detail?.message || '') : '';
      const codeFromStr  = typeof detail === 'string' ? detail : undefined; // ex.: "BAD_PASSWORD"
      const msgFromStr   = typeof detail === 'string' ? detail : '';

      const code = codeFromObj || codeFromStr;
      const message =
        msgFromObj ||
        msgFromStr ||
        data?.mensagem ||
        '';

      // EXPIRAÇÃO: cobre code, string e mensagens contendo "expirad"
      const looksExpired =
        code === 'PASSWORD_EXPIRED' ||
        codeFromStr === 'SENHA_EXPIRADA' ||
        /expirad/i.test(message) ||
        (typeof detail === 'string' && /expirad/i.test(detail));

      if (looksExpired) {
        removeTokens();
        if (email) sessionStorage.setItem('login_email', email);
        return { success: false, error: 'PASSWORD_EXPIRED' };
      }

      // Específicos — trate tanto pelo code quanto pela string literal
      if (code === 'BAD_PASSWORD' || codeFromStr === 'BAD_PASSWORD') {
        return { success: false, error: 'Senha incorreta.' };
      }
      if (code === 'EMAIL_NOT_FOUND' || codeFromStr === 'EMAIL_NOT_FOUND') {
        return { success: false, error: 'E-mail não encontrado.' };
      }

      // Fallback genérico
      let fallback = message;
      if (!fallback && data && typeof data === 'object') {
        const k = Object.keys(data)[0];
        if (k) fallback = Array.isArray(data[k]) ? String(data[k][0]) : String(data[k]);
      }
      return { success: false, error: fallback || 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    authAPI.logout();
    removeTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await authAPI.changePassword(oldPassword, newPassword);
      const userData = await authAPI.getMe();
      setUser(userData);
      return { success: true };
    } catch (error) {
      const data = error?.response?.data;
      const detail = data?.detail;
      const msg =
        (typeof detail === 'object' && (detail?.message || '')) ||
        (typeof detail === 'string' && detail) ||
        data?.mensagem ||
        'Erro ao trocar senha';
      return { success: false, error: msg };
    }
  };

  const value = { user, loading, isAuthenticated, login, logout, changePassword, checkAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
