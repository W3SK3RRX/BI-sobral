import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { logout, getUsuarioLogado } from '../api/auth'
import '../styles/navbar.css'

const Navbar = () => {
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    getUsuarioLogado()
      .then(res => setUsuario(res.data))
      .catch(() => {
        logout()
        navigate('/')
      })
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleVoltar = () => navigate(-1)
  const handleIrParaAdmin = () => navigate('/admin')
  const handleIrParaHome = () => navigate('/dashboard')

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img
          src="/media/logo.png"
          alt="Logo Sobral"
          className="navbar-logo"
        />
        <strong>Bem-vindo, {usuario?.username || '...'}</strong>

        {location.pathname !== '/dashboard' && (
          <>
            <button className="voltar-btn" onClick={handleIrParaHome}>⬅ Voltar</button>
            {/*<button className="home-btn" onClick={handleIrParaHome}>Home</button>*/}
          </>
        )}
      </div>

      <div className="navbar-right">
        {usuario?.access_level === 'ADMIN' && (
          <button className="admin-btn" onClick={handleIrParaAdmin}>
            ⚙ Administração
          </button>
        )}
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  )
}

export default Navbar
