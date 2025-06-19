import axios from 'axios'
import api from './axios'  // Axios com token JWT automático

const API_URL = import.meta.env.VITE_API_URL

// 🔐 Login via e-mail (e-mail é enviado como "username" no JWT)
export const login = async (email, senha) => {
  return axios.post(`${API_URL}/token/`, {
    username: email,
    password: senha
  })
}

// ℹ️ Dados do usuário logado (usa token via api.js)
export const getUserInfo = () => {
  return api.get('/me/')
}

// 🔄 Atualiza token com refresh
export const refreshToken = async (refreshToken) => {
  return axios.post(`${API_URL}/token/refresh/`, {
    refresh: refreshToken
  })
}

// 🚪 Remove tokens e efetua logout local
export const logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}
