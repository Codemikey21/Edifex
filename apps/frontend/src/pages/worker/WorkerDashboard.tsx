import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../services/api'
import '../../styles/worker-dashboard.css'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'person', label: 'Mi Perfil' },
  { icon: 'construction', label: 'Mis Habilidades' },
  { icon: 'description', label: 'Mi CV' },
  { icon: 'work', label: 'Trabajos Disponibles' },
  { icon: 'send', label: 'Mis Postulaciones' },
  { icon: 'chat', label: 'Chat' },
  { icon: 'settings', label: 'Configuración' },
]

function WorkerDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const name = user.name?.split(' ')[0] || 'Operario'

  const [profile, setProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, jobsRes] = await Promise.all([
          api.get('/worker/profile').catch(() => ({ data: null })),
          api.get('/jobs').catch(() => ({ data: { data: [] } })),
        ])
        setProfile(profileRes.data)
        setJobs(jobsRes.data?.data?.slice(0, 3) || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const stats = [
    { label: 'Postulaciones Enviadas', value: '0', icon: 'send' },
    { label: 'Trabajos Completados', value: '0', icon: 'check_circle' },
    { label: 'Calificación Promedio', value: '—', icon: 'star' },
    { label: 'Perfil Completado', value: profile ? '85%' : '20%', icon: 'person' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="wd-layout">

      {/* SIDEBAR */}
      <motion.aside
        className="wd-sidebar"
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="wd-sidebar-logo">
          <h1>EDIFEX</h1>
        </div>

        <nav className="wd-sidebar-nav">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              className={`wd-nav-item ${item.active ? 'active' : ''}`}
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

        <div className="wd-sidebar-footer">
          <div className="wd-user-info">
            <motion.div
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#3f6743', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0
              }}
              whileHover={{ scale: 1.1 }}
            >
              {name.charAt(0).toUpperCase()}
            </motion.div>
            <div>
              <div className="name">{user.name || 'Operario'}</div>
              <span className="wd-user-badge">Operario</span>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            className="wd-nav-item"
            style={{ marginTop: 12 }}
            whileHover={{ x: 4 }}
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="wd-main">

        {/* HEADER */}
        <motion.header
          className="wd-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="wd-header-left">
            <h2>Buenos días, {name}.</h2>
            <div className="wd-header-meta">
              <span className="wd-badge-pending">
                {profile ? 'Perfil Activo' : 'Pendiente Aprobación'}
              </span>
              <p>{profile ? 'Tu perfil está verificado.' : 'Tu perfil está bajo revisión editorial.'}</p>
            </div>
          </div>
          <div className="wd-header-right">
            <motion.button
              className="wd-btn-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined">notifications</span>
            </motion.button>
            <motion.button
              className="wd-btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Buscar Trabajos
            </motion.button>
          </div>
        </motion.header>

        {/* STATS */}
        <motion.div
          className="wd-stats"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="wd-stat-card"
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(26,47,26,0.12)' }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p className="stat-label">{stat.label}</p>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#3f6743' }}>
                  {stat.icon}
                </span>
              </div>
              <p className="stat-value">{loading ? '...' : stat.value}</p>
              {i === 3 && !loading && (
                <div className="wd-progress-bar" style={{ marginTop: 8 }}>
                  <motion.div
                    className="wd-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: profile ? '85%' : '20%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* MAIN GRID */}
        <div className="wd-grid">

          {/* LEFT: Jobs */}
          <section>
            <motion.div
              className="wd-section-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3>Trabajos Disponibles</h3>
              <a href="#">Ver Todo</a>
            </motion.div>

            <div className="wd-jobs">
              {loading ? (
                [1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    className="wd-job-card"
                    style={{ height: 100, background: '#efeeea', borderRadius: 16 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                ))
              ) : jobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ padding: '32px', textAlign: 'center', color: '#737971' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12 }}>work_off</span>
                  No hay trabajos disponibles aún.
                </motion.div>
              ) : (
                jobs.map((job, i) => (
                  <motion.article
                    key={job.id}
                    className="wd-job-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(26,47,26,0.1)' }}
                  >
                    <div style={{ flex: 1 }}>
                      <div className="wd-job-tags">
                        <span className="wd-tag wd-tag-skill">{job.category || 'Construcción'}</span>
                        {job.status === 'published' && <span className="wd-tag wd-tag-urgent">Activo</span>}
                      </div>
                      <h4 className="wd-job-title">{job.title}</h4>
                      <p className="wd-job-client">{job.location || 'Colombia'}</p>
                      <div className="wd-job-meta">
                        <span className="wd-job-price">${Number(job.budget_min || 0).toLocaleString()} - ${Number(job.budget_max || 0).toLocaleString()}</span>
                        <span className="wd-job-time">
                          <span className="material-symbols-outlined">schedule</span>
                          {new Date(job.created_at).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      className="wd-btn-outline"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Ver Detalles
                    </motion.button>
                  </motion.article>
                ))
              )}
            </div>
          </section>

          {/* RIGHT: Profile completion + Banner */}
          <section>
            <motion.div
              className="wd-section-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3>Mi Perfil</h3>
            </motion.div>

            <motion.div
              className="wd-applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { label: 'Nombre completo', done: !!user.name },
                { label: 'Perfil de operario', done: !!profile },
                { label: 'Habilidades', done: false },
                { label: 'CV subido', done: false },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="wd-app-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div>
                    <p className="wd-app-title">{item.label}</p>
                  </div>
                  <span className={`wd-status ${item.done ? 'wd-status-accepted' : 'wd-status-pending'}`}>
                    {item.done ? 'Completado' : 'Pendiente'}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="wd-banner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <p className="wd-banner-label">Consejo Semanal</p>
              <h4>Completa tu perfil para acceder a proyectos Premium.</h4>
              <motion.button
                onClick={() => navigate('/worker/onboarding')}
                style={{
                  marginTop: 12, background: '#bdebbd', color: '#436c47',
                  border: 'none', padding: '8px 16px', borderRadius: 9999,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Completar Perfil →
              </motion.button>
            </motion.div>
          </section>

        </div>

        {/* FOOTER */}
        <motion.footer
          className="wd-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>© 2024 Edifex Construction Services. All rights reserved.</p>
          <div className="wd-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
          </div>
        </motion.footer>

      </main>
    </div>
  )
}

export default WorkerDashboard