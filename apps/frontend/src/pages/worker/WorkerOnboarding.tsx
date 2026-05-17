import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../services/api'
import '../../styles/worker-onboarding.css'

const SKILLS = [
  'Carpintería', 'Electricidad', 'Plomería', 'Pintura',
  'Albañilería', 'Soldadura', 'Instalaciones', 'Steel Frame',
  'Yeso', 'Otros'
]

const DEPARTMENTS = [
  'Seleccionar...', 'Obra Civil', 'Acabados', 'Instalaciones', 'Mantenimiento'
]

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

function WorkerOnboarding() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState({
    full_name: '', phone: '', city: '',
    department: '', years_experience: '', bio: ''
  })

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [cvFile, setCvFile] = useState<File | null>(null)

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
      setError('')
    } else {
      setError('Solo se aceptan archivos PDF.')
    }
  }

  const goNext = (validate: () => boolean) => {
    if (!validate()) return
    setError('')
    setDirection(1)
    setStep(s => s + 1)
  }

  const goBack = () => {
    setError('')
    setDirection(-1)
    setStep(s => s - 1)
  }

  const handleStep1 = () => goNext(() => {
    if (!profile.full_name || !profile.city) {
      setError('Por favor completa los campos obligatorios.')
      return false
    }
    return true
  })

  const handleStep2 = () => goNext(() => {
    if (selectedSkills.length === 0) {
      setError('Selecciona al menos una habilidad.')
      return false
    }
    return true
  })

  const handleFinish = async () => {
    if (!cvFile) {
      setError('Por favor sube tu CV en formato PDF.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/worker/profile', {
        bio: profile.bio,
        years_experience: parseInt(profile.years_experience) || 0,
        location: `${profile.city}, ${profile.department}`,
        phone: profile.phone,
      })
      for (const skill of selectedSkills) {
        await api.post('/worker/skills', { name: skill })
      }
      const formData = new FormData()
      formData.append('cv', cvFile)
      await api.post('/worker/cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/worker/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  const stepConfig = [
    { label: 'Perfil', state: step >= 1 ? (step > 1 ? 'done' : 'active') : '' },
    { label: 'Habilidades', state: step >= 2 ? (step > 2 ? 'done' : 'active') : '' },
    { label: 'CV', state: step >= 3 ? 'active' : '' },
  ]

  return (
    <div className="wo-page">

      {/* HEADER */}
      <header className="wo-header">
        <div className="wo-header-inner">
          <motion.div
            className="wo-brand"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            EDIFEX
          </motion.div>
          <div className="wo-steps">
            {stepConfig.map((s, i) => (
              <motion.div
                key={i}
                className={`wo-step ${s.state}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <motion.div
                  className="wo-step-bar"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ transformOrigin: 'left' }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                />
                <span className="wo-step-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="wo-main">

        {error && (
          <motion.div
            className="wo-error"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait" custom={direction}>

          {/* STEP 1 */}
          {step === 1 && (
            <motion.section
              key="step1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <motion.h1
                className="wo-section-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Cuéntanos sobre ti
              </motion.h1>
              <motion.p
                className="wo-section-desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Comienza tu viaje con Edifex completando tu perfil profesional.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="wo-field">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    value={profile.full_name}
                    onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                  />
                </div>

                <div className="wo-field-grid">
                  <div className="wo-field" style={{ margin: 0 }}>
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      placeholder="+57 300 000 0000"
                      value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="wo-field" style={{ margin: 0 }}>
                    <label>Ciudad</label>
                    <input
                      type="text"
                      placeholder="Ej. Bucaramanga"
                      value={profile.city}
                      onChange={e => setProfile({ ...profile, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="wo-field-grid">
                  <div className="wo-field" style={{ margin: 0 }}>
                    <label>Departamento</label>
                    <select
                      value={profile.department}
                      onChange={e => setProfile({ ...profile, department: e.target.value })}
                    >
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="wo-field" style={{ margin: 0 }}>
                    <label>Años de Experiencia</label>
                    <input
                      type="number"
                      placeholder="Ej. 5"
                      value={profile.years_experience}
                      onChange={e => setProfile({ ...profile, years_experience: e.target.value })}
                    />
                  </div>
                </div>

                <div className="wo-field">
                  <label>Bio / Descripción</label>
                  <textarea
                    rows={4}
                    placeholder="Cuéntanos brevemente sobre tus trabajos previos..."
                    value={profile.bio}
                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>

                <div className="wo-actions">
                  <motion.button
                    className="wo-btn-next"
                    onClick={handleStep1}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Siguiente →
                  </motion.button>
                </div>
              </motion.div>
            </motion.section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.section
              key="step2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <motion.h1
                className="wo-section-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                ¿En qué eres experto?
              </motion.h1>
              <motion.p
                className="wo-section-desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Selecciona todas las áreas en las que posees experiencia comprobable.
              </motion.p>

              <motion.div
                className="wo-skills-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {SKILLS.map((skill, i) => (
                  <motion.button
                    key={skill}
                    className={`wo-skill-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence>
                      {selectedSkills.includes(skill) && (
                        <motion.span
                          className="material-symbols-outlined"
                          style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          check_circle
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {skill}
                  </motion.button>
                ))}
              </motion.div>

              {selectedSkills.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontSize: 13, color: '#3f6743', fontWeight: 600, marginBottom: 16 }}
                >
                  {selectedSkills.length} habilidad{selectedSkills.length > 1 ? 'es' : ''} seleccionada{selectedSkills.length > 1 ? 's' : ''}
                </motion.p>
              )}

              <div className="wo-actions has-back">
                <motion.button
                  className="wo-btn-back"
                  onClick={goBack}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ← Anterior
                </motion.button>
                <motion.button
                  className="wo-btn-next"
                  onClick={handleStep2}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Siguiente →
                </motion.button>
              </div>
            </motion.section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.section
              key="step3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <motion.h1
                className="wo-section-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Sube tu CV
              </motion.h1>
              <motion.p
                className="wo-section-desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Adjunta tu currículum o carpeta de trabajos previos para validar tu experiencia.
              </motion.p>

              <motion.div
                className={`wo-upload-zone ${cvFile ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ borderColor: '#061a07', scale: 1.01 }}
              >
                <motion.div
                  className="wo-upload-icon"
                  animate={cvFile ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <span className="material-symbols-outlined">
                    {cvFile ? 'check_circle' : 'upload_file'}
                  </span>
                </motion.div>
                {cvFile ? (
                  <motion.div
                    className="wo-upload-filename"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
                    {cvFile.name}
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <p className="wo-upload-title">Arrastra tu archivo aquí</p>
                      <p className="wo-upload-sub">O haz clic para buscar en tu dispositivo</p>
                    </div>
                    <div className="wo-upload-note">Solo PDF • Máx. 10MB</div>
                  </>
                )}
              </motion.div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <motion.div
                className="wo-cv-banner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="material-symbols-outlined wo-cv-banner-icon">architecture</span>
                <p className="wo-cv-banner-quote">
                  "La precisión es la base de cada gran proyecto."
                </p>
              </motion.div>

              <div className="wo-actions has-back">
                <motion.button
                  className="wo-btn-back"
                  onClick={goBack}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ← Anterior
                </motion.button>
                <motion.button
                  className="wo-btn-next"
                  onClick={handleFinish}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.03 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                >
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      Guardando...
                    </motion.span>
                  ) : 'Finalizar ✓'}
                </motion.button>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>

      <footer className="wo-footer">
        <p>© 2024 Edifex Construction Services. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default WorkerOnboarding