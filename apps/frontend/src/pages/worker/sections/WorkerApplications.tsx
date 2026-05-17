import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../../../services/api'

interface Job {
  id: number
  title: string
  description: string
  status: string
  budget_min: number
  budget_max: number
  location: string
  created_at: string
}

function WorkerApplications() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await api.get('/jobs/my-jobs')
      setJobs(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      published: { bg: '#bdebbd', color: '#436c47', label: 'Activo' },
      completed: { bg: '#cfe2ff', color: '#084298', label: 'Completado' },
      cancelled: { bg: '#ffdad6', color: '#93000a', label: 'Cancelado' },
      draft: { bg: '#e9e8e4', color: '#434841', label: 'Borrador' },
    }
    return map[status] || { bg: '#e9e8e4', color: '#434841', label: status }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>
            Mis Postulaciones
          </h2>
          <p style={{ color: '#737971', fontSize: 14 }}>
            {jobs.length} postulacion{jobs.length !== 1 ? 'es' : ''} registrada{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          onClick={fetchApplications}
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

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              style={{ height: 120, borderRadius: 16, background: '#efeeea' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'white', borderRadius: 16, padding: 48,
            textAlign: 'center', color: '#737971',
            boxShadow: '0 4px 20px rgba(26,47,26,0.05)'
          }}
        >
          <span className="material-symbols-outlined" style={{
            fontSize: 52, display: 'block', marginBottom: 12, color: '#c3c8bf'
          }}>
            send
          </span>
          <h3 style={{ color: '#061a07', marginBottom: 8 }}>Sin postulaciones aún</h3>
          <p>Explora los trabajos disponibles y aplica a los que te interesen</p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {jobs.map((job, i) => {
            const badge = getStatusBadge(job.status)
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(26,47,26,0.1)' }}
                style={{
                  background: 'white', borderRadius: 16, padding: 24,
                  boxShadow: '0 4px 20px rgba(26,47,26,0.05)',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', gap: 20
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: '#f0faf0', display: 'flex',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#3f6743' }}>
                        work
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#061a07', marginBottom: 2 }}>
                        {job.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {job.location && (
                          <span style={{ fontSize: 13, color: '#737971', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                            {job.location}
                          </span>
                        )}
                        <span style={{ fontSize: 13, color: '#737971', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                          {formatDate(job.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 14, color: '#737971', lineHeight: 1.6 }}>
                    {job.description?.substring(0, 100)}...
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 9999,
                    background: badge.bg, color: badge.color,
                    fontSize: 11, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.08em'
                  }}>
                    {badge.label}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: '#737971', marginBottom: 2 }}>Presupuesto</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#061a07' }}>
                      ${Number(job.budget_min || 0).toLocaleString()} - ${Number(job.budget_max || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

export default WorkerApplications