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
