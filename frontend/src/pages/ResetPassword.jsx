import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { trocarSenha } from '../api/auth'
import '../styles/login.css'

const ResetPassword = () => {
  const [novaSenha, setNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setSucesso('')

    try {
      await trocarSenha(novaSenha)
      setSucesso('Senha alterada com sucesso!')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setErro(err.response?.data?.nova_senha?.[0] || 'Erro ao trocar a senha.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Trocar Senha</h2>
        <p>Por segurança, altere sua senha antes de continuar.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />
          <button type="submit">Salvar nova senha</button>
          {erro && <p className="erro">{erro}</p>}
          {sucesso && <p className="sucesso">{sucesso}</p>}
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
