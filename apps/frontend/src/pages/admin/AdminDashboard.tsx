import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import '../../styles/admin-dashboard.css'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'person', label: 'Usuarios' },
  { icon: 'construction', label: 'Operarios' },
  { icon: 'work', label: 'Trabajos' },
  { icon: 'report', label: 'Reviews Reportadas' },
  { icon: 'settings', label: 'Configuración' },
]

interface Stats {
  total_users: number
  total_workers: number
  total_clients: number
  active_jobs: number
  pending_workers: number
  flagged_reviews: number
}

interface Worker {
  user_id: number
  status: string
  bio: string
  created_at: string
  user: {
    id: number
    name: string
    email: string
    created_at: string
  }
}

interface ActivityItem {
  type: string
  text: string
  time: string
  dot: string
}

function AdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const name = user.name?.split(' ')[0] || 'Admin'

  const [stats, setStats] = useState<Stats | null>(null)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchData = async () => {
    try {
      const [dashRes, workersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/workers?status=pending'),
      ])
      setStats(dashRes.data.data)
      setActivity(dashRes.data.activity || [])
      setWorkers(workersRes.data.data || [])
    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = async (userId: number) => {
    setActionLoading(userId)
    try {
      await api.patch(`/admin/workers/${userId}/approve`)
      setWorkers(prev => prev.filter(w => w.user_id !== userId))
      setStats(prev => prev ? { ...prev, pending_workers: prev.pending_workers - 1 } : prev)
    } catch (err) {
      console.error('Error approving worker:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (userId: number) => {
    setActionLoading(userId)
    try {
      await api.patch(`/admin/workers/${userId}/reject`)
      setWorkers(prev => prev.filter(w => w.user_id !== userId))
      setStats(prev => prev ? { ...prev, pending_workers: prev.pending_workers - 1 } : prev)
    } catch (err) {
      console.error('Error rejecting worker:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || '?'
  const getInitialColor = (i: number) => {
    const colors = ['green', 'teal', 'pink', 'gray']
    return colors[i % colors.length]
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="ad-layout">

      {/* SIDEBAR */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-logo"><h1>EDIFEX</h1></div>
        <nav className="ad-sidebar-nav">
          {navItems.map((item) => (
            <button key={item.label} className={`ad-nav-item ${item.active ? 'active' : ''}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="ad-sidebar-footer">
          <div className="ad-admin-info">
            <div className="ad-admin-avatar">{name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="ad-admin-name">{user.name || 'Admin'}</div>
              <span className="ad-admin-badge">Administrador</span>
            </div>
          </div>
          <button onClick={handleLogout} className="ad-nav-item" style={{ marginTop: 12 }}>
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ad-main">

        {/* HEADER */}
        <header className="ad-header">
          <div className="ad-header-left">
            <h2>Panel de Administración</h2>
            <p>Bienvenido de nuevo, {name}. Aquí está el resumen de hoy.</p>
          </div>
          <div className="ad-header-right">
            <button className="ad-btn-notif">
              <span className="material-symbols-outlined">notifications</span>
              {stats && stats.pending_workers > 0 && <span className="ad-notif-dot" />}
            </button>
            <div className="ad-divider" />
            <div className="ad-admin-avatar-sm">{name.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        {/* STATS */}
        {loading ? (
          <div style={{ padding: '40px 0', color: '#737971', fontSize: 16 }}>
            Cargando datos...
          </div>
        ) : (
          <div className="ad-stats">
            <div className="ad-stat-card neutral">
              <span className="ad-stat-label">Total Usuarios</span>
              <div className="ad-stat-bottom">
                <span className="ad-stat-value">{stats?.total_users ?? 0}</span>
                <span className="ad-stat-trend">
                  <span className="material-symbols-outlined">trending_up</span>
                  {stats?.total_workers ?? 0} operarios
                </span>
              </div>
            </div>
            <div className="ad-stat-card amber">
              <span className="ad-stat-label">Operarios Pendientes</span>
              <div className="ad-stat-bottom">
                <span className="ad-stat-value">{stats?.pending_workers ?? 0}</span>
                <span className="material-symbols-outlined ad-stat-icon">pending_actions</span>
              </div>
            </div>
            <div className="ad-stat-card neutral">
              <span className="ad-stat-label">Trabajos Activos</span>
              <div className="ad-stat-bottom">
                <span className="ad-stat-value">{stats?.active_jobs ?? 0}</span>
                <span className="material-symbols-outlined ad-stat-icon">engineering</span>
              </div>
            </div>
            <div className="ad-stat-card red">
              <span className="ad-stat-label">Reviews Reportadas</span>
              <div className="ad-stat-bottom">
                <span className="ad-stat-value">{stats?.flagged_reviews ?? 0}</span>
                <span className="material-symbols-outlined ad-stat-icon">warning</span>
              </div>
            </div>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="ad-grid">

          {/* LEFT: Pending Workers Table */}
          <div className="ad-table-card">
            <div className="ad-table-header">
              <h3>Operarios Pendientes de Aprobación</h3>
              <button onClick={fetchData}>↻ Actualizar</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {workers.length === 0 ? (
                <div style={{ padding: '32px 24px', color: '#737971', textAlign: 'center' }}>
                  No hay operarios pendientes de aprobación.
                </div>
              ) : (
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((w, i) => (
                      <tr key={w.user_id}>
                        <td>
                          <div className="ad-worker-cell">
                            <div className={`ad-worker-initial ${getInitialColor(i)}`}>
                              {getInitial(w.user?.name)}
                            </div>
                            <span className="ad-worker-name">{w.user?.name}</span>
                          </div>
                        </td>
                        <td className="ad-specialty">{w.user?.email}</td>
                        <td className="ad-date">{formatDate(w.created_at)}</td>
                        <td>
                          <div className="ad-actions">
                            <button
                              className="ad-btn-approve"
                              disabled={actionLoading === w.user_id}
                              onClick={() => handleApprove(w.user_id)}
                            >
                              {actionLoading === w.user_id ? '...' : 'Aprobar'}
                            </button>
                            <button
                              className="ad-btn-reject"
                              disabled={actionLoading === w.user_id}
                              onClick={() => handleReject(w.user_id)}
                            >
                              {actionLoading === w.user_id ? '...' : 'Rechazar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* RIGHT: Activity Timeline */}
          <div className="ad-activity-card">
            <h3>Actividad Reciente</h3>
            {activity.length === 0 ? (
              <div style={{ color: '#737971', fontSize: 14 }}>
                No hay actividad reciente.
              </div>
            ) : (
              <div className="ad-timeline">
                {activity.map((item, i) => (
                  <div key={i} className="ad-timeline-item">
                    <div className={`ad-timeline-dot ${item.dot}`} />
                    <p className="ad-timeline-text">{item.text}</p>
                    <span className="ad-timeline-time">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="ad-activity-footer">
              <button className="ad-btn-view-all" onClick={fetchData}>
                Actualizar Actividad
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default AdminDashboard