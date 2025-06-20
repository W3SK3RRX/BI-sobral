import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import '../styles/login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')

    try {
      const response = await login(email, senha)
      localStorage.setItem('access', response.data.access)
      localStorage.setItem('refresh', response.data.refresh)

      navigate('/dashboard')
    } catch (err) {
      setErro('E-mail ou senha inválidos.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <img
          src="/media/logo.png"
          alt="Logo Laboratório Sobral"
          className="login-logo"
        />
        <h2>Power BI - Sobral</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          {erro && <p className="erro">{erro}</p>}
        </form>
      </div>
    </div>
  )
}

export default Login
