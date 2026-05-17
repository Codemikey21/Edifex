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
  category: string
  created_at: string
  client: { id: number; name: string }
}

function WorkerJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<number | null>(null)
  const [applied, setApplied] = useState<number[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await api.get('/jobs')
      setJobs(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (jobId: number) => {
    setApplying(jobId)
    try {
      await api.post('/jobs', { job_id: jobId })
      setApplied(prev => [...prev, jobId])
    } catch (err) {
      console.error(err)
      setApplied(prev => [...prev, jobId])
    } finally {
      setApplying(null)
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  const formatBudget = (min: number, max: number) => {
    if (!min && !max) return 'A convenir'
    if (!max) return `$${Number(min).toLocaleString()}`
    return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`
  }

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase()) ||
    job.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>Trabajos Disponibles</h2>
          <p style={{ color: '#737971', fontSize: 14 }}>{filteredJobs.length} trabajos disponibles</p>
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

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <span className="material-symbols-outlined" style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          fontSize: 20, color: '#737971'
        }}>
          search
        </span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por título, ubicación o categoría..."
          style={{
            width: '100%', padding: '12px 16px 12px 44px',
            border: '1.5px solid #c3c8bf', borderRadius: 12,
            fontSize: 15, color: '#1b1c1a', fontFamily: 'Inter, sans-serif',
            outline: 'none', boxSizing: 'border-box', background: 'white'
          }}
        />
      </div>

      {/* Jobs List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              style={{ height: 140, borderRadius: 16, background: '#efeeea' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
            />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'white', borderRadius: 16, padding: 48,
            textAlign: 'center', color: '#737971',
            boxShadow: '0 4px 20px rgba(26,47,26,0.05)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 52, display: 'block', marginBottom: 12, color: '#c3c8bf' }}>
            work_off
          </span>
          <h3 style={{ color: '#061a07', marginBottom: 8 }}>No hay trabajos disponibles</h3>
          <p>Vuelve más tarde para ver nuevas oportunidades</p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredJobs.map((job, i) => (
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
                alignItems: 'flex-start', gap: 20
              }}
            >
              <div style={{ flex: 1 }}>
                {/* Tags */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {job.category && (
                    <span style={{
                      padding: '3px 10px', borderRadius: 9999,
                      background: '#bdebbd', color: '#436c47',
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em'
                    }}>
                      {job.category}
                    </span>
                  )}
                  <span style={{
                    padding: '3px 10px', borderRadius: 9999,
                    background: '#efeeea', color: '#434841',
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em'
                  }}>
                    Activo
                  </span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#061a07', marginBottom: 8 }}>
                  {job.title}
                </h3>

                <p style={{ fontSize: 14, color: '#737971', marginBottom: 12, lineHeight: 1.6 }}>
                  {job.description?.substring(0, 120)}...
                </p>

                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  {job.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#737971' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>location_on</span>
                      {job.location}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#737971' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span>
                    {formatDate(job.created_at)}
                  </div>
                  {job.client?.name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#737971' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                      {job.client.name}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#737971', marginBottom: 2 }}>
                    Presupuesto
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#061a07' }}>
                    {formatBudget(job.budget_min, job.budget_max)}
                  </p>
                </div>
                <motion.button
                  onClick={() => !applied.includes(job.id) && handleApply(job.id)}
                  disabled={applying === job.id || applied.includes(job.id)}
                  style={{
                    padding: '10px 24px',
                    background: applied.includes(job.id) ? '#bdebbd' : '#061a07',
                    color: applied.includes(job.id) ? '#436c47' : 'white',
                    border: 'none', borderRadius: 9999, fontSize: 13,
                    fontWeight: 700, cursor: applied.includes(job.id) ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, sans-serif', display: 'flex',
                    alignItems: 'center', gap: 6
                  }}
                  whileHover={!applied.includes(job.id) ? { scale: 1.05 } : {}}
                  whileTap={!applied.includes(job.id) ? { scale: 0.95 } : {}}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {applied.includes(job.id) ? 'check_circle' : 'send'}
                  </span>
                  {applying === job.id ? 'Aplicando...' : applied.includes(job.id) ? 'Aplicado' : 'Aplicar'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default WorkerJobs