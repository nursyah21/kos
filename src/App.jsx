import { Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router'
import useAuthGuard from './hooks/useAuthGuard'
import Index from './pages'
import Dashboard from './pages/dashboard/dashboard'
import DashboardIndex from './pages/dashboard/dashboardIndex'
import Kos from './pages/dashboard/kos'
import Penghuni from './pages/dashboard/penghuni'
import Transaksi from './pages/dashboard/transaksi'
import Login from './pages/login'

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
            <Route path="penghuni" element={<Penghuni />} />
            <Route path="transaksi" element={<Transaksi />} />
        </Route>

      </Routes>
    </HashRouter>
  )
}

export default App
