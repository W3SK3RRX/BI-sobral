import { useState } from 'react'
import { trocarSenha } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css' // usa o mesmo CSS da tela de login

const TrocarSenha = () => {
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensagem('')
    setErro('')

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    try {
      await trocarSenha({ nova_senha: novaSenha })
      setMensagem('Senha alterada com sucesso.')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setErro('Erro ao trocar senha.')
      console.error(err)
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
        <h2>Nova Senha</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={e => setNovaSenha(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={e => setConfirmarSenha(e.target.value)}
            required
          />
          <button type="submit">Salvar nova senha</button>
          {mensagem && <p className="sucesso">{mensagem}</p>}
          {erro && <p className="erro">{erro}</p>}
        </form>
      </div>
    </div>
  )
}

export default TrocarSenha
