import api from './axios'

// DASHBOARDS
export const listDashboards = () => api.get('/dashboards/')
export const createDashboard = (data) => api.post('/dashboards/', data)
export const updateDashboard = (id, data) => api.put(`/dashboards/${id}/`, data)
export const deleteDashboard = (id) => api.delete(`/dashboards/${id}/`)

// USUÁRIOS
export const listUsers = () => api.get('/usuarios/')
export const createUser = (data) => api.post('/usuarios/', data)
export const updateUser = (id, data) => api.put(`/usuarios/${id}/`, data)
export const deleteUser = (id) => api.delete(`/usuarios/${id}/`)

export const getDashboardById = (id) => api.get(`/dashboards/${id}/`)
export const getUserById = (id) => api.get(`/usuarios/${id}/`)

