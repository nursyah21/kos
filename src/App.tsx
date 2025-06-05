import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import useAuthGuard from './hooks/useAuthGuard'
import Index from './pages'
import Dashboard from './pages/dashboard/dashboard'
import DashboardIndex from './pages/dashboard/dashboardIndex'
import Transaksi from './pages/dashboard/transaksi'
import TransaksiArchive from './pages/dashboard/transaksiArchive'
import Kamar from './pages/dashboard/unit/kamar'
import Kos from './pages/dashboard/unit/kos'
import Penghuni from './pages/dashboard/users/penghuni'
import Petugas from './pages/dashboard/users/petugas'
import Invoice from './pages/invoice'
import Login from './pages/login'

function App() {
  const { ProtectedRoute, PublicRoute } = useAuthGuard()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />


        {/* invoice can be access without login, because is for customer */}
        <Route path='/invoice/:id' element={<Invoice />} />

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
          <Route path="users" >
            <Route index element={<Navigate to={'penghuni'} />} />
            <Route path='penghuni' element={<Penghuni />} />
            <Route path='petugas' element={<Petugas />} />
          </Route>
          <Route path="transaksi" element={<Transaksi />} />
          <Route path="transaksi/deleted" element={<TransaksiArchive />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
