import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import WorkerDashboard from './pages/worker/WorkerDashboard'
import ClientDashboard from './pages/client/ClientDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App