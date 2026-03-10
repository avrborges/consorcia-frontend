import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Dashboard from '../pages/Dashboard'
import DemoPage from '../pages/DemoPage'
import "../styles/theme.css"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/demo' element={<DemoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
