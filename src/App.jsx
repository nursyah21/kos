import { HashRouter, Navigate, Route, Routes } from 'react-router'
import useAuthGuard from './hooks/useAuthGuard'
import Index from './pages'
import Dashboard from './pages/dashboard/dashboard'
import DashboardIndex from './pages/dashboard/dashboardIndex'
import Kos from './pages/dashboard/kos'
import Transaksi from './pages/dashboard/transaksi'
import Login from './pages/login'
import Penghuni from './pages/dashboard/users/penghuni'
import Users from './pages/dashboard/users/users'

function App() {
  const { ProtectedRoute, PublicRoute } = useAuthGuard()

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        } >
            <Route index element={<DashboardIndex />} />
            <Route path="kos" element={<Kos />} />
            <Route path="transaksi" element={<Transaksi />} />
            <Route path="users" element={<Users />} >
              <Route index element={<Navigate to={'penghuni'} />} />
              <Route path='penghuni' element={<Penghuni />} />
              <Route path='petugas' element={<Penghuni />} />
            </Route>
        </Route>

      </Routes>
    </HashRouter>
  )
}

export default App
