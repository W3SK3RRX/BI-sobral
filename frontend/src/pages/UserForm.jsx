import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  createUser,
  updateUser,
  getUserById
} from '../api/admin'

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
    <div className="form-container">
      <h2>{editando ? 'Editar' : 'Novo'} Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Nome de usuário"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        {!editando && (
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}
        <select
          name="access_level"
          value={form.access_level}
          onChange={handleChange}
        >
          <option value="USUARIO">Usuário</option>
          <option value="GESTOR">Gestor</option>
          <option value="ADMIN">Administrador</option>
        </select>

        <button type="submit">Salvar</button>
        <button type="button" onClick={() => navigate('/admin')}>Cancelar</button>
      </form>
    </div>
  )
}

export default UserForm
