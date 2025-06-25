import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDashboardById } from '../api/dashboard'
import Protections from '../components/Protections'
import Watermark from '../components/Watermark'
import Navbar from '../components/Navbar'
import '../styles/viewer.css'

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
      <>
        <Navbar />
        <div
          className="viewer-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 72px)', // altura total menos navbar
            background: '#000'
          }}
        >
          <p style={{ color: 'white' }}>Carregando...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="viewer-container">
        <Watermark />
        <Protections />
        <iframe
          src={dashboard.link}
          title={dashboard.nome}
          frameBorder="0"
          allowFullScreen
          className="dashboard-frame"
        ></iframe>
        <div style={{ height: '16px' }}></div> {/* espaçamento inferior */}
      </div>
    </>
  )
}

export default DashboardViewer
