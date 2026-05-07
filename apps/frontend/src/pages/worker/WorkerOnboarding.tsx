import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

function WorkerOnboarding() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
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
    } else {
      setError('Solo se aceptan archivos PDF.')
    }
  }

  const handleStep1 = () => {
    if (!profile.full_name || !profile.city) {
      setError('Por favor completa los campos obligatorios.')
      return
    }
    setError('')
    setStep(2)
  }

  const handleStep2 = () => {
    if (selectedSkills.length === 0) {
      setError('Selecciona al menos una habilidad.')
      return
    }
    setError('')
    setStep(3)
  }

  const handleFinish = async () => {
    if (!cvFile) {
      setError('Por favor sube tu CV en formato PDF.')
      return
    }
    setError('')
    setLoading(true)
    try {
      // Step 1: Save profile
      await api.post('/worker/profile', {
        bio: profile.bio,
        years_experience: parseInt(profile.years_experience) || 0,
        location: `${profile.city}, ${profile.department}`,
        phone: profile.phone,
      })

      // Step 2: Save skills
      for (const skill of selectedSkills) {
        await api.post('/worker/skills', { name: skill })
      }

      // Step 3: Upload CV
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
          <div className="wo-brand">EDIFEX</div>
          <div className="wo-steps">
            {stepConfig.map((s, i) => (
              <div key={i} className={`wo-step ${s.state}`}>
                <div className="wo-step-bar" />
                <span className="wo-step-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="wo-main">

        {error && <div className="wo-error">{error}</div>}

        {/* STEP 1: PERFIL */}
        {step === 1 && (
          <section>
            <h1 className="wo-section-title">Cuéntanos sobre ti</h1>
            <p className="wo-section-desc">Comienza tu viaje con Edifex completando tu perfil profesional.</p>

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
                placeholder="Cuéntanos brevemente sobre tus trabajos previos y especialidades..."
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <div className="wo-actions">
              <button className="wo-btn-next" onClick={handleStep1}>
                Siguiente
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: HABILIDADES */}
        {step === 2 && (
          <section>
            <h1 className="wo-section-title">¿En qué eres experto?</h1>
            <p className="wo-section-desc">Selecciona todas las áreas en las que posees experiencia comprobable.</p>

            <div className="wo-skills-grid">
              {SKILLS.map(skill => (
                <button
                  key={skill}
                  className={`wo-skill-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {selectedSkills.includes(skill) && (
                    <span className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                  {skill}
                </button>
              ))}
            </div>

            <div className="wo-actions has-back">
              <button className="wo-btn-back" onClick={() => { setError(''); setStep(1) }}>
                Anterior
              </button>
              <button className="wo-btn-next" onClick={handleStep2}>
                Siguiente
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: CV */}
        {step === 3 && (
          <section>
            <h1 className="wo-section-title">Sube tu CV</h1>
            <p className="wo-section-desc">Adjunta tu currículum o carpeta de trabajos previos para validar tu experiencia.</p>

            <div
              className={`wo-upload-zone ${cvFile ? 'has-file' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="wo-upload-icon">
                <span className="material-symbols-outlined">
                  {cvFile ? 'check_circle' : 'upload_file'}
                </span>
              </div>
              {cvFile ? (
                <div className="wo-upload-filename">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
                  {cvFile.name}
                </div>
              ) : (
                <>
                  <div>
                    <p className="wo-upload-title">Arrastra tu archivo aquí</p>
                    <p className="wo-upload-sub">O haz clic para buscar en tu dispositivo</p>
                  </div>
                  <div className="wo-upload-note">Solo PDF • Máx. 10MB</div>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <div className="wo-cv-banner">
              <span className="material-symbols-outlined wo-cv-banner-icon">architecture</span>
              <p className="wo-cv-banner-quote">
                "La precisión es la base de cada gran proyecto."
              </p>
            </div>

            <div className="wo-actions has-back">
              <button className="wo-btn-back" onClick={() => { setError(''); setStep(2) }}>
                Anterior
              </button>
              <button
                className="wo-btn-next"
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Finalizar'}
              </button>
            </div>
          </section>
        )}

      </main>

      <footer className="wo-footer">
        <p>© 2024 Edifex Construction Services. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default WorkerOnboarding