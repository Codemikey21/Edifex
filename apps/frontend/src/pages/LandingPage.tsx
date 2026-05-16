import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { workerService } from '../services/workerService'
import { motion, useInView, useAnimation } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import '../styles/landing.css'

// ===== ANIMATED COUNTER =====
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// ===== FADE IN SECTION =====
function FadeIn({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'none' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const controls = useAnimation()

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : 0,
      x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  }

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function LandingPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('TODOS')
  const [scrolled, setScrolled] = useState(false)

  const { data: workersData } = useQuery({
    queryKey: ['workers'],
    queryFn: () => workerService.getWorkers(),
  })

  const workers = workersData?.data || []

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filters = ['TODOS', 'ALBAÑILERÍA', 'ELECTRICIDAD', 'FONTANERÍA', 'CARPINTERÍA']

  const steps = [
    { num: '01', icon: 'edit_note', title: 'Publica', desc: 'Describe tu necesidad, presupuesto y plazos en pocos clics.' },
    { num: '02', icon: 'compare_arrows', title: 'Compara', desc: 'Recibe propuestas de operarios verificados y revisa su portfolio.' },
    { num: '03', icon: 'handshake', title: 'Contrata', desc: 'Formaliza el acuerdo mediante nuestra plataforma segura.' },
    { num: '04', icon: 'verified', title: 'Certifica', desc: 'Libera el pago una vez finalizada y aprobada la obra.' },
  ]

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <motion.nav
        className={`edifex-nav ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="edifex-nav-inner">
          <div className="edifex-logo">
            <img src="/src/assets/logo.svg" alt="Edifex Logo" />
            <span>EDIFEX</span>
          </div>
          <div className="edifex-nav-links">
            <a href="#marketplace">Marketplace</a>
            <a href="#how">Cómo funciona</a>
            <a href="#stats">Nosotros</a>
          </div>
          <div className="edifex-nav-buttons">
            <button className="btn-login" onClick={() => navigate('/login')}>Ingresar</button>
            <button className="btn-register" onClick={() => navigate('/register')}>Registrarse</button>
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <header className="edifex-hero">
        <div className="edifex-hero-bg">
          <div className="edifex-hero-overlay" />
          <motion.img
            src="/images/hero.jpg"
            alt="Construction project"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          />
        </div>
        <div className="edifex-hero-content">
          <motion.div
            className="hero-tag"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="material-symbols-outlined">verified</span>
            PLATAFORMA PREMIUM DE CONSTRUCCIÓN
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Encuentra al operario perfecto para tu obra
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            Precisión, confianza y excelencia en cada detalle. Conectamos proyectos exclusivos con los mejores especialistas del sector.
          </motion.p>

          <motion.div
            className="edifex-hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <motion.button
              className="btn-hero-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
            >
              Publicar Proyecto
            </motion.button>
            <motion.button
              className="btn-hero-secondary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/register')}
            >
              Explorar Expertos
            </motion.button>
          </motion.div>
        </div>

        {/* STATS BAR */}
        <motion.div
          className="edifex-stats"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          <div className="edifex-stats-inner">
            <div className="edifex-stat">
              <h3>+<AnimatedCounter end={2500} suffix="" /></h3>
              <p>OPERARIOS VERIFICADOS</p>
            </div>
            <div className="edifex-stat-divider" />
            <div className="edifex-stat">
              <h3><AnimatedCounter end={150} suffix="+" /></h3>
              <p>PROYECTOS ACTIVOS</p>
            </div>
            <div className="edifex-stat-divider" />
            <div className="edifex-stat">
              <h3><AnimatedCounter end={49} suffix="/5" />.0</h3>
              <p>RATING MEDIO</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* SEARCH */}
      <FadeIn>
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
            <motion.button
              className="btn-search"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="material-symbols-outlined">search</span>
              BUSCAR
            </motion.button>
          </div>
        </section>
      </FadeIn>

      {/* STATS SECTION */}
      <section id="stats" className="edifex-counters">
        <div className="edifex-counters-inner">
          <FadeIn direction="left">
            <div className="counter-item">
              <h2>+<AnimatedCounter end={45} duration={2} /></h2>
              <p>Años de experiencia en el sector</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="counter-item">
              <h2><AnimatedCounter end={2500} duration={2} />+</h2>
              <p>Operarios certificados y verificados</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="counter-item">
              <h2><AnimatedCounter end={15000} duration={2.5} />+</h2>
              <p>Proyectos completados exitosamente</p>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.3}>
            <div className="counter-item">
              <h2><AnimatedCounter end={13} duration={1.5} /></h2>
              <p>Ciudades con presencia activa</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WORKERS */}
      <section id="marketplace" className="edifex-workers">
        <FadeIn>
          <div className="edifex-workers-header">
            <h2>Expertos Destacados</h2>
            <p>Profesionales verificados listos para tu proyecto</p>
            <div className="edifex-filters">
              {filters.map((cat) => (
                <motion.span
                  key={cat}
                  className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.span>
              ))}
            </div>
          </div>
        </FadeIn>

        {workers.length === 0 ? (
          <FadeIn delay={0.2}>
            <div className="empty-state">
              <motion.div
                className="empty-icon"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                👷
              </motion.div>
              <h3>No hay operarios disponibles aún</h3>
              <p>Sé el primero en registrarte como operario</p>
              <motion.button
                className="btn-hire"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
              >
                Registrarme como operario
              </motion.button>
            </div>
          </FadeIn>
        ) : (
          <div className="edifex-workers-grid">
            {workers.map((worker: any, i: number) => (
              <FadeIn key={worker.id} delay={i * 0.1}>
                <motion.div
                  className="worker-card"
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(6,26,7,0.15)' }}
                  transition={{ duration: 0.3 }}
                >
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
                      ${(worker.hourly_rate || 0).toLocaleString()}<span>/h</span>
                    </div>
                    <motion.button
                      className="btn-hire"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/register')}
                    >
                      Contratar
                    </motion.button>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="edifex-how">
        <div className="edifex-how-inner">
          <FadeIn>
            <div className="edifex-how-header">
              <h2>Cómo funciona Edifex</h2>
              <p>Un proceso simplificado diseñado para garantizar la calidad y la seguridad en cada contratación.</p>
            </div>
          </FadeIn>
          <div className="edifex-how-grid">
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.15}>
                <motion.div
                  className="how-step"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="how-step-num">{step.num}</div>
                  <div className="how-step-icon">
                    <span className="material-symbols-outlined">{step.icon}</span>
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <FadeIn>
        <section className="edifex-cta">
          <div className="edifex-cta-inner">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2>¿Listo para transformar tu proyecto?</h2>
              <p>Únete a miles de clientes que ya confían en Edifex para conectar con los mejores profesionales de la construcción.</p>
              <div className="cta-buttons">
                <motion.button
                  className="btn-cta-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                >
                  Comenzar Ahora
                </motion.button>
                <motion.button
                  className="btn-cta-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                >
                  Ver Marketplace
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              className="cta-stats"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="cta-stat">
                <span className="material-symbols-outlined">verified_user</span>
                <div>
                  <h4>100% Verificado</h4>
                  <p>Todos los operarios pasan por validación</p>
                </div>
              </div>
              <div className="cta-stat">
                <span className="material-symbols-outlined">payments</span>
                <div>
                  <h4>Pago Seguro</h4>
                  <p>Libera fondos solo cuando estés satisfecho</p>
                </div>
              </div>
              <div className="cta-stat">
                <span className="material-symbols-outlined">support_agent</span>
                <div>
                  <h4>Soporte 24/7</h4>
                  <p>Acompañamiento en cada etapa del proyecto</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </FadeIn>

      {/* FOOTER */}
      <footer className="edifex-footer">
        <div className="edifex-footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <img src="/src/assets/logo.svg" alt="Edifex" />
              <span className="footer-brand-name">EDIFEX</span>
            </div>
            <p>Liderando la transformación digital en la contratación de servicios de construcción de alto standing.</p>
          </div>
          {[
            { title: 'RECURSOS', items: ['Directorio de Expertos', 'Guía de Precios', 'Casos de Éxito', 'Blog Editorial'] },
            { title: 'COMPAÑÍA', items: ['Sobre Nosotros', 'Contáctanos', 'Sostenibilidad', 'Carreras'] },
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
            <motion.span className="material-symbols-outlined" whileHover={{ scale: 1.2 }}>language</motion.span>
            <motion.span className="material-symbols-outlined" whileHover={{ scale: 1.2 }}>public</motion.span>
            <motion.span className="material-symbols-outlined" whileHover={{ scale: 1.2 }}>share</motion.span>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage