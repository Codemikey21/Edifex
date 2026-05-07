import { Link, useNavigate } from 'react-router-dom'
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

const jobs = [
  {
    tags: [{ label: 'Carpintería', type: 'skill' }, { label: 'Urgente', type: 'urgent' }],
    title: 'Renovación Living - Mobiliario',
    client: 'Estudio Arquitectura V&M • Palermo, CABA',
    price: '$1,200 - $1,500',
    time: 'Publicado hace 2h',
  },
  {
    tags: [{ label: 'Pintura', type: 'skill' }, { label: 'Altura', type: 'skill' }],
    title: 'Fachada Edificio Boutique',
    client: 'Constructora del Sur • San Isidro, GBA',
    price: '$3,500 - $4,200',
    time: 'Publicado hace 5h',
  },
  {
    tags: [{ label: 'Construcción Seco', type: 'skill' }],
    title: 'Oficinas Corporativas - Steel Frame',
    client: 'Proyectos Urbanos S.A. • Nuñez, CABA',
    price: '$2,800 - $3,000',
    time: 'Publicado ayer',
  },
]

const applications = [
  { title: 'Instalación Eléctrica Trifásica', date: '12 Oct, 2024', status: 'pending' },
  { title: 'Restauración de Deck', date: '10 Oct, 2024', status: 'review' },
  { title: 'Mantenimiento de Galpón', date: '05 Oct, 2024', status: 'accepted' },
]

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'Pendiente',   cls: 'wd-status-pending' },
  review:   { label: 'En Revisión', cls: 'wd-status-review' },
  accepted: { label: 'Aceptado',    cls: 'wd-status-accepted' },
}

function WorkerDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const name = user.name?.split(' ')[0] || 'Operario'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="wd-layout">

      {/* SIDEBAR */}
      <aside className="wd-sidebar">
        <div className="wd-sidebar-logo">
          <h1>EDIFEX</h1>
        </div>

        <nav className="wd-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`wd-nav-item ${item.active ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="wd-sidebar-footer">
          <div className="wd-user-info">
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#3f6743', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0
            }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="name">{user.name || 'Operario'}</div>
              <span className="wd-user-badge">Operario</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="wd-nav-item"
            style={{ marginTop: 12 }}
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="wd-main">

        {/* HEADER */}
        <header className="wd-header">
          <div className="wd-header-left">
            <h2>Buenos días, {name}.</h2>
            <div className="wd-header-meta">
              <span className="wd-badge-pending">Pendiente Aprobación</span>
              <p>Tu perfil está bajo revisión editorial.</p>
            </div>
          </div>
          <div className="wd-header-right">
            <button className="wd-btn-icon">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="wd-btn-primary">Buscar Trabajos</button>
          </div>
        </header>

        {/* STATS */}
        <div className="wd-stats">
          <div className="wd-stat-card">
            <p className="stat-label">Postulaciones Enviadas</p>
            <p className="stat-value">12</p>
          </div>
          <div className="wd-stat-card">
            <p className="stat-label">Trabajos Completados</p>
            <p className="stat-value">48</p>
          </div>
          <div className="wd-stat-card">
            <p className="stat-label">Calificación Promedio</p>
            <p className="stat-value">4.9<span>/5</span></p>
            <div className="wd-stars">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
            </div>
          </div>
          <div className="wd-stat-card">
            <p className="stat-label">Perfil Completado</p>
            <p className="stat-value">85%</p>
            <div className="wd-progress-bar">
              <div className="wd-progress-fill" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="wd-grid">

          {/* LEFT: Jobs */}
          <section>
            <div className="wd-section-header">
              <h3>Trabajos Disponibles</h3>
              <a href="#">Ver Todo</a>
            </div>
            <div className="wd-jobs">
              {jobs.map((job, i) => (
                <article key={i} className="wd-job-card">
                  <div style={{ flex: 1 }}>
                    <div className="wd-job-tags">
                      {job.tags.map((tag, j) => (
                        <span key={j} className={`wd-tag ${tag.type === 'skill' ? 'wd-tag-skill' : 'wd-tag-urgent'}`}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    <h4 className="wd-job-title">{job.title}</h4>
                    <p className="wd-job-client">{job.client}</p>
                    <div className="wd-job-meta">
                      <span className="wd-job-price">{job.price}</span>
                      <span className="wd-job-time">
                        <span className="material-symbols-outlined">schedule</span>
                        {job.time}
                      </span>
                    </div>
                  </div>
                  <button className="wd-btn-outline">Ver Detalles</button>
                </article>
              ))}
            </div>
          </section>

          {/* RIGHT: Applications */}
          <section>
            <div className="wd-section-header">
              <h3>Postulaciones Recientes</h3>
            </div>

            <div className="wd-applications">
              {applications.map((app, i) => (
                <div key={i} className="wd-app-item">
                  <div>
                    <p className="wd-app-title">{app.title}</p>
                    <p className="wd-app-date">Aplicado: {app.date}</p>
                  </div>
                  <span className={`wd-status ${statusConfig[app.status].cls}`}>
                    {statusConfig[app.status].label}
                  </span>
                </div>
              ))}
            </div>

            <div className="wd-banner">
              <p className="wd-banner-label">Artículo Semanal</p>
              <h4>Cómo destacar tu perfil ante empresas constructoras premium.</h4>
              <a href="#">
                Leer más
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <footer className="wd-footer">
          <p>© 2024 Edifex Construction Services. All rights reserved.</p>
          <div className="wd-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Support</a>
          </div>
        </footer>

      </main>
    </div>
  )
}

export default WorkerDashboard