import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Páginas
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
// Guards
import PublicOnlyRoute from './guards/PublicOnlyRoute'
import ProtectedRoute from './guards/ProtectedRoute'
// Estilos globales
import "../styles/index.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/login'
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route path='forgot-password' element={<ForgotPasswordPage />} />

        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App