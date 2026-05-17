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
  client: { id: number; name: string; email: string }
}

function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchJobs()
  }, [activeTab, page])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = activeTab === 'all' ? '' : `&status=${activeTab}`
      const res = await api.get(`/admin/jobs?page=${page}${params}`)
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

  const formatBudget = (min: number, max: number) => {
    if (!min && !max) return '—'
    return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      published: { bg: '#bdebbd', color: '#436c47', label: 'Publicado' },
      completed: { bg: '#cfe2ff', color: '#084298', label: 'Completado' },
      cancelled: { bg: '#ffdad6', color: '#93000a', label: 'Cancelado' },
      draft: { bg: '#e9e8e4', color: '#434841', label: 'Borrador' },
    }
    return map[status] || { bg: '#e9e8e4', color: '#434841', label: status }
  }

  const tabs = [
    { key: 'all', label: 'Todos' },
    { key: 'published', label: 'Publicados' },
    { key: 'completed', label: 'Completados' },
    { key: 'cancelled', label: 'Cancelados' },
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
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>Trabajos</h2>
          <p style={{ color: '#737971', fontSize: 14 }}>Todos los trabajos publicados en la plataforma</p>
        </div>
        <motion.button
          onClick={fetchJobs}
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
            onClick={() => { setActiveTab(tab.key); setPage(1) }}
            style={{
              padding: '8px 20px', borderRadius: 9999, fontSize: 12,
              fontWeight: 700, cursor: 'pointer', border: 'none',
              fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em',
              background: activeTab === tab.key ? '#061a07' : '#efeeea',
              color: activeTab === tab.key ? 'white' : '#737971',
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
            Cargando trabajos...
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#737971' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, display: 'block', marginBottom: 12, color: '#c3c8bf' }}>
              work_off
            </span>
            No hay trabajos en este estado.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f3ef' }}>
                {['Título', 'Cliente', 'Presupuesto', 'Ubicación', 'Estado', 'Fecha'].map(h => (
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
              {jobs.map((job, i) => {
                const badge = getStatusBadge(job.status)
                return (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ borderBottom: '1px solid rgba(195,200,191,0.2)' }}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <p style={{ fontWeight: 700, color: '#061a07', fontSize: 14, marginBottom: 2 }}>{job.title}</p>
                      <p style={{ fontSize: 12, color: '#737971' }}>
                        {job.description?.substring(0, 40)}...
                      </p>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#434841', fontSize: 14 }}>
                      {job.client?.name || '—'}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#061a07' }}>
                      {formatBudget(job.budget_min, job.budget_max)}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#434841', fontSize: 14 }}>
                      {job.location || '—'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 9999,
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                        textTransform: 'uppercase', background: badge.bg, color: badge.color
                      }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#434841', fontSize: 14 }}>
                      {formatDate(job.created_at)}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        <motion.button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{
            padding: '8px 16px',
            background: page === 1 ? '#efeeea' : '#061a07',
            color: page === 1 ? '#737971' : 'white',
            border: 'none', borderRadius: 9999, fontSize: 12,
            fontWeight: 700, cursor: page === 1 ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
          whileHover={page > 1 ? { scale: 1.05 } : {}}
        >
          ← Anterior
        </motion.button>
        <span style={{ padding: '8px 16px', fontSize: 13, color: '#737971', display: 'flex', alignItems: 'center' }}>
          Página {page}
        </span>
        <motion.button
          onClick={() => setPage(p => p + 1)}
          disabled={jobs.length < 20}
          style={{
            padding: '8px 16px',
            background: jobs.length < 20 ? '#efeeea' : '#061a07',
            color: jobs.length < 20 ? '#737971' : 'white',
            border: 'none', borderRadius: 9999, fontSize: 12,
            fontWeight: 700, cursor: jobs.length < 20 ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
          whileHover={jobs.length >= 20 ? { scale: 1.05 } : {}}
        >
          Siguiente →
        </motion.button>
      </div>
    </motion.div>
  )
}

export default AdminJobs