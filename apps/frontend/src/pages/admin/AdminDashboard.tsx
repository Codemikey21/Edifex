import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [workers, setWorkers] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) { navigate('/login'); return }
    const u = JSON.parse(storedUser)
    if (u.role !== 'admin') { navigate('/'); return }
    setUser(u)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, workersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/workers?status=pending'),
      ])
      setStats(statsRes.data.data)
      setWorkers(workersRes.data.data || [])
    } catch (error) {
      console.error('Error cargando datos admin')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (workerId: number) => {
    try {
      await api.patch(`/admin/workers/${workerId}/approve`)
      setWorkers(workers.filter(w => w.user_id !== workerId))
      setStats((prev: any) => ({ ...prev, pending_workers: prev.pending_workers - 1 }))
    } catch (error) {
      console.error('Error aprobando operario')
    }
  }

  const handleSuspend = async (workerId: number) => {
    try {
      await api.patch(`/admin/workers/${workerId}/suspend`)
      setWorkers(workers.filter(w => w.user_id !== workerId))
    } catch (error) {
      console.error('Error suspendiendo operario')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
      <div className="text-[#1A2F1A] text-sm">Cargando panel admin...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex">

      <div className="w-56 bg-[#1A2F1A] min-h-screen flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/src/assets/logo.svg" alt="Edifex" className="w-10 h-10 object-contain" />
            <span className="text-white font-bold text-sm tracking-widest">EDIFEX</span>
          </div>
          <div className="text-white/40 text-xs mt-1">Panel Admin</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'workers', label: 'Operarios' },
            { id: 'users', label: 'Usuarios' },
            { id: 'jobs', label: 'Trabajos' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-white/60 text-xs mb-1">{user?.name}</div>
          <button onClick={handleLogout} className="text-white/40 text-xs hover:text-white transition-colors">
            Cerrar sesion
          </button>
        </div>
      </div>

      <div className="flex-1 p-8">

        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-medium text-[#1A2F1A] mb-6">Dashboard</h1>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Usuarios totales', value: stats?.total_users || 0 },
                { label: 'Operarios', value: stats?.total_workers || 0 },
                { label: 'Clientes', value: stats?.total_clients || 0 },
                { label: 'Trabajos activos', value: stats?.active_jobs || 0 },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 border border-[#E8E4DA]">
                  <div className="text-3xl font-medium text-[#1A2F1A]">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            {stats?.pending_workers > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                <p className="text-sm font-medium text-yellow-800">
                  {stats.pending_workers} operario(s) esperando aprobacion
                </p>
                <button onClick={() => setActiveTab('workers')} className="text-xs text-yellow-700 underline mt-1">
                  Ver operarios pendientes
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workers' && (
          <div>
            <h1 className="text-2xl font-medium text-[#1A2F1A] mb-6">
              Operarios pendientes
              {workers.length > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-700 text-sm px-2 py-0.5 rounded-full">
                  {workers.length}
                </span>
              )}
            </h1>
            {workers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8E4DA] p-12 text-center">
                <p className="text-gray-400 text-sm">No hay operarios pendientes de aprobacion</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workers.map((worker) => (
                  <div key={worker.id} className="bg-white rounded-2xl border border-[#E8E4DA] p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#1A2F1A] flex items-center justify-center text-white text-sm font-medium">
                            {worker.user?.name?.charAt(0) || 'O'}
                          </div>
                          <div>
                            <p className="font-medium text-[#1A2F1A] text-sm">{worker.user?.name}</p>
                            <p className="text-xs text-gray-400">{worker.user?.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {worker.categories?.map((cat: string) => (
                            <span key={cat} className="text-xs bg-[#F5F2ED] text-gray-500 px-2 py-1 rounded-full">
                              {cat}
                            </span>
                          ))}
                        </div>
                        {worker.bio && (
                          <p className="text-xs text-gray-400 mt-2 max-w-md">{worker.bio}</p>
                        )}
                        {worker.cv_url && (
                          <a href={worker.cv_url} target="_blank" rel="noreferrer" className="text-xs text-[#1A2F1A] underline mt-1 block">
                            Ver CV
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(worker.user_id)}
                          className="bg-green-600 text-white text-xs px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleSuspend(worker.user_id)}
                          className="bg-red-50 text-red-600 border border-red-200 text-xs px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h1 className="text-2xl font-medium text-[#1A2F1A] mb-6">Usuarios</h1>
            <div className="bg-white rounded-2xl border border-[#E8E4DA] p-12 text-center">
              <p className="text-gray-400 text-sm">Lista de usuarios - proximamente</p>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <h1 className="text-2xl font-medium text-[#1A2F1A] mb-6">Trabajos</h1>
            <div className="bg-white rounded-2xl border border-[#E8E4DA] p-12 text-center">
              <p className="text-gray-400 text-sm">Lista de trabajos - proximamente</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard