import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '@/lib/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
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
      // falhou ao obter /me → limpar estado e tokens
      console.error('Erro ao verificar autenticação:', error);
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
      // tokens já foram salvos pelo authAPI.login (api.js)
      const userData = await authAPI.getMe();
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      // Normaliza o payload: pode ser string OU objeto em data.detail
      const detail = error?.response?.data?.detail;
      const code = typeof detail === 'object' ? detail?.code : undefined;
      const msg  = typeof detail === 'string' ? detail : detail?.message;

      const isExpired =
        code === 'PASSWORD_EXPIRED' ||
        (typeof msg === 'string' && /expirad/i.test(msg));

      if (isExpired) {
        // evita que o middleware do back barre a troca por header Authorization
        removeTokens();
        sessionStorage.setItem('login_email', email);
        return { success: false, error: 'PASSWORD_EXPIRED' };
      }

      return {
        success: false,
        error: msg || error?.response?.data?.mensagem || 'Erro ao fazer login',
      };
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
      return {
        success: false,
        error: error?.response?.data?.detail || 'Erro ao trocar senha',
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    changePassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
