import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
      if (role === 'worker') navigate('/worker/onboarding')
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
      <motion.section
        className="register-left"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="register-left-bg">
          <img src="/images/hero.jpg" alt="Construction" />
          <div className="register-left-gradient" />
        </div>
        <div className="register-left-content">
          <motion.div
            className="register-left-logo"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <img src="/src/assets/logo.svg" alt="Edifex" />
            <span>EDIFEX</span>
          </motion.div>

          <div className="register-left-main">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Construyendo el futuro, hoy.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Únase a la red de servicios de construcción más prestigiosa del país.
            </motion.p>

            <motion.div
              className="register-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {[
                { num: '15k+', label: 'Proyectos Finalizados' },
                { num: '4.9/5', label: 'Calificación Clientes' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="register-stat-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
                >
                  <div className="num">{stat.num}</div>
                  <div className="label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="register-left-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            © 2024 Edifex Construction Services. All rights reserved.
          </motion.div>
        </div>
      </motion.section>

      {/* RIGHT */}
      <motion.section
        className="register-right"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="register-form-wrap">

          <motion.div
            className="register-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2>Crear cuenta</h2>
            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
          </motion.div>

          {error && (
            <motion.div
              className="register-error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Role selector */}
            <span className="register-role-label">Tipo de cuenta</span>
            <div className="register-role-grid">
              {[
                { role: 'client', icon: 'person', label: 'Soy cliente' },
                { role: 'worker', icon: 'construction', label: 'Soy operario' },
              ].map((item, i) => (
                <motion.button
                  key={item.role}
                  type="button"
                  className={`register-role-btn ${form.role === item.role ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, role: item.role })}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <span className="material-symbols-outlined icon">{item.icon}</span>
                  <span className="role-name">{item.label}</span>
                  {form.role === item.role && (
                    <span className="material-symbols-outlined register-role-check">check_circle</span>
                  )}
                </motion.button>
              ))}
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
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className={`strength-bar ${i <= strength ? 'active' : ''}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ transformOrigin: 'left' }}
                      />
                    ))}
                  </div>
                  <p className="strength-text">{strengthLabels[strength]}</p>
                </motion.div>
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

            <motion.button
              type="submit"
              className="btn-register-submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </motion.button>

            <div className="register-divider">
              <div className="register-divider-line" />
              <span>O regístrate con</span>
              <div className="register-divider-line" />
            </div>

            <div className="register-social-grid">
              {[
                {
                  label: 'Google',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )
                },
                {
                  label: 'Apple',
                  icon: <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>phone_iphone</span>
                }
              ].map((btn) => (
                <motion.button
                  key={btn.label}
                  type="button"
                  className="btn-social"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {btn.icon}
                  <span>{btn.label}</span>
                </motion.button>
              ))}
            </div>

          </motion.form>
        </div>
      </motion.section>

    </div>
  )
}

export default RegisterPage