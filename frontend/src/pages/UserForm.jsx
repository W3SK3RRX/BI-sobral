import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createUser, updateUser, getUserById } from '../api/admin'
import '../styles/home.css'
import '../styles/userform.css'

const UserForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    access_level: 'USUARIO'
  })

  const editando = Boolean(id)

  useEffect(() => {
    if (editando) {
      getUserById(id).then(res => {
        const { username, email, access_level } = res.data
        setForm({ username, email, access_level, password: '' })
      })
    }
  }, [id, editando])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editando) {
        await updateUser(id, {
          username: form.username,
          email: form.email,
          access_level: form.access_level
        })
      } else {
        await createUser(form)
      }
      navigate('/admin')
    } catch (err) {
      alert('Erro ao salvar o usuário.')
      console.error(err)
    }
  }

  return (
    <div className="user-form-container">
      <h2>{editando ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label>Nome de usuário:</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>E-mail:</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {!editando && (
          <div className="form-group">
            <label>Senha:</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Nível de Acesso:</label>
          <select
            name="access_level"
            value={form.access_level}
            onChange={handleChange}
          >
            <option value="USUARIO">Usuário</option>
            <option value="GESTOR">Gestor</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-salvar">Salvar</button>
          <button type="button" className="btn-cancelar" onClick={() => navigate('/admin')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm
