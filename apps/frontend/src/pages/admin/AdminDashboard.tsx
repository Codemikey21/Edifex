import { useNavigate } from 'react-router-dom'
import '../../styles/admin-dashboard.css'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'person', label: 'Usuarios' },
  { icon: 'construction', label: 'Operarios' },
  { icon: 'work', label: 'Trabajos' },
  { icon: 'report', label: 'Reviews Reportadas' },
  { icon: 'settings', label: 'Configuración' },
]

const pendingWorkers = [
  { initial: 'R', color: 'green', name: 'Ricardo M.', specialty: 'Electricista Industrial', date: '14 Oct, 2024' },
  { initial: 'M', color: 'teal', name: 'Marta S.', specialty: 'Arquitecta Técnica', date: '13 Oct, 2024' },
  { initial: 'J', color: 'pink', name: 'Javier L.', specialty: 'Fontanería Pluvial', date: '12 Oct, 2024' },
  { initial: 'C', color: 'gray', name: 'Carlos D.', specialty: 'Carpintería de Aluminio', date: '11 Oct, 2024' },
]

const activity = [
  { dot: 'green', text: 'Nueva review reportada en el trabajo #TR-4592', time: 'Hace 15 minutos' },
  { dot: 'dark', text: 'Operario Marta S. ha completado su perfil profesional', time: 'Hace 2 horas' },
  { dot: 'teal', text: 'Pago procesado correctamente por el usuario Juan Pérez', time: 'Hace 5 horas' },
  { dot: 'red', text: 'Alerta de seguridad: Intento de login fallido múltiples veces', time: 'Hace 8 horas' },
]

function AdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const name = user.name?.split(' ')[0] || 'Admin'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="ad-layout">

      {/* SIDEBAR */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-logo">
          <h1>EDIFEX</h1>
        </div>

        <nav className="ad-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`ad-nav-item ${item.active ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ad-sidebar-footer">
          <div className="ad-admin-info">
            <div className="ad-admin-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="ad-admin-name">{user.name || 'Administrador'}</div>
              <span className="ad-admin-badge">Administrador</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="ad-nav-item"
            style={{ marginTop: 12 }}
          >
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
              <span className="ad-notif-dot" />
            </button>
            <div className="ad-divider" />
            <div className="ad-admin-avatar-sm">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className="ad-stats">
          <div className="ad-stat-card neutral">
            <span className="ad-stat-label">Total Usuarios</span>
            <div className="ad-stat-bottom">
              <span className="ad-stat-value">1,284</span>
              <span className="ad-stat-trend">
                <span className="material-symbols-outlined">trending_up</span>
                +12%
              </span>
            </div>
          </div>
          <div className="ad-stat-card amber">
            <span className="ad-stat-label">Operarios Pendientes</span>
            <div className="ad-stat-bottom">
              <span className="ad-stat-value">24</span>
              <span className="material-symbols-outlined ad-stat-icon">pending_actions</span>
            </div>
          </div>
          <div className="ad-stat-card neutral">
            <span className="ad-stat-label">Trabajos Activos</span>
            <div className="ad-stat-bottom">
              <span className="ad-stat-value">456</span>
              <span className="material-symbols-outlined ad-stat-icon">engineering</span>
            </div>
          </div>
          <div className="ad-stat-card red">
            <span className="ad-stat-label">Reviews Reportadas</span>
            <div className="ad-stat-bottom">
              <span className="ad-stat-value">08</span>
              <span className="material-symbols-outlined ad-stat-icon">warning</span>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="ad-grid">

          {/* LEFT: Pending Workers Table */}
          <div className="ad-table-card">
            <div className="ad-table-header">
              <h3>Operarios Pendientes de Aprobación</h3>
              <button>Ver Todos</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingWorkers.map((w, i) => (
                    <tr key={i}>
                      <td>
                        <div className="ad-worker-cell">
                          <div className={`ad-worker-initial ${w.color}`}>
                            {w.initial}
                          </div>
                          <span className="ad-worker-name">{w.name}</span>
                        </div>
                      </td>
                      <td className="ad-specialty">{w.specialty}</td>
                      <td className="ad-date">{w.date}</td>
                      <td>
                        <div className="ad-actions">
                          <button className="ad-btn-approve">Aprobar</button>
                          <button className="ad-btn-reject">Rechazar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: Activity Timeline */}
          <div className="ad-activity-card">
            <h3>Actividad Reciente</h3>
            <div className="ad-timeline">
              {activity.map((item, i) => (
                <div key={i} className="ad-timeline-item">
                  <div className={`ad-timeline-dot ${item.dot}`} />
                  <p className="ad-timeline-text">{item.text}</p>
                  <span className="ad-timeline-time">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="ad-activity-footer">
              <button className="ad-btn-view-all">Ver Registro Completo</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default AdminDashboard