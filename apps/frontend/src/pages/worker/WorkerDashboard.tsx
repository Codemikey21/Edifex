import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

function WorkerDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(storedUser))
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/worker/profile')
      setProfile(res.data.data)
    } catch (error) {
      console.error('Sin perfil aún')
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
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-[#1A2F1A]">Dashboard Operario</h1>
          <p className="text-gray-400 text-sm mt-1">Gestiona tu perfil y trabajos</p>
        </div>

        {/* Estado del perfil */}
        <div className={`rounded-2xl p-6 mb-6 border ${
          profile?.status === 'active'
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              profile?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <div>
              <p className="text-sm font-medium text-[#1A2F1A]">
                {profile?.status === 'active'
                  ? '✅ Perfil aprobado — apareces en el marketplace'
                  : '⏳ Perfil pendiente de aprobación por el administrador'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {profile?.status === 'active'
                  ? 'Los clientes pueden encontrarte y contactarte'
                  : 'Completa tu perfil para agilizar la aprobación'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Rating', value: profile?.rating || '0.0', suffix: '★' },
            { label: 'Reseñas', value: profile?.total_reviews || 0 },
            { label: 'Trabajos', value: profile?.total_jobs_completed || 0 },
            { label: 'Skills', value: profile?.skills?.length || 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-[#E8E4DA]">
              <div className="text-2xl font-medium text-[#1A2F1A]">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E4DA]">
            <h3 className="font-medium text-[#1A2F1A] mb-2">Completa tu perfil</h3>
            <p className="text-sm text-gray-400 mb-4">Agrega tus skills, experiencia y sube tu CV para aumentar tus chances.</p>
            <button
              onClick={() => navigate('/worker/onboarding')}
              className="bg-[#1A2F1A] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#2D4A2D] transition-colors"
            >
              Completar perfil
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E4DA]">
            <h3 className="font-medium text-[#1A2F1A] mb-2">Mis conversaciones</h3>
            <p className="text-sm text-gray-400 mb-4">Revisa los mensajes de clientes interesados en tus servicios.</p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-[#1A2F1A] text-white text-sm px-5 py-2.5 rounded-xl hover:bg-[#2D4A2D] transition-colors"
            >
              Ver mensajes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerDashboard