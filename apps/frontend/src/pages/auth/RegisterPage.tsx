import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

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
            Únete a la comunidad<br />de construcción
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Registrate como cliente o como operario y empieza hoy mismo.
          </p>
        </div>
      </div>

      {/* Lado derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-medium text-[#1A2F1A] mb-2">Crear cuenta</h1>
            <p className="text-gray-400 text-sm">Completa los datos para registrarte</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Selector de rol */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'client' })}
              className={`py-4 rounded-xl border text-sm font-medium transition-all ${
                form.role === 'client'
                  ? 'bg-[#1A2F1A] text-white border-[#1A2F1A]'
                  : 'bg-white text-gray-500 border-[#E8E4DA] hover:border-[#1A2F1A]'
              }`}
            >
              🏠 Soy cliente
              <div className="text-xs font-normal mt-0.5 opacity-70">Busco operarios</div>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'worker' })}
              className={`py-4 rounded-xl border text-sm font-medium transition-all ${
                form.role === 'worker'
                  ? 'bg-[#1A2F1A] text-white border-[#1A2F1A]'
                  : 'bg-white text-gray-500 border-[#E8E4DA] hover:border-[#1A2F1A]'
              }`}
            >
              🔧 Soy operario
              <div className="text-xs font-normal mt-0.5 opacity-70">Ofrezco servicios</div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-[#1A2F1A] font-medium mb-1.5 block">Nombre completo</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tu nombre"
                className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] transition-colors placeholder-gray-300"
                required
              />
            </div>

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
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] transition-colors placeholder-gray-300"
                required
              />
            </div>

            <div>
              <label className="text-sm text-[#1A2F1A] font-medium mb-1.5 block">Confirmar contraseña</label>
              <input
                type="password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                placeholder="Repite tu contraseña"
                className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] transition-colors placeholder-gray-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A2F1A] text-white font-medium py-3 rounded-xl hover:bg-[#2D4A2D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#1A2F1A] font-medium hover:underline">
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage