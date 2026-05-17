import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../services/api'
import '../../styles/client-dashboard.css'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'search', label: 'Buscar Operarios' },
  { icon: 'construction', label: 'Mis Proyectos' },
  { icon: 'request_quote', label: 'Mis Contrataciones' },
  { icon: 'mail', label: 'Mensajes' },
  { icon: 'settings', label: 'Configuración' },
]

function ClientDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const name = user.name?.split(' ')[0] || 'Cliente'

  const [jobs, setJobs] = useState<any[]>([])
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, workersRes] = await Promise.all([
          api.get('/jobs/my-jobs').catch(() => ({ data: { data: [] } })),
          api.get('/workers').catch(() => ({ data: { data: [] } })),
        ])
        setJobs(jobsRes.data?.data?.slice(0, 3) || [])
        setWorkers(workersRes.data?.data?.slice(0, 2) || [])
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const stats = [
    { label: 'Proyectos Activos', value: jobs.filter(j => j.status === 'published').length || 0, sub: '+1 hoy' },
    { label: 'Operarios Contratados', value: 0 },
    { label: 'Presupuesto Gastado', value: '$0' },
    { label: 'Trabajos Completados', value: jobs.filter(j => j.status === 'completed').length || 0 },
  ]

  return (
    <div className="cd-layout">

      {/* SIDEBAR */}
      <motion.aside
        className="cd-sidebar"
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="cd-sidebar-logo">
          <span>EDIFEX</span>
        </div>

        <nav className="cd-sidebar-nav">
          {navItems.map((item, i) => (
            <motion.button
              key={item.label}
              className={`cd-nav-item ${item.active ? 'active' : ''}`}
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

        <div className="cd-sidebar-footer">
          <div className="cd-user-info">
            <motion.div
              className="cd-user-avatar"
              whileHover={{ scale: 1.1 }}
            >
              {name.charAt(0).toUpperCase()}
            </motion.div>
            <div>
              <div className="name">{user.name || 'Cliente'}</div>
              <span className="cd-user-badge">Cliente</span>
            </div>
          </div>
          <motion.button
            onClick={handleLogout}
            className="cd-nav-item"
            style={{ marginTop: 12 }}
            whileHover={{ x: 4 }}
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </motion.button>
        </div>
      </motion.aside>

      {/* MAIN */}
      <main className="cd-main">

        {/* HEADER */}
        <motion.header
          className="cd-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="cd-header-left">
            <h1>Bienvenido, {name}.</h1>
            <p>Gestiona tus proyectos y descubre nuevos talentos para tu obra.</p>
          </div>
          <div className="cd-header-right">
            <motion.button
              className="cd-btn-icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined">notifications</span>
            </motion.button>
            <motion.button
              className="cd-btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Publicar Trabajo
            </motion.button>
          </div>
        </motion.header>

        {/* STATS */}
        <motion.div
          className="cd-stats"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="cd-stat-card"
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(26,47,26,0.12)' }}
            >
              <span className="cd-stat-label">{stat.label}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span className="cd-stat-value">
                  {loading ? '...' : stat.value}
                </span>
                {stat.sub && (
                  <span className="cd-stat-sub">{stat.sub}</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* MAIN GRID */}
        <div className="cd-grid">

          {/* LEFT: Projects */}
          <section>
            <motion.div
              className="cd-section-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2>Mis Proyectos Activos</h2>
              <button>Ver todos</button>
            </motion.div>

            <div className="cd-projects">
              {loading ? (
                [1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    style={{ height: 120, background: '#efeeea', borderRadius: 16 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  />
                ))
              ) : jobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ padding: '48px 24px', textAlign: 'center', color: '#737971', background: 'white', borderRadius: 16 }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 52, display: 'block', marginBottom: 12, color: '#c3c8bf' }}>
                    construction
                  </span>
                  <h3 style={{ color: '#061a07', marginBottom: 8 }}>No tienes proyectos aún</h3>
                  <p style={{ marginBottom: 20 }}>Publica tu primer trabajo y conecta con operarios verificados</p>
                  <motion.button
                    className="cd-btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Publicar Proyecto
                  </motion.button>
                </motion.div>
              ) : (
                jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    className="cd-project-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(26,47,26,0.1)' }}
                  >
                    <div className="cd-project-top">
                      <div>
                        <p className="cd-project-title">{job.title}</p>
                        <div className="cd-project-date">
                          <span className="material-symbols-outlined">calendar_today</span>
                          {new Date(job.created_at).toLocaleDateString('es-CO')}
                        </div>
                      </div>
                      <span className={`cd-badge ${job.status === 'published' ? 'cd-badge-active' : 'cd-badge-pending'}`}>
                        {job.status === 'published' ? 'Activo' : job.status}
                      </span>
                    </div>

                    <div className="cd-project-worker">
                      <div className="cd-worker-avatar">?</div>
                      <div>
                        <p className="cd-worker-label">Operario Asignado</p>
                        <p className="cd-worker-name">Sin asignar</p>
                      </div>
                      <div className="cd-project-budget">
                        <p className="cd-budget-label">Presupuesto</p>
                        <p className="cd-budget-value">
                          ${Number(job.budget_min || 0).toLocaleString()} - ${Number(job.budget_max || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="cd-progress-wrap">
                      <div className="cd-progress-top">
                        <span>Progreso</span>
                        <span>0%</span>
                      </div>
                      <div className="cd-progress-bar">
                        <motion.div
                          className="cd-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: '0%' }}
                          transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* RIGHT: Workers */}
          <section>
            <motion.div
              className="cd-section-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2>Operarios Recomendados</h2>
            </motion.div>

            <div className="cd-workers">
              {loading ? (
                [1, 2].map(i => (
                  <motion.div
                    key={i}
                    style={{ height: 180, background: '#efeeea', borderRadius: 16 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                  />
                ))
              ) : workers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ padding: 24, textAlign: 'center', color: '#737971', background: 'white', borderRadius: 16 }}
                >
                  No hay operarios disponibles aún.
                </motion.div>
              ) : (
                workers.map((worker, i) => (
                  <motion.div
                    key={worker.id}
                    className="cd-worker-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(26,47,26,0.1)' }}
                  >
                    <div className="cd-worker-photo">
                      <div className="cd-worker-photo-inner">
                        {worker.user?.name?.charAt(0).toUpperCase() || 'O'}
                      </div>
                      {worker.status === 'active' && (
                        <div className="cd-verified-badge">
                          <span className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                        </div>
                      )}
                    </div>
                    <h4>{worker.user?.name || 'Operario'}</h4>
                    <span className="cd-worker-specialty">
                      {worker.bio?.substring(0, 30) || 'Especialista en Construcción'}
                    </span>
                    <div className="cd-worker-rating">
                      <span className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {worker.rating || '—'} reseñas
                    </div>
                    <motion.button
                      className="cd-btn-hire cd-btn-hire-filled"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contratar
                    </motion.button>
                  </motion.div>
                ))
              )}

              {/* Help Banner */}
              <motion.div
                className="cd-help-banner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                <h4>¿Necesitas ayuda?</h4>
                <p>Nuestros asesores premium pueden ayudarte a elegir al mejor profesional para tu obra.</p>
                <motion.button
                  className="cd-btn-chat"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Chat Asistido
                </motion.button>
                <span className="material-symbols-outlined cd-help-icon">support_agent</span>
              </motion.div>
            </div>
          </section>

        </div>

        {/* PROMO */}
        <motion.div
          className="cd-promo"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="cd-promo-text">
            <h2>Certificación Edifex de Oro</h2>
            <p>Obtén la garantía extendida de Edifex para todos tus proyectos de renovación.</p>
            <div className="cd-promo-actions">
              <motion.button
                className="cd-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Saber Más
              </motion.button>
              <motion.button
                className="cd-btn-outline-dark"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Requisitos
              </motion.button>
            </div>
          </div>
          <div className="cd-promo-img">
            <span className="material-symbols-outlined">workspace_premium</span>
          </div>
        </motion.div>

        {/* FOOTER */}
        <footer className="cd-footer">
          <div className="cd-footer-grid">
            <div className="cd-footer-brand">
              <h3>EDIFEX</h3>
              <p>Construyendo el futuro de la arquitectura con transparencia y profesionalidad.</p>
            </div>
            <div className="cd-footer-col">
              <h5>Plataforma</h5>
              <a href="#">Marketplace</a>
              <a href="#">Servicios</a>
              <a href="#">Proyectos</a>
            </div>
            <div className="cd-footer-col">
              <h5>Legal</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
            <div className="cd-footer-col">
              <h5>Soporte</h5>
              <a href="#">Contact Us</a>
              <a href="#">Help Center</a>
            </div>
          </div>
          <div className="cd-footer-bottom">
            © 2024 Edifex Construction Services. All rights reserved.
          </div>
        </footer>

      </main>
    </div>
  )
}

export default ClientDashboard