// src/api/axios.js
import axios from 'axios'
import { getAccessToken, getRefreshToken, saveTokens, logout } from '../utils/auth'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // ajuste se necessário
})

// Intercepta requisições e insere o token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepta respostas com erro 401 e tenta renovar o token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true

      try {
        const response = await axios.post('http://127.0.0.1:8000/token/refresh/', {
          refresh: getRefreshToken(),
        })

        const { access } = response.data
        saveTokens(access, getRefreshToken()) // salva o novo access token

        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest) // refaz a requisição original
      } catch (err) {
        logout()
        window.location.href = '/'
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api
