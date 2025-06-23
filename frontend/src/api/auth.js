import axios from 'axios'
import api from './axios'  // Axios com interceptador JWT

const API_URL = import.meta.env.VITE_API_URL

// 🔐 Login via e-mail (email é enviado como "username" no JWT)
export const login = async (email, senha) => {
  return axios.post(`${API_URL}/token/`, {
    username: email,
    password: senha
  })
}

// ℹ️ Dados do usuário logado (usa token automaticamente via api.js)
export const getUsuarioLogado = () => {
  return api.get('/me/')
}

// 🔄 Atualiza token com refresh (usado internamente pelo interceptador)
export const refreshToken = (refresh) => {
  return axios.post(`${API_URL}/token/refresh/`, { refresh })
}

// 🔒 Efetua logout local (usado em caso de erro no refresh)
export const logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

// 🔁 Troca de senha (usa api.js para autenticação JWT)
export const trocarSenha = (novaSenha) => {
  return api.post('/trocar-senha/', { nova_senha: novaSenha })
}
