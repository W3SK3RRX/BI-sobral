import { Navigate } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../utils/auth'

const RequireAuth = ({ children, onlyAdmin = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />
  }

  if (onlyAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" />
  }

  return children
}

export default RequireAuth
