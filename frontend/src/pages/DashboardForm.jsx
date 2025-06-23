import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  createDashboard,
  updateDashboard,
  getDashboardById,
  getUsuarios
} from '../api/admin'
import '../styles/home.css'
import '../styles/dashboardform.css'

const DashboardForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    link: '',
    categoria: '',
    nivel_minimo: 'USUARIO',
    usuarios_permitidos: []
  })

  const editando = Boolean(id)

  useEffect(() => {
    getUsuarios().then(res => setUsuarios(res.data))

    if (editando) {
      getDashboardById(id).then(res => {
        const data = res.data
        setForm({
          ...data,
          usuarios_permitidos: data.usuarios_permitidos || []
        })
      })
    }
  }, [id, editando])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleMultiSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value))
    setForm({ ...form, usuarios_permitidos: selectedOptions })
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
    <div className="dashboard-form-container">
      <h2>{editando ? 'Editar Dashboard' : 'Novo Dashboard'}</h2>
      <form onSubmit={handleSubmit} className="dashboard-form">

        <div className="form-group">
          <label>Nome:</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Link do Power BI (iframe embed):</label>
          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Categoria:</label>
          <input
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nível mínimo de acesso:</label>
          <select
            name="nivel_minimo"
            value={form.nivel_minimo}
            onChange={handleChange}
          >
            <option value="USUARIO">Usuário</option>
            <option value="GESTOR">Gestor</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div className="form-group">
          <label>Usuários Permitidos (exclusivos):</label>
          <div className="checkbox-group">
            {usuarios.map(u => (
              <label key={u.id} className="checkbox-item">
                <input
                  type="checkbox"
                  value={u.id}
                  checked={form.usuarios_permitidos.includes(u.id)}
                  onChange={(e) => {
                    const userId = parseInt(e.target.value)
                    const updated = e.target.checked
                      ? [...form.usuarios_permitidos, userId]
                      : form.usuarios_permitidos.filter(id => id !== userId)
                    setForm({ ...form, usuarios_permitidos: updated })
                  }}
                />
                {u.username} ({u.email})
              </label>
            ))}
          </div>
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

export default DashboardForm
