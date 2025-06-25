import axios from 'axios'
import api from './axios'  // Axios com interceptador JWT

const API_URL = import.meta.env.VITE_API_URL

export const login = async (email, senha) => {
  return axios.post(`${API_URL}/token/`, {
    username: email,
    password: senha
  })
}

export const getUsuarioLogado = () => {
  return api.get('/me/')
}

export const refreshToken = (refresh) => {
  return axios.post(`${API_URL}/token/refresh/`, { refresh })
}

export const logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

export const trocarSenha = (data) => api.post('/trocar-senha/', data)

// ✅ ADICIONADO:
export const getMe = () => {
  return api.get('/me/')
}
