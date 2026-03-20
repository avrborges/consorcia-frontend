import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Páginas
import HomePage           from '../pages/home'
import LoginPage          from '../pages/login'
import ForgotPasswordPage from '../pages/forgot-password'
import DashboardLayout    from '../pages/dashboard-layout'
import Dashboard          from '../pages/dashboard'
import Expensas           from '../pages/expensas'
import PagoPage           from '../pages/expensas/pago'
// Guards
import AuthGuard from './guards/AuthGuard'
// Estilos globales
import "../styles/index.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />

        {/* Layout del dashboard — envuelve todas las páginas internas */}
        <Route element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }>
          <Route path="/dashboard"              element={<Dashboard />} />
          <Route path="/expensas"               element={<Expensas />} />
          <Route path="/expensas/pagar/:id"     element={<PagoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App