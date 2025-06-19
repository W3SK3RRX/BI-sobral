import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  createDashboard,
  updateDashboard,
  getDashboardById
} from '../api/admin'

const DashboardForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    link: '',
    categoria: '',
    nivel_minimo: 'USUARIO',
  })

  const editando = Boolean(id)

  useEffect(() => {
    if (editando) {
      getDashboardById(id).then(res => setForm(res.data))
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
        await updateDashboard(id, form)
      } else {
        await createDashboard(form)
      }
      navigate('/admin')
    } catch (err) {
      alert('Erro ao salvar o dashboard.')
      console.error(err)
    }
  }

  return (
    <div className="form-container">
      <h2>{editando ? 'Editar' : 'Novo'} Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          rows={3}
        />
        <input
          name="link"
          placeholder="Link do Power BI (iframe embed)"
          value={form.link}
          onChange={handleChange}
          required
        />
        <input
          name="categoria"
          placeholder="Categoria (Ex: Financeiro)"
          value={form.categoria}
          onChange={handleChange}
          required
        />
        <select
          name="nivel_minimo"
          value={form.nivel_minimo}
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

export default DashboardForm
