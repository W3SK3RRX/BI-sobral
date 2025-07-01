import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth.jsx';
import { LoginPage } from '@/pages/LoginPage';
import { ChangePasswordPage } from '@/pages/ChangePasswordPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AdminPanel from '@/pages/AdminPanel'
import NovoDashboard from '@/pages/NovoDashboard';
import EditarDashboard from '@/pages/EditarDashboard';
import NovoUsuario from '@/pages/NovoUsuario';
import EditarUsuario from '@/pages/EditarUsuario';

import './App.css';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredAccessLevel="ADMIN">
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/novo-dashboard"
                element={
                  <ProtectedRoute requiredAccessLevel="ADMIN">
                    <NovoDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/editar-dashboard/:id"
                element={
                  <ProtectedRoute requiredAccessLevel="ADMIN">
                    <EditarDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/novo-usuario"
                element={
                  <ProtectedRoute requiredAccessLevel="ADMIN">
                    <NovoUsuario />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/editar-usuario/:id"
                element={
                  <ProtectedRoute requiredAccessLevel="ADMIN">
                    <EditarUsuario />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
