import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'

function WorkerProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    bio: '',
    location: '',
    phone: '',
    years_experience: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await api.get('/worker/profile')
      setProfile(res.data)
      setForm({
        bio: res.data.bio || '',
        location: res.data.location || '',
        phone: res.data.phone || '',
        years_experience: res.data.years_experience || '',
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.post('/worker/profile', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      fetchProfile()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#737971' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: 32, height: 32, border: '3px solid #bdebbd', borderTopColor: '#3f6743', borderRadius: '50%', margin: '0 auto 12px' }}
      />
      Cargando perfil...
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>Mi Perfil</h2>
        <p style={{ color: '#737971', fontSize: 14 }}>Actualiza tu información profesional</p>
      </div>

      {/* Avatar + Info */}
      <motion.div
        style={{
          background: 'white', borderRadius: 16, padding: 28,
          boxShadow: '0 4px 20px rgba(26,47,26,0.05)', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 24
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#bdebbd', color: '#436c47',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 700, flexShrink: 0
          }}
          whileHover={{ scale: 1.05 }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </motion.div>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>{user?.name}</h3>
          <p style={{ fontSize: 14, color: '#737971', marginBottom: 8 }}>{user?.email}</p>
          <span style={{
            padding: '4px 12px', borderRadius: 9999,
            background: profile?.status === 'active' ? '#bdebbd' : '#fff3cd',
            color: profile?.status === 'active' ? '#436c47' : '#856404',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            {profile?.status === 'active' ? 'Perfil Activo' : 'Pendiente Aprobación'}
          </span>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        style={{
          background: 'white', borderRadius: 16, padding: 28,
          boxShadow: '0 4px 20px rgba(26,47,26,0.05)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#061a07', marginBottom: 20 }}>
          Información Profesional
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
              Ubicación
            </label>
            <input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="Ej. Bucaramanga, Colombia"
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #c3c8bf',
                borderRadius: 12, fontSize: 15, color: '#1b1c1a',
                fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
              Teléfono
            </label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+57 300 000 0000"
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #c3c8bf',
                borderRadius: 12, fontSize: 15, color: '#1b1c1a',
                fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
            Años de Experiencia
          </label>
          <input
            type="number"
            value={form.years_experience}
            onChange={e => setForm({ ...form, years_experience: e.target.value })}
            placeholder="Ej. 5"
            style={{
              width: '100%', padding: '10px 14px', border: '1.5px solid #c3c8bf',
              borderRadius: 12, fontSize: 15, color: '#1b1c1a',
              fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', display: 'block', marginBottom: 6 }}>
            Bio / Descripción
          </label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Cuéntanos sobre tu experiencia profesional..."
            style={{
              width: '100%', padding: '10px 14px', border: '1.5px solid #c3c8bf',
              borderRadius: 12, fontSize: 15, color: '#1b1c1a',
              fontFamily: 'Inter, sans-serif', outline: 'none',
              boxSizing: 'border-box', resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <motion.button
            onClick={handleSave}
            disabled={saving}
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
            {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar Cambios'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WorkerProfile