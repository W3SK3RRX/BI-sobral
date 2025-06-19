import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDashboardById } from '../api/dashboard'
import Protections from '../components/Protections'
import Watermark from '../components/Watermark'

const DashboardViewer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)

  useEffect(() => {
    getDashboardById(id)
      .then(res => setDashboard(res.data))
      .catch(err => {
        console.error('Erro ao carregar dashboard:', err)
        navigate('/dashboard')
      })
  }, [id, navigate])

if (!dashboard) {
  return (
    <div className="viewer-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white' }}>Carregando...</p>
    </div>
  )
}

  return (
    <div className="viewer-container">
      <Protections />
      <Watermark />
      <iframe
        src={dashboard.link}
        title={dashboard.nome}
        frameBorder="0"
        allowFullScreen
        className="dashboard-frame"
      ></iframe>
    </div>
  )
}

export default DashboardViewer
