import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AdminSettings() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    {
      title: 'Información de la Cuenta',
      icon: 'manage_accounts',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
                Nombre
              </label>
              <input
                defaultValue={user?.name}
                style={{
                  width: '100%', padding: '10px 14px', border: '1.5px solid #c3c8bf',
                  borderRadius: 12, fontSize: 15, color: '#1b1c1a',
                  fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                defaultValue={user?.email}
                type="email"
                style={{
                  width: '100%', padding: '10px 14px', border: '1.5px solid #c3c8bf',
                  borderRadius: 12, fontSize: 15, color: '#1b1c1a',
                  fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
              Rol
            </label>
            <input
              defaultValue="Administrador"
              disabled
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #efeeea',
                borderRadius: 12, fontSize: 15, color: '#737971', background: '#f5f3ef',
                fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Seguridad',
      icon: 'security',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
              Contraseña Actual
            </label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #c3c8bf',
                borderRadius: 12, fontSize: 15, color: '#1b1c1a',
                fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
                Nueva Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '10px 14px', border: '1.5px solid #c3c8bf',
                  borderRadius: 12, fontSize: 15, color: '#1b1c1a',
                  fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '10px 14px', border: '1.5px solid #c3c8bf',
                  borderRadius: 12, fontSize: 15, color: '#1b1c1a',
                  fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Notificaciones',
      icon: 'notifications',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Nuevo usuario registrado', desc: 'Recibir alerta cuando un usuario se registre' },
            { label: 'Operario pendiente', desc: 'Notificar cuando un operario espere aprobación' },
            { label: 'Review reportada', desc: 'Alertar cuando una review sea marcada como fraude' },
            { label: 'Trabajo publicado', desc: 'Notificar cuando se publique un nuevo trabajo' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #efeeea' }}>
              <div>
                <p style={{ fontWeight: 600, color: '#061a07', fontSize: 15, marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: 13, color: '#737971' }}>{item.desc}</p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, flexShrink: 0 }}>
                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', cursor: 'pointer', inset: 0,
                  background: '#3f6743', borderRadius: 9999, transition: '0.3s'
                }} />
              </label>
            </div>
          ))}
        </div>
      )
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>Configuración</h2>
        <p style={{ color: '#737971', fontSize: 14 }}>Administra tu cuenta y preferencias del sistema</p>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'white', borderRadius: 16, padding: 28,
              boxShadow: '0 4px 20px rgba(26,47,26,0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#bdebbd', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#3f6743' }}>
                  {section.icon}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#061a07' }}>{section.title}</h3>
            </div>
            {section.content}
          </motion.div>
        ))}

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.button
            onClick={handleLogout}
            style={{
              padding: '12px 24px', background: 'none',
              border: '1.5px solid #ba1a1a', color: '#ba1a1a',
              borderRadius: 9999, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 8
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            Cerrar Sesión
          </motion.button>

          <motion.button
            onClick={handleSave}
            style={{
              padding: '12px 32px',
              background: saved ? '#3f6743' : '#061a07',
              color: 'white', border: 'none', borderRadius: 9999,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', display: 'flex',
              alignItems: 'center', gap: 8, transition: 'background 0.3s'
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              {saved ? 'check_circle' : 'save'}
            </span>
            {saved ? '¡Guardado!' : 'Guardar Cambios'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminSettings