import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { workerService } from '../services/workerService'
import '../styles/landing.css'

function LandingPage() {
  const navigate = useNavigate()

  const { data: workersData } = useQuery({
    queryKey: ['workers'],
    queryFn: () => workerService.getWorkers(),
  })

  const workers = workersData?.data || []

  return (
    <div>

      {/* NAVBAR */}
      <nav className="edifex-nav">
        <div className="edifex-nav-inner">
          <div className="edifex-logo">
            <img src="/src/assets/logo.svg" alt="Edifex Logo" />
            <span>EDIFEX</span>
          </div>
          <div className="edifex-nav-links">
            <a href="#marketplace" className="active">Marketplace</a>
            <a href="#services">Services</a>
            <a href="#how">Projects</a>
            <a href="#about">About</a>
          </div>
          <div className="edifex-nav-buttons">
            <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-register" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="edifex-hero">
        <div className="edifex-hero-bg">
          <div className="edifex-hero-overlay" />
          <img src="/images/hero.jpg" alt="Construction project" />
        </div>
        <div className="edifex-hero-content">
          <h1>Encuentra al operario perfecto para tu obra</h1>
          <p>Precisión, confianza y excelencia en cada detalle. Conectamos proyectos exclusivos con los mejores especialistas del sector.</p>
          <div className="edifex-hero-buttons">
            <button className="btn-hero-primary" onClick={() => navigate('/register')}>Publicar Proyecto</button>
            <button className="btn-hero-secondary" onClick={() => navigate('/register')}>Explorar Expertos</button>
          </div>
        </div>
        <div className="edifex-stats">
          <div className="edifex-stats-inner">
            <div className="edifex-stat">
              <h3>+2.5k</h3>
              <p>OPERARIOS VERIFICADOS</p>
            </div>
            <div className="edifex-stat-divider" />
            <div className="edifex-stat">
              <h3>150+</h3>
              <p>PROYECTOS ACTIVOS</p>
            </div>
            <div className="edifex-stat-divider" />
            <div className="edifex-stat">
              <h3>4.9/5</h3>
              <p>RATING MEDIO</p>
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <section className="edifex-search">
        <div className="edifex-search-inner">
          <div className="edifex-search-field">
            <label>ESPECIALIDAD</label>
            <div className="edifex-search-input">
              <span className="material-symbols-outlined">construction</span>
              <input type="text" placeholder="¿Qué necesitas?" />
            </div>
          </div>
          <div className="edifex-search-field">
            <label>UBICACIÓN</label>
            <div className="edifex-search-input">
              <span className="material-symbols-outlined">location_on</span>
              <input type="text" placeholder="¿Dónde?" />
            </div>
          </div>
          <div className="edifex-search-field">
            <label>DISPONIBILIDAD</label>
            <div className="edifex-search-input">
              <span className="material-symbols-outlined">calendar_today</span>
              <input type="text" placeholder="¿Cuándo?" />
            </div>
          </div>
          <button className="btn-search">
            <span className="material-symbols-outlined">search</span>
            BUSCAR
          </button>
        </div>
      </section>

      {/* WORKERS */}
      <section id="marketplace" className="edifex-workers">
        <div className="edifex-workers-header">
          <h2>Expertos Destacados</h2>
          <div className="edifex-filters">
            {['TODOS', 'ALBAÑILERÍA', 'ELECTRICIDAD', 'FONTANERÍA', 'CARPINTERÍA'].map((cat, i) => (
              <span key={cat} className={`filter-chip ${i === 0 ? 'active' : ''}`}>
                {cat}
              </span>
            ))}
          </div>
        </div>

        {workers.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👷</div>
            <h3>No hay operarios disponibles aún</h3>
            <p>Sé el primero en registrarte como operario</p>
            <button className="btn-hire" onClick={() => navigate('/register')}>
              Registrarme como operario
            </button>
          </div>
        ) : (
          <div className="edifex-workers-grid">
            {workers.map((worker: any) => (
              <div key={worker.id} className="worker-card">
                <div className="worker-card-img">
                  <img
                    src={worker.user?.avatar || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80'}
                    alt={worker.user?.name}
                  />
                  <span className={`worker-badge ${parseFloat(worker.rating) >= 4.8 ? 'premium' : 'verified'}`}>
                    {parseFloat(worker.rating) >= 4.8 ? 'PREMIUM' : 'VERIFICADO'}
                  </span>
                </div>
                <div className="worker-card-info">
                  <div>
                    <h3>{worker.user?.name}</h3>
                    <p className="role">{worker.categories?.[0] || 'Construcción'}</p>
                  </div>
                  <div className="worker-rating">
                    <span>★</span>
                    {parseFloat(worker.rating || 0).toFixed(1)}
                  </div>
                </div>
                <p className="worker-bio">
                  {worker.bio || 'Profesional verificado con experiencia en construcción.'}
                </p>
                <div className="worker-card-footer">
                  <div className="worker-price">
                    ${(worker.hourly_rate || 0).toLocaleString()}
                    <span>/h</span>
                  </div>
                  <button className="btn-hire" onClick={() => navigate('/register')}>
                    Contratar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="edifex-how">
        <div className="edifex-how-inner">
          <div className="edifex-how-header">
            <h2>Cómo funciona Edifex</h2>
            <p>Un proceso simplificado diseñado para garantizar la calidad y la seguridad en cada contratación.</p>
          </div>
          <div className="edifex-how-grid">
            {[
              { num: '1', title: 'Publica', desc: 'Describe tu necesidad, presupuesto y plazos en pocos clics.' },
              { num: '2', title: 'Compara', desc: 'Recibe propuestas de operarios verificados y revisa su portfolio.' },
              { num: '3', title: 'Contrata', desc: 'Formaliza el acuerdo mediante nuestra plataforma segura.' },
              { num: '4', title: 'Certifica', desc: 'Libera el pago una vez finalizada y aprobada la obra.' },
            ].map((step) => (
              <div key={step.num} className="how-step">
                <div className="how-step-num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="edifex-footer">
        <div className="edifex-footer-grid">
          <div className="footer-brand">
            <div className="flex items-center gap-2 mb-3">
              <img src="/src/assets/logo.svg" alt="Edifex" />
              <span className="footer-brand-name">EDIFEX</span>
            </div>
            <p>Liderando la transformación digital en la contratación de servicios de construcción de alto standing.</p>
          </div>
          {[
            { title: 'RECURSOS', items: ['Directorio de Expertos', 'Guía de Precios', 'Casos de Éxito', 'Blog Editorial'] },
            { title: 'COMPAÑÍA', items: ['Sobre Nosotros', 'Contact Us', 'Sostenibilidad', 'Carreras'] },
            { title: 'LEGAL', items: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map((col) => (
            <div key={col.title} className="footer-col">
              <h5>{col.title}</h5>
              <ul>
                {col.items.map(item => (
                  <li key={item}><a href="#">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="edifex-footer-bottom">
          <p>© 2024 Edifex Construction Services. All rights reserved.</p>
          <div className="footer-icons">
            <span className="material-symbols-outlined">language</span>
            <span className="material-symbols-outlined">public</span>
            <span className="material-symbols-outlined">share</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage