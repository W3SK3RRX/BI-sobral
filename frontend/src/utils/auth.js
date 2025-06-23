export const getTokenPayload = () => {
  const token = localStorage.getItem('access')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

export const isAuthenticated = () => {
  return !!getTokenPayload()
}

export const isAdmin = () => {
  const payload = getTokenPayload()
  return payload?.access_level === 'ADMIN'
}

// src/utils/auth.js

export const getAccessToken = () => localStorage.getItem('access')
export const getRefreshToken = () => localStorage.getItem('refresh')

export const saveTokens = (access, refresh) => {
  localStorage.setItem('access', access)
  localStorage.setItem('refresh', refresh)
}

export const logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}
