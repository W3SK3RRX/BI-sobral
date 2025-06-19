import { useEffect, useState } from 'react'
import {
  listDashboards, deleteDashboard,
  listUsers, deleteUser
} from '../api/admin'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
  const [dashboards, setDashboards] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [resDash, resUser] = await Promise.all([
        listDashboards(),
        listUsers()
      ])
      setDashboards(resDash.data)
      setUsuarios(resUser.data)
    } catch (err) {
      console.error('Erro ao carregar dados do painel admin:', err)
    }
  }

  const excluirDashboard = async (id) => {
    if (confirm('Deseja excluir este dashboard?')) {
      await deleteDashboard(id)
      carregarDados()
    }
  }

  const excluirUsuario = async (id) => {
    if (confirm('Deseja excluir este usuário?')) {
      await deleteUser(id)
      carregarDados()
    }
  }

  return (
    <div className="admin-panel">
      <h2>Painel Administrativo</h2>

      <section>
        <h3>Dashboards</h3>
        <button onClick={() => navigate('/admin/novo-dashboard')}>Novo Dashboard</button>
        <ul>
          {dashboards.map(d => (
            <li key={d.id}>
              {d.nome} — {d.categoria}
              <button onClick={() => navigate(`/admin/editar-dashboard/${d.id}`)}>Editar</button>
              <button onClick={() => excluirDashboard(d.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Usuários</h3>
        <button onClick={() => navigate('/admin/novo-usuario')}>Novo Usuário</button>
        <ul>
          {usuarios.map(u => (
            <li key={u.id}>
              {u.username} — {u.access_level}
              <button onClick={() => navigate(`/admin/editar-usuario/${u.id}`)}>Editar</button>
              <button onClick={() => excluirUsuario(u.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default AdminPanel
