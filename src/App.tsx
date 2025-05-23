import { HashRouter, Navigate, Route, Routes } from 'react-router'
import useAuthGuard from './hooks/useAuthGuard'
import Index from './pages'
import Dashboard from './pages/dashboard/dashboard'
import DashboardIndex from './pages/dashboard/dashboardIndex'
import Transaksi from './pages/dashboard/transaksi'
import Penghuni from './pages/dashboard/users/penghuni'
import Petugas from './pages/dashboard/users/petugas'
import Login from './pages/login'
import Kamar from './pages/dashboard/unit/kamar'
import Kos from './pages/dashboard/unit/kos'

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
          <Route path="unit" >
            <Route index element={<Navigate to={'kamar'} />} />
            <Route path='kamar' element={<Kamar />} />
            <Route path='kos' element={<Kos />} />
          </Route>
          <Route path="transaksi" element={<Transaksi />} />
          <Route path="users" >
            <Route index element={<Navigate to={'penghuni'} />} />
            <Route path='penghuni' element={<Penghuni />} />
            <Route path='petugas' element={<Petugas />} />
          </Route>
        </Route>

      </Routes>
    </HashRouter>
  )
}

export default App
