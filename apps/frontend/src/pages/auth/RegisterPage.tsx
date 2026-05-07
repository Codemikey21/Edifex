import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import '../../styles/register.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'client',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const getPasswordStrength = () => {
    const p = form.password
    if (p.length === 0) return 0
    if (p.length < 6) return 1
    if (p.length < 10) return 2
    if (p.length < 14) return 3
    return 4
  }

  const strengthLabels = ['', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte']
  const strength = getPasswordStrength()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      const role = res.data.user.role
      if (role === 'worker') navigate('/worker/dashboard')
      else navigate('/client/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">

      {/* LEFT */}
      <section className="register-left">
        <div className="register-left-bg">
          <img src="/images/hero.jpg" alt="Construction" />
          <div className="register-left-gradient" />
        </div>
        <div className="register-left-content">
          <div className="register-left-logo">
            <img src="/src/assets/logo.svg" alt="Edifex" />
            <span>EDIFEX</span>
          </div>
          <div className="register-left-main">
            <h1>Construyendo el futuro, hoy.</h1>
            <p>Únase a la red de servicios de construcción más prestigiosa del país. Calidad garantizada en cada metro cuadrado.</p>
            <div className="register-stats">
              <div className="register-stat-card">
                <div className="num">15k+</div>
                <div className="label">Proyectos Finalizados</div>
              </div>
              <div className="register-stat-card">
                <div className="num">4.9/5</div>
                <div className="label">Calificación Clientes</div>
              </div>
            </div>
          </div>
          <div className="register-left-footer">
            © 2024 Edifex Construction Services. All rights reserved.
          </div>
        </div>
      </section>

      {/* RIGHT */}
      <section className="register-right">
        <div className="register-form-wrap">

          <div className="register-header">
            <h2>Crear cuenta</h2>
            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
          </div>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* Role selector */}
            <span className="register-role-label">Tipo de cuenta</span>
            <div className="register-role-grid">
              <button
                type="button"
                className={`register-role-btn ${form.role === 'client' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'client' })}
              >
                <span className="material-symbols-outlined icon">person</span>
                <span className="role-name">Soy cliente</span>
                <span className="material-symbols-outlined register-role-check">check_circle</span>
              </button>
              <button
                type="button"
                className={`register-role-btn ${form.role === 'worker' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'worker' })}
              >
                <span className="material-symbols-outlined icon">construction</span>
                <span className="role-name">Soy operario</span>
                <span className="material-symbols-outlined register-role-check">check_circle</span>
              </button>
            </div>

            <div className="register-field">
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="register-field">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="juan@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="register-field">
              <label>Contraseña</label>
              <div className="register-field-password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="register-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {form.password.length > 0 && (
                <>
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`strength-bar ${i <= strength ? 'active' : ''}`} />
                    ))}
                  </div>
                  <p className="strength-text">{strengthLabels[strength]}</p>
                </>
              )}
            </div>

            <div className="register-field">
              <label>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                required
              />
            </div>

            <div className="register-terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Acepto los <a href="#">Términos de Servicio</a> y la <a href="#">Política de Privacidad</a>.
              </label>
            </div>

            <button
              type="submit"
              className="btn-register-submit"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <div className="register-divider">
              <div className="register-divider-line" />
              <span>O regístrate con</span>
              <div className="register-divider-line" />
            </div>

            <div className="register-social-grid">
              <button type="button" className="btn-social">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>
              <button type="button" className="btn-social">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>phone_iphone</span>
                <span>Apple</span>
              </button>
            </div>

          </form>
        </div>
      </section>

    </div>
  )
}

export default RegisterPage