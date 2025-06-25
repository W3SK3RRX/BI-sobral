import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import DashboardViewer from './pages/DashboardViewer.jsx'
import AdminPanel from './pages/AdminPanel'
import DashboardForm from './pages/DashboardForm'
import UserForm from './pages/UserForm'
import RequireAuth from './components/RequireAuth'
import ResetPassword from './pages/ResetPassword.jsx'
import TrocarSenha from './pages/TrocarSenha.jsx'
//<Route path="/trocar-senha" element={<ResetPassword />} />

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/visualizar/:id" element={<DashboardViewer />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/novo-dashboard" element={<DashboardForm />} />
        <Route path="/admin/editar-dashboard/:id" element={<DashboardForm />} />
        <Route path="/admin/novo-usuario" element={<UserForm />} />
        <Route path="/admin/editar-usuario/:id" element={<UserForm />} />
        
        <Route path="/trocar-senha" element={<TrocarSenha />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
