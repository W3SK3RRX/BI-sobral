import api from './axios'

// DASHBOARDS
export const listDashboards = () => api.get('/dashboards/')
export const createDashboard = (data) => api.post('/dashboards/', data)
export const updateDashboard = (id, data) => api.put(`/dashboards/${id}/`, data)
export const deleteDashboard = (id) => api.delete(`/dashboards/${id}/`)
export const getDashboardById = (id) => api.get(`/dashboards/${id}/`)

// USUÁRIOS
export const listUsers = () => api.get('/users/')
export const getUsuarios = () => api.get('/users/') // ➕ Adicionado para uso no DashboardForm
export const createUser = (data) => api.post('/users/', data)
export const updateUser = (id, data) => api.put(`/users/${id}/`, data)
export const deleteUser = (id) => api.delete(`/users/${id}/`)
export const getUserById = (id) => api.get(`/users/${id}/`)
