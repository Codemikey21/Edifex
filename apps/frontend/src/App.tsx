import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import WorkerDashboard from './pages/worker/WorkerDashboard'
import ClientDashboard from './pages/client/ClientDashboard'
import WorkerOnboarding from './pages/worker/WorkerOnboarding'
import AdminDashboard from './pages/admin/AdminDashboard'
import ChatPage from './pages/chat/ChatPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/worker/onboarding" element={<WorkerOnboarding />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App