import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../../services/api'

interface Worker {
  user_id: number
  status: string
  bio: string
  location: string
  years_experience: number
  created_at: string
  user: { id: number; name: string; email: string }
}

function AdminWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'suspended'>('pending')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchWorkers()
  }, [activeTab])

  const fetchWorkers = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/admin/workers?status=${activeTab}`)
      setWorkers(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: number) => {
    setActionLoading(userId)
    try {
      await api.patch(`/admin/workers/${userId}/approve`)
      setWorkers(prev => prev.filter(w => w.user_id !== userId))
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (userId: number) => {
    setActionLoading(userId)
    try {
      await api.patch(`/admin/workers/${userId}/reject`)
      setWorkers(prev => prev.filter(w => w.user_id !== userId))
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (userId: number) => {
    setActionLoading(userId)
    try {
      await api.patch(`/admin/workers/${userId}/suspend`)
      setWorkers(prev => prev.filter(w => w.user_id !== userId))
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  const tabs = [
    { key: 'pending', label: 'Pendientes', color: '#856404', bg: '#fff3cd' },
    { key: 'active', label: 'Aprobados', color: '#436c47', bg: '#bdebbd' },
    { key: 'suspended', label: 'Suspendidos', color: '#93000a', bg: '#ffdad6' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>Operarios</h2>
          <p style={{ color: '#737971', fontSize: 14 }}>Gestiona los operarios de la plataforma</p>
        </div>
        <motion.button
          onClick={fetchWorkers}
          style={{
            padding: '10px 20px', background: '#061a07', color: 'white',
            border: 'none', borderRadius: 9999, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif'
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          ↻ Actualizar
        </motion.button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(tab => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: '8px 20px', borderRadius: 9999, fontSize: 12,
              fontWeight: 700, cursor: 'pointer', border: 'none',
              fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em',
              background: activeTab === tab.key ? tab.bg : '#efeeea',
              color: activeTab === tab.key ? tab.color : '#737971',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(26,47,26,0.05)' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#737971' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: 32, height: 32, border: '3px solid #bdebbd', borderTopColor: '#3f6743', borderRadius: '50%', margin: '0 auto 12px' }}
            />
            Cargando operarios...
          </div>
        ) : workers.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#737971' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12, color: '#c3c8bf' }}>
              engineering
            </span>
            No hay operarios en estado "{activeTab}".
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f3ef' }}>
                {['Operario', 'Email', 'Ubicación', 'Experiencia', 'Fecha', 'Acciones'].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left', fontSize: 11,
                    fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <motion.tr
                  key={w.user_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid rgba(195,200,191,0.2)' }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#bdebbd', color: '#436c47',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 14
                      }}>
                        {w.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 700, color: '#061a07', fontSize: 15 }}>{w.user?.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#434841', fontSize: 14 }}>{w.user?.email}</td>
                  <td style={{ padding: '14px 20px', color: '#434841', fontSize: 14 }}>{w.location || '—'}</td>
                  <td style={{ padding: '14px 20px', color: '#434841', fontSize: 14 }}>{w.years_experience ? `${w.years_experience} años` : '—'}</td>
                  <td style={{ padding: '14px 20px', color: '#434841', fontSize: 14 }}>{formatDate(w.created_at)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {activeTab === 'pending' && (
                        <>
                          <motion.button
                            onClick={() => handleApprove(w.user_id)}
                            disabled={actionLoading === w.user_id}
                            style={{
                              padding: '6px 12px', background: '#3f6743', color: 'white',
                              border: 'none', borderRadius: 9999, fontSize: 10,
                              fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {actionLoading === w.user_id ? '...' : 'Aprobar'}
                          </motion.button>
                          <motion.button
                            onClick={() => handleReject(w.user_id)}
                            disabled={actionLoading === w.user_id}
                            style={{
                              padding: '6px 12px', background: 'none', border: '1.5px solid #ba1a1a',
                              color: '#ba1a1a', borderRadius: 9999, fontSize: 10,
                              fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {actionLoading === w.user_id ? '...' : 'Rechazar'}
                          </motion.button>
                        </>
                      )}
                      {activeTab === 'active' && (
                        <motion.button
                          onClick={() => handleSuspend(w.user_id)}
                          disabled={actionLoading === w.user_id}
                          style={{
                            padding: '6px 12px', background: 'none', border: '1.5px solid #ba1a1a',
                            color: '#ba1a1a', borderRadius: 9999, fontSize: 10,
                            fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {actionLoading === w.user_id ? '...' : 'Suspender'}
                        </motion.button>
                      )}
                      {activeTab === 'suspended' && (
                        <motion.button
                          onClick={() => handleApprove(w.user_id)}
                          disabled={actionLoading === w.user_id}
                          style={{
                            padding: '6px 12px', background: '#3f6743', color: 'white',
                            border: 'none', borderRadius: 9999, fontSize: 10,
                            fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {actionLoading === w.user_id ? '...' : 'Reactivar'}
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  )
}

export default AdminWorkers