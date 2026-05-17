import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import '../../styles/admin-dashboard.css'

import AdminUsers from './sections/AdminUsers'
import AdminWorkers from './sections/AdminWorkers'
import AdminJobs from './sections/AdminJobs'
import AdminReviews from './sections/AdminReviews'
import AdminSettings from './sections/AdminSettings'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', key: 'dashboard' },
  { icon: 'person', label: 'Usuarios', key: 'users' },
  { icon: 'construction', label: 'Operarios', key: 'workers' },
  { icon: 'work', label: 'Trabajos', key: 'jobs' },
  { icon: 'report', label: 'Reviews Reportadas', key: 'reviews' },
  { icon: 'settings', label: 'Configuración', key: 'settings' },
]

interface Stats {
  total_users: number
  total_workers: number
  active_jobs: number
  pending_workers: number
  flagged_reviews: number
}

interface Worker {
  user_id: number
  status: string
  created_at: string
  user: { id: number; name: string; email: string }
}

interface ActivityItem {
  type: string
  text: string
  time: string
  dot: string
}

function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [dashRes, workersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/workers?status=pending'),
      ])
      setStats(dashRes.data.data)
      setActivity(dashRes.data.activity || [])
      setWorkers(workersRes.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleApprove = async (userId: number) => {
    setActionLoading(userId)
    try {
      await api.patch(`/admin/workers/${userId}/approve`)
      setWorkers(prev => prev.filter(w => w.user_id !== userId))
      setStats(prev => prev ? { ...prev, pending_workers: prev.pending_workers - 1 } : prev)
    } catch (err) { console.error(err) }
    finally { setActionLoading(null) }
  }

  const handleReject = async (userId: number) => {
    setActionLoading(userId)
    try {
      await api.patch(`/admin/workers/${userId}/reject`)
      setWorkers(prev => prev.filter(w => w.user_id !== userId))
      setStats(prev => prev ? { ...prev, pending_workers: prev.pending_workers - 1 } : prev)
    } catch (err) { console.error(err) }
    finally { setActionLoading(null) }
  }

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || '?'
  const getInitialColor = (i: number) => ['green', 'teal', 'pink', 'gray'][i % 4]
  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const statCards = [
    { label: 'Total Usuarios', value: stats?.total_users ?? 0, type: 'neutral', icon: 'people', trend: `${stats?.total_workers ?? 0} operarios` },
    { label: 'Operarios Pendientes', value: stats?.pending_workers ?? 0, type: 'amber', icon: 'pending_actions' },
    { label: 'Trabajos Activos', value: stats?.active_jobs ?? 0, type: 'neutral', icon: 'engineering' },
    { label: 'Reviews Reportadas', value: stats?.flagged_reviews ?? 0, type: 'red', icon: 'warning' },
  ]

  return (
    <>
      {loading ? (
        <motion.div className="ad-stats" variants={containerVariants} initial="hidden" animate="visible">
          {[1,2,3,4].map(i => (
            <motion.div
              key={i} variants={itemVariants}
              style={{ height: 100, borderRadius: 16, background: '#efeeea' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div className="ad-stats" variants={containerVariants} initial="hidden" animate="visible">
          {statCards.map((card) => (
            <motion.div
              key={card.label}
              className={`ad-stat-card ${card.type}`}
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(26,47,26,0.12)' }}
            >
              <span className="ad-stat-label">{card.label}</span>
              <div className="ad-stat-bottom">
                <motion.span
                  className="ad-stat-value"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  {card.value}
                </motion.span>
                {card.trend ? (
                  <span className="ad-stat-trend">
                    <span className="material-symbols-outlined">trending_up</span>
                    {card.trend}
                  </span>
                ) : (
                  <span className="material-symbols-outlined ad-stat-icon">{card.icon}</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="ad-grid">
        {/* Pending Workers */}
        <motion.div
          className="ad-table-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="ad-table-header">
            <h3>Operarios Pendientes de Aprobación</h3>
            <button onClick={fetchData}>↻ Actualizar</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {workers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ padding: '40px 24px', textAlign: 'center', color: '#737971' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12, color: '#c3c8bf' }}>
                  how_to_reg
                </span>
                No hay operarios pendientes de aprobación.
              </motion.div>
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
                    <motion.tr
                      key={w.user_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                    >
                      <td>
                        <div className="ad-worker-cell">
                          <motion.div
                            className={`ad-worker-initial ${getInitialColor(i)}`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {getInitial(w.user?.name)}
                          </motion.div>
                          <span className="ad-worker-name">{w.user?.name}</span>
                        </div>
                      </td>
                      <td className="ad-specialty">{w.user?.email}</td>
                      <td className="ad-date">{formatDate(w.created_at)}</td>
                      <td>
                        <div className="ad-actions">
                          <motion.button
                            className="ad-btn-approve"
                            disabled={actionLoading === w.user_id}
                            onClick={() => handleApprove(w.user_id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {actionLoading === w.user_id ? '...' : 'Aprobar'}
                          </motion.button>
                          <motion.button
                            className="ad-btn-reject"
                            disabled={actionLoading === w.user_id}
                            onClick={() => handleReject(w.user_id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {actionLoading === w.user_id ? '...' : 'Rechazar'}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Activity */}
        <motion.div
          className="ad-activity-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3>Actividad Reciente</h3>
          {activity.length === 0 ? (
            <div style={{ color: '#737971', fontSize: 14, padding: '20px 0' }}>
              No hay actividad reciente.
            </div>
          ) : (
            <div className="ad-timeline">
              {activity.map((item, i) => (
                <motion.div
                  key={i}
                  className="ad-timeline-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <motion.div
                    className={`ad-timeline-dot ${item.dot}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                  />
                  <p className="ad-timeline-text">{item.text}</p>
                  <span className="ad-timeline-time">{item.time}</span>
                </motion.div>
              ))}
            </div>
          )}
          <div className="ad-activity-footer">
            <motion.button
              className="ad-btn-view-all"
              onClick={fetchData}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Actualizar Actividad
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const name = user?.name?.split(' ')[0] || 'Admin'
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sectionTitles: Record<string, string> = {
    dashboard: 'Panel de Administración',
    users: 'Usuarios',
    workers: 'Operarios',
    jobs: 'Trabajos',
    reviews: 'Reviews Reportadas',
    settings: 'Configuración',
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'users': return <AdminUsers />
      case 'workers': return <AdminWorkers />
      case 'jobs': return <AdminJobs />
      case 'reviews': return <AdminReviews />
      case 'settings': return <AdminSettings />
      default: return <DashboardHome />
    }
  }

  return (
    <div className="ad-layout">

      {/* SIDEBAR */}
      <motion.aside
        className="ad-sidebar"
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="ad-sidebar-logo"><h1>EDIFEX</h1></div>

        <nav className="ad-sidebar-nav">
          {navItems.map((item, i) => (
            <motion.button
              key={item.key}
              className={`ad-nav-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => setActiveSection(item.key)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </motion.button>
          ))}
        </nav>

        <div className="ad-sidebar-footer">
          <div className="ad-admin-info">
            <motion.div className="ad-admin-avatar" whileHover={{ scale: 1.1 }}>
              {name.charAt(0).toUpperCase()}
            </motion.div>
            <div>
              <div className="ad-admin-name">{user?.name || 'Admin'}</div>
              <span className="ad-admin-badge">Administrador</span>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            className="ad-nav-item"
            style={{ marginTop: 12 }}
            whileHover={{ x: 4 }}
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="ad-main">

        {/* HEADER */}
        <motion.header
          className="ad-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="ad-header-left">
            <h2>{sectionTitles[activeSection]}</h2>
            <p>Bienvenido de nuevo, {name}.</p>
          </div>
          <div className="ad-header-right">
            <motion.button
              className="ad-btn-notif"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined">notifications</span>
            </motion.button>
            <div className="ad-divider" />
            <motion.div className="ad-admin-avatar-sm" whileHover={{ scale: 1.1 }}>
              {name.charAt(0).toUpperCase()}
            </motion.div>
          </div>
        </motion.header>

        {/* SECTION CONTENT */}
        <div style={{ padding: '24px 32px', overflowY: 'auto', flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  )
}

export default AdminDashboard