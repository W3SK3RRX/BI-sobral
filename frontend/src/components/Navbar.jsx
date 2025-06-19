import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { getTokenPayload } from '../utils/auth'

const Navbar = () => {
  const navigate = useNavigate()
  const payload = getTokenPayload()
  const nome = payload?.username || 'usuário'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="navbar">
      <div className="navbar-left">
        <strong>Bem-vindo, {nome}</strong>
      </div>
      <div className="navbar-right">
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  )
}

export default Navbar
