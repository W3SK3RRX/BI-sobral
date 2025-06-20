import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { getTokenPayload } from '../utils/auth'
import '../styles/sidebar.css'

const Sidebar = () => {
  const navigate = useNavigate()
  const user = getTokenPayload()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>PowerBI Sobral</h2>
        <p>{user?.username}</p>
        <small>{user?.access_level}</small>
      </div>

      <nav>
        <NavLink to="/dashboard">📊 Dashboards</NavLink>

        {user?.access_level === 'ADMIN' && (
          <NavLink to="/admin">⚙️ Admin</NavLink>
        )}

        <button onClick={handleLogout}>🚪 Sair</button>
      </nav>
    </div>
  )
}

export default Sidebar
