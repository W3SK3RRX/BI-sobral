import { useEffect, useState } from 'react'
import {
  listDashboards, deleteDashboard,
  listUsers, deleteUser
} from '../api/admin'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/adminpanel.css'

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
    <>
      <Navbar />
      <div className="admin-panel">
        <h2 className="titulo-principal">⚙️ Painel Administrativo</h2>

        <section className="admin-section">
          <div className="admin-header">
            <h3>📊 Dashboards</h3>
            <button className="btn-novo" onClick={() => navigate('/admin/novo-dashboard')}>+ Novo Dashboard</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dashboards.map(d => (
                <tr key={d.id}>
                  <td>{d.nome}</td>
                  <td>{d.categoria}</td>
                  <td>
                    <button className="btn-editar" onClick={() => navigate(`/admin/editar-dashboard/${d.id}`)}>Editar</button>
                    <button className="btn-excluir" onClick={() => excluirDashboard(d.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-section">
          <div className="admin-header">
            <h3>👤 Usuários</h3>
            <button className="btn-novo" onClick={() => navigate('/admin/novo-usuario')}>+ Novo Usuário</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Nível</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.access_level}</td>
                  <td>
                    <button className="btn-editar" onClick={() => navigate(`/admin/editar-usuario/${u.id}`)}>Editar</button>
                    <button className="btn-excluir" onClick={() => excluirUsuario(u.id)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}

export default AdminPanel
