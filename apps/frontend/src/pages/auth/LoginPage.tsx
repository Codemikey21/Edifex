import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen bg-[#F5F2ED] flex">
      {/* Lado izquierdo — imagen */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="Construcción"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1A2F1A]/70" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <Link to="/" className="flex items-center gap-3 mb-auto">
            <img src="/src/assets/logo.svg" alt="Edifex" className="w-16 h-16 object-contain" />
            <span className="text-white font-bold text-2xl tracking-widest">EDIFEX</span>
          </Link>
          <h2 className="text-white text-4xl font-medium leading-tight mb-4">
            Conectamos talento<br />con oportunidades
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Miles de operarios verificados listos para tu próximo proyecto.
          </p>
        </div>
      </div>

      {/* Lado derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-[#1A2F1A] mb-2">Bienvenido de nuevo</h1>
            <p className="text-gray-400 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-[#1A2F1A] font-medium mb-1.5 block">Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
                className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] transition-colors placeholder-gray-300"
                required
              />
            </div>

            <div>
              <label className="text-sm text-[#1A2F1A] font-medium mb-1.5 block">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] transition-colors placeholder-gray-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A2F1A] text-white font-medium py-3 rounded-xl hover:bg-[#2D4A2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-[#1A2F1A] font-medium hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage