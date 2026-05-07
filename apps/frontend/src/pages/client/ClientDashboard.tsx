import { useNavigate } from 'react-router-dom'
import '../../styles/client-dashboard.css'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'search', label: 'Buscar Operarios' },
  { icon: 'construction', label: 'Mis Proyectos' },
  { icon: 'request_quote', label: 'Mis Contrataciones' },
  { icon: 'mail', label: 'Mensajes' },
  { icon: 'settings', label: 'Configuración' },
]

const projects = [
  {
    title: 'Renovación Loft Moderno',
    date: '15 Oct, 2024',
    status: 'active',
    worker: 'Juan Rivera',
    budget: '$12,500',
    progress: 65,
  },
  {
    title: 'Instalación Eléctrica Cocina',
    date: '22 Sep, 2024',
    status: 'active',
    worker: 'Marco Salas',
    budget: '$1,800',
    progress: 20,
  },
  {
    title: 'Pintura Exterior Fachada',
    date: '05 Oct, 2024',
    status: 'pending',
    worker: 'Ana Lopez',
    budget: '$3,200',
    progress: 0,
    muted: true,
  },
]

const workers = [
  { name: 'Roberto Gomez', specialty: 'Maestro Carpintero', rating: '4.9', reviews: 124, verified: true, variant: 'filled' },
  { name: 'Elena Ruiz', specialty: 'Arquitecta de Interiores', rating: '5.0', reviews: 86, verified: false, variant: 'outline' },
]

function ClientDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const name = user.name?.split(' ')[0] || 'Cliente'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="cd-layout">

      {/* SIDEBAR */}
      <aside className="cd-sidebar">
        <div className="cd-sidebar-logo">
          <span>EDIFEX</span>
        </div>

        <nav className="cd-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`cd-nav-item ${item.active ? 'active' : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="cd-sidebar-footer">
          <div className="cd-user-info">
            <div className="cd-user-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="name">{user.name || 'Cliente'}</div>
              <span className="cd-user-badge">Cliente</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="cd-nav-item"
            style={{ marginTop: 12 }}
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="cd-main">

        {/* HEADER */}
        <header className="cd-header">
          <div className="cd-header-left">
            <h1>Bienvenido, {name}.</h1>
            <p>Gestiona tus proyectos y descubre nuevos talentos para tu obra.</p>
          </div>
          <div className="cd-header-right">
            <button className="cd-btn-icon">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="cd-btn-primary">Publicar Trabajo</button>
          </div>
        </header>

        {/* STATS */}
        <div className="cd-stats">
          <div className="cd-stat-card">
            <span className="cd-stat-label">Proyectos Activos</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="cd-stat-value">03</span>
              <span className="cd-stat-sub">+1 hoy</span>
            </div>
          </div>
          <div className="cd-stat-card">
            <span className="cd-stat-label">Operarios Contratados</span>
            <span className="cd-stat-value">12</span>
          </div>
          <div className="cd-stat-card">
            <span className="cd-stat-label">Presupuesto Gastado</span>
            <span className="cd-stat-value">$4.250</span>
          </div>
          <div className="cd-stat-card">
            <span className="cd-stat-label">Trabajos Completados</span>
            <span className="cd-stat-value">28</span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="cd-grid">

          {/* LEFT: Projects */}
          <section>
            <div className="cd-section-header">
              <h2>Mis Proyectos Activos</h2>
              <button>Ver todos</button>
            </div>
            <div className="cd-projects">
              {projects.map((p, i) => (
                <div key={i} className={`cd-project-card ${p.muted ? 'muted' : ''}`}>
                  <div className="cd-project-top">
                    <div>
                      <p className="cd-project-title">{p.title}</p>
                      <div className="cd-project-date">
                        <span className="material-symbols-outlined">calendar_today</span>
                        Entrega: {p.date}
                      </div>
                    </div>
                    <span className={`cd-badge ${p.status === 'active' ? 'cd-badge-active' : 'cd-badge-pending'}`}>
                      {p.status === 'active' ? 'En Ejecución' : 'Pendiente Pago'}
                    </span>
                  </div>

                  <div className="cd-project-worker">
                    <div className="cd-worker-avatar">
                      {p.worker.charAt(0)}
                    </div>
                    <div>
                      <p className="cd-worker-label">Operario Asignado</p>
                      <p className="cd-worker-name">{p.worker}</p>
                    </div>
                    <div className="cd-project-budget">
                      <p className="cd-budget-label">Presupuesto</p>
                      <p className="cd-budget-value">{p.budget}</p>
                    </div>
                  </div>

                  <div className="cd-progress-wrap">
                    <div className="cd-progress-top">
                      <span>Progreso</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div className="cd-progress-bar">
                      <div className="cd-progress-fill" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT: Workers */}
          <section>
            <div className="cd-section-header">
              <h2>Operarios Recomendados</h2>
            </div>
            <div className="cd-workers">
              {workers.map((w, i) => (
                <div key={i} className="cd-worker-card">
                  <div className="cd-worker-photo">
                    <div className="cd-worker-photo-inner">
                      {w.name.charAt(0)}
                    </div>
                    {w.verified && (
                      <div className="cd-verified-badge">
                        <span className="material-symbols-outlined"
                          style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                      </div>
                    )}
                  </div>
                  <h4>{w.name}</h4>
                  <span className="cd-worker-specialty">{w.specialty}</span>
                  <div className="cd-worker-rating">
                    <span className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {w.rating} ({w.reviews} reseñas)
                  </div>
                  <button className={`cd-btn-hire ${w.variant === 'filled' ? 'cd-btn-hire-filled' : 'cd-btn-hire-outline'}`}>
                    Contratar
                  </button>
                </div>
              ))}

              {/* Help Banner */}
              <div className="cd-help-banner">
                <h4>¿Necesitas ayuda?</h4>
                <p>Nuestros asesores premium pueden ayudarte a elegir al mejor profesional para tu obra.</p>
                <button className="cd-btn-chat">Chat Asistido</button>
                <span className="material-symbols-outlined cd-help-icon">support_agent</span>
              </div>
            </div>
          </section>

        </div>

        {/* PROMO */}
        <div className="cd-promo">
          <div className="cd-promo-text">
            <h2>Certificación Edifex de Oro</h2>
            <p>Obtén la garantía extendida de Edifex para todos tus proyectos de renovación. El sello de oro asegura que cada etapa cumple con los más altos estándares arquitectónicos.</p>
            <div className="cd-promo-actions">
              <button className="cd-btn-primary">Saber Más</button>
              <button className="cd-btn-outline-dark">Requisitos</button>
            </div>
          </div>
          <div className="cd-promo-img">
            <span className="material-symbols-outlined">workspace_premium</span>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="cd-footer">
          <div className="cd-footer-grid">
            <div className="cd-footer-brand">
              <h3>EDIFEX</h3>
              <p>Construyendo el futuro de la arquitectura y los servicios de construcción con transparencia y profesionalidad.</p>
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
              <a href="#">Cookie Policy</a>
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