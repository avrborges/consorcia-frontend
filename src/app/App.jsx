import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import DemoPage from '../pages/DemoPage'
import "../styles/theme.css"
import ForgotPasswordPage from '../pages/ForgotPasswordPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/demo' element={<DemoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
