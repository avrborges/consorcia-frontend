import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Páginas
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import DashboardLayout from '../pages/DashboardLayout'
import Expensas from '../pages/Expensas'
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expensas"  element={<Expensas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App