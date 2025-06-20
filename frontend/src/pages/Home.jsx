import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboards } from '../api/dashboard'
import Navbar from '../components/Navbar'
import '../styles/home.css'

const Home = () => {
  const [dashboards, setDashboards] = useState([])
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas')
  const navigate = useNavigate()

  useEffect(() => {
    getDashboards()
      .then(res => setDashboards(res.data))
      .catch(err => {
        console.error('Erro ao buscar dashboards:', err)
        setDashboards([])
      })
  }, [])

  const categorias = ['Todas', ...new Set(dashboards.map(d => d.categoria))]

  const filtrados = categoriaSelecionada === 'Todas'
    ? dashboards
    : dashboards.filter(d => d.categoria === categoriaSelecionada)

  return (
    <>
      <Navbar />
      <div className="main-content">
        <h1>Power BI - Sobral</h1>

        <label>Filtrar por categoria:</label>
        <select
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
        >
          {categorias.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="dashboards-grid">
          {filtrados.map(d => (
            <div className="card" key={d.id}>
              <h3>{d.nome}</h3>
              <p>{d.descricao}</p>
              <button onClick={() => navigate(`/visualizar/${d.id}`)}>
                Visualizar
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
