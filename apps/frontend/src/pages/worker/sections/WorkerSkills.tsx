import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../../services/api'

const SUGGESTED_SKILLS = [
  'Carpintería', 'Electricidad', 'Plomería', 'Pintura',
  'Albañilería', 'Soldadura', 'Instalaciones', 'Steel Frame',
  'Yeso', 'Impermeabilización', 'Cerámica', 'Acabados',
  'Estructuras Metálicas', 'Demolición', 'Excavación'
]

interface Skill {
  id: number
  name: string
  level: string
}

function WorkerSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const res = await api.get('/worker/skills')
      setSkills(res.data.data || res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async (skillName: string) => {
    if (!skillName.trim()) return
    setAdding(true)
    setError('')
    try {
      await api.post('/worker/skills', { name: skillName })
      setNewSkill('')
      fetchSkills()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al agregar habilidad')
    } finally {
      setAdding(false)
    }
  }

  const alreadyAdded = (skillName: string) =>
    skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>Mis Habilidades</h2>
        <p style={{ color: '#737971', fontSize: 14 }}>Agrega las especialidades que dominas</p>
      </div>

      {/* Current Skills */}
      <motion.div
        style={{
          background: 'white', borderRadius: 16, padding: 28,
          boxShadow: '0 4px 20px rgba(26,47,26,0.05)', marginBottom: 20
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#061a07', marginBottom: 16 }}>
          Habilidades Actuales
        </h3>

        {loading ? (
          <div style={{ color: '#737971', fontSize: 14 }}>Cargando habilidades...</div>
        ) : skills.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#737971' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8, color: '#c3c8bf' }}>
              construction
            </span>
            No tienes habilidades registradas aún.
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <AnimatePresence>
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', background: '#bdebbd',
                    borderRadius: 9999, fontSize: 14, fontWeight: 600, color: '#436c47'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  {skill.name}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Add Skill */}
      <motion.div
        style={{
          background: 'white', borderRadius: 16, padding: 28,
          boxShadow: '0 4px 20px rgba(26,47,26,0.05)', marginBottom: 20
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#061a07', marginBottom: 16 }}>
          Agregar Habilidad
        </h3>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '10px 16px', background: '#ffdad6', color: '#93000a',
              borderRadius: 10, fontSize: 13, marginBottom: 16
            }}
          >
            {error}
          </motion.div>
        )}

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSkill(newSkill)}
            placeholder="Escribe una habilidad personalizada..."
            style={{
              flex: 1, padding: '10px 16px', border: '1.5px solid #c3c8bf',
              borderRadius: 12, fontSize: 15, color: '#1b1c1a',
              fontFamily: 'Inter, sans-serif', outline: 'none'
            }}
          />
          <motion.button
            onClick={() => handleAddSkill(newSkill)}
            disabled={adding || !newSkill.trim()}
            style={{
              padding: '10px 24px', background: '#061a07', color: 'white',
              border: 'none', borderRadius: 9999, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif'
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {adding ? '...' : 'Agregar'}
          </motion.button>
        </div>

        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#737971', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Sugeridas
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTED_SKILLS.map((skill, i) => {
            const added = alreadyAdded(skill)
            return (
              <motion.button
                key={skill}
                onClick={() => !added && handleAddSkill(skill)}
                disabled={added || adding}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={!added ? { scale: 1.05 } : {}}
                whileTap={!added ? { scale: 0.95 } : {}}
                style={{
                  padding: '7px 16px', borderRadius: 9999, fontSize: 13,
                  fontWeight: 600, cursor: added ? 'not-allowed' : 'pointer',
                  border: 'none', fontFamily: 'Inter, sans-serif',
                  background: added ? '#efeeea' : '#faf9f5',
                  color: added ? '#737971' : '#061a07',
                  border: added ? '1.5px solid #efeeea' : '1.5px solid #c3c8bf',
                }}
              >
                {added ? '✓ ' : '+ '}{skill}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WorkerSkills