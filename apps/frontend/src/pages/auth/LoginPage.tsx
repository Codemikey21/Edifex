import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import '../../styles/login.css'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      const role = res.data.user.role
      if (role === 'admin') navigate('/admin')
      else if (role === 'worker') navigate('/worker/dashboard')
      else navigate('/client/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      {/* LEFT */}
      <section className="login-left">
        <div className="login-left-bg">
          <div className="login-left-overlay" />
          <img src="/images/hero.jpg" alt="Construction site" />
        </div>
        <div className="login-left-content">
          <div className="login-left-logo">
            <img src="/src/assets/logo.svg" alt="Edifex Logo" />
          </div>
          <h1>Construyendo el futuro con precisión.</h1>
          <p>La plataforma definitiva para la gestión de proyectos arquitectónicos de alto nivel y servicios de construcción premium.</p>
        </div>
      </section>

      {/* RIGHT */}
      <section className="login-right">
        <div className="login-form-wrap">

          <header className="login-header">
            <h2>Bienvenido de nuevo</h2>
            <p>Acceda a su panel de control de Edifex para gestionar sus proyectos.</p>
          </header>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <div className="login-field-password">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="login-actions">
              <label className="login-remember">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="login-forgot">¿Olvidó su contraseña?</a>
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span>O continuar con</span>
              <div className="login-divider-line" />
            </div>

            <button type="button" className="btn-google">
              <svg viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </form>

          <footer className="login-footer">
            <p>
              ¿No tiene una cuenta?{' '}
              <Link to="/register">Regístrese aquí</Link>
            </p>
          </footer>

        </div>
      </section>

    </div>
  )
}

export default LoginPage