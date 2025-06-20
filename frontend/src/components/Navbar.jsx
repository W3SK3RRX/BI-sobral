import { useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { getTokenPayload } from '../utils/auth'
import '../styles/navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const payload = getTokenPayload()
  const nome = payload?.username || 'usuário'
  const nivel = payload?.access_level || ''

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleVoltar = () => {
    navigate(-1)
  }

  const handleIrParaAdmin = () => {
    navigate('/admin')
  }

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img
          src="/media/logo.png"
          alt="Logo Sobral"
          className="navbar-logo"
        />
        <strong>Bem-vindo, {nome}</strong>
        {location.pathname !== '/dashboard' && (
          <button className="voltar-btn" onClick={handleVoltar}>⬅ Voltar</button>
        )}
      </div>

      <div className="navbar-right">
        {nivel === 'ADMIN' && (
          <button className="admin-btn" onClick={handleIrParaAdmin}>⚙ Administração</button>
        )}
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  )
}

export default Navbar
