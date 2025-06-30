import { useEffect, useState } from 'react'
import {
  listDashboards, deleteDashboard,
  listUsers, deleteUser
} from '../lib/admin'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen bg-gradient-orange-light">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">⚙️ Painel Administrativo</h2>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">📊 Dashboards</h3>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded" onClick={() => navigate('/admin/novo-dashboard')}>+ Novo Dashboard</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-orange-100 text-left">
                  <th className="py-2 px-4">Nome</th>
                  <th className="py-2 px-4">Categoria</th>
                  <th className="py-2 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {dashboards.map(d => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{d.nome}</td>
                    <td className="py-2 px-4">{d.categoria}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded" onClick={() => navigate(`/admin/editar-dashboard/${d.id}`)}>Editar</button>
                      <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded" onClick={() => excluirDashboard(d.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">👤 Usuários</h3>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded" onClick={() => navigate('/admin/novo-usuario')}>+ Novo Usuário</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-orange-100 text-left">
                  <th className="py-2 px-4">Usuário</th>
                  <th className="py-2 px-4">Nível</th>
                  <th className="py-2 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{u.username}</td>
                    <td className="py-2 px-4">{u.access_level}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded" onClick={() => navigate(`/admin/editar-usuario/${u.id}`)}>Editar</button>
                      <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded" onClick={() => excluirUsuario(u.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </motion.main>
    </div>
  )
}

export default AdminPanel
