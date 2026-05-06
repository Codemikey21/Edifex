import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function ClientDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(storedUser))
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/my-jobs')
      setJobs(res.data.data || [])
    } catch (error) {
      console.error('Error cargando trabajos')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
      <div className="text-[#1A2F1A] text-sm">Cargando...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      {/* Header */}
      <div className="bg-[#1A2F1A] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.svg" alt="Edifex" className="w-12 h-12 object-contain" />
          <span className="text-white font-bold text-lg tracking-widest">EDIFEX</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-sm">Hola, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-white/70 text-sm hover:text-white transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        {/* Bienvenida */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-medium text-[#1A2F1A]">Dashboard Cliente</h1>
            <p className="text-gray-400 text-sm mt-1">Gestiona tus trabajos y contrataciones</p>
          </div>
          <button
            onClick={() => navigate('/client/post-job')}
            className="bg-[#1A2F1A] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-[#2D4A2D] transition-colors"
          >
            + Publicar trabajo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Trabajos publicados', value: jobs.length },
            { label: 'En progreso', value: jobs.filter(j => j.status === 'in_progress').length },
            { label: 'Completados', value: jobs.filter(j => j.status === 'completed').length },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-[#E8E4DA]">
              <div className="text-2xl font-medium text-[#1A2F1A]">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Lista de trabajos */}
        <div className="bg-white rounded-2xl border border-[#E8E4DA] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8E4DA]">
            <h2 className="font-medium text-[#1A2F1A]">Mis trabajos</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-sm">No tienes trabajos publicados aún.</p>
              <button
                onClick={() => navigate('/client/post-job')}
                className="mt-4 bg-[#1A2F1A] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#2D4A2D] transition-colors"
              >
                Publicar primer trabajo
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EBE0]">
              {jobs.map((job) => (
                <div key={job.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1A2F1A]">{job.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{job.category} · {job.city}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    job.status === 'published' ? 'bg-green-100 text-green-700' :
                    job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard