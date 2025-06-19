import api from './axios'

export const getDashboards = () => {
  return api.get('/dashboards/')
}

export const getDashboardById = (id) => {
  return api.get(`/dashboards/${id}/`)
}
