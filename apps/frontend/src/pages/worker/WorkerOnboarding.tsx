import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { workerService } from '../../services/workerService'

function WorkerOnboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState({
    bio: '',
    experience_years: '',
    hourly_rate: '',
    currency: 'COP',
    city: '',
    department: '',
    categories: [] as string[],
    is_available: true,
  })

  const [skill, setSkill] = useState({ name: '', category: '', years_experience: '' })
  const [skills, setSkills] = useState<any[]>([])
  const [cvFile, setCvFile] = useState<File | null>(null)

  const categories = [
    { value: 'electrical', label: 'Electricidad' },
    { value: 'plumbing', label: 'Plomería' },
    { value: 'masonry', label: 'Albañilería' },
    { value: 'carpentry', label: 'Carpintería' },
    { value: 'painting', label: 'Pintura' },
    { value: 'roofing', label: 'Techado' },
    { value: 'flooring', label: 'Pisos' },
    { value: 'general', label: 'General' },
  ]

  const toggleCategory = (value: string) => {
    setProfile(prev => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter(c => c !== value)
        : [...prev.categories, value]
    }))
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    setError('')
    try {
      await workerService.updateProfile({
        ...profile,
        experience_years: parseInt(profile.experience_years),
        hourly_rate: parseFloat(profile.hourly_rate),
      })
      setStep(2)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error guardando perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async () => {
    if (!skill.name) return
    setLoading(true)
    try {
      const res = await workerService.addSkill({
        name: skill.name,
        category: skill.category,
        years_experience: parseInt(skill.years_experience) || 0,
      })
      setSkills([...skills, res.data])
      setSkill({ name: '', category: '', years_experience: '' })
    } catch (err) {
      setError('Error agregando skill')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadCV = async () => {
    if (!cvFile) return
    setLoading(true)
    setError('')
    try {
      await workerService.uploadCV(cvFile)
      navigate('/worker/dashboard')
    } catch (err: any) {
      setError('Error subiendo CV')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      {/* Header */}
      <div className="bg-[#1A2F1A] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.svg" alt="Edifex" className="w-12 h-12 object-contain" />
          <span className="text-white font-bold text-lg tracking-widest">EDIFEX</span>
        </div>
        <span className="text-white/60 text-sm">Paso {step} de 3</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-[#1A2F1A]' : 'bg-[#E8E4DA]'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Paso 1 — Perfil básico */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-medium text-[#1A2F1A] mb-1">Cuéntanos sobre ti</h1>
            <p className="text-gray-400 text-sm mb-6">Completa tu perfil para aparecer en el marketplace</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1A2F1A] mb-1.5 block">Descripción profesional</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Describe tu experiencia y especialidades..."
                  rows={3}
                  className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] resize-none placeholder-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#1A2F1A] mb-1.5 block">Años de experiencia</label>
                  <input
                    type="number"
                    value={profile.experience_years}
                    onChange={(e) => setProfile({ ...profile, experience_years: e.target.value })}
                    placeholder="5"
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1A2F1A] mb-1.5 block">Tarifa por hora (COP)</label>
                  <input
                    type="number"
                    value={profile.hourly_rate}
                    onChange={(e) => setProfile({ ...profile, hourly_rate: e.target.value })}
                    placeholder="35000"
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] placeholder-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#1A2F1A] mb-1.5 block">Ciudad</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="Bucaramanga"
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] placeholder-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1A2F1A] mb-1.5 block">Departamento</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    placeholder="Santander"
                    className="w-full bg-white border border-[#E8E4DA] rounded-xl px-4 py-3 text-sm text-[#1A2F1A] outline-none focus:border-[#1A2F1A] placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1A2F1A] mb-2 block">Categorías de servicio</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value)}
                      className={`text-sm px-4 py-2 rounded-full border transition-all ${
                        profile.categories.includes(cat.value)
                          ? 'bg-[#1A2F1A] text-white border-[#1A2F1A]'
                          : 'bg-white text-gray-500 border-[#E8E4DA] hover:border-[#1A2F1A]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full bg-[#1A2F1A] text-white font-medium py-3 rounded-xl hover:bg-[#2D4A2D] transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Continuar →'}
              </button>
            </div>
          </div>
        )}

        {/* Paso 2 — Skills */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-medium text-[#1A2F1A] mb-1">Tus habilidades</h1>
            <p className="text-gray-400 text-sm mb-6">Agrega las skills que dominas</p>

            <div className="bg-white rounded-xl border border-[#E8E4DA] p-4 mb-4">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => setSkill({ ...skill, name: e.target.value })}
                  placeholder="Ej: Cableado eléctrico"
                  className="col-span-2 bg-[#F5F2ED] border border-[#E8E4DA] rounded-lg px-3 py-2 text-sm text-[#1A2F1A] outline-none placeholder-gray-300"
                />
                <input
                  type="number"
                  value={skill.years_experience}
                  onChange={(e) => setSkill({ ...skill, years_experience: e.target.value })}
                  placeholder="Años"
                  className="bg-[#F5F2ED] border border-[#E8E4DA] rounded-lg px-3 py-2 text-sm text-[#1A2F1A] outline-none placeholder-gray-300"
                />
              </div>
              <button
                onClick={handleAddSkill}
                disabled={loading || !skill.name}
                className="w-full bg-[#1A2F1A] text-white text-sm py-2 rounded-lg hover:bg-[#2D4A2D] transition-colors disabled:opacity-50"
              >
                + Agregar skill
              </button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {skills.map((s, i) => (
                  <span key={i} className="bg-[#1A2F1A] text-white text-xs px-3 py-1.5 rounded-full">
                    {s.name} · {s.years_experience} años
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white text-[#1A2F1A] border border-[#E8E4DA] font-medium py-3 rounded-xl hover:border-[#1A2F1A] transition-colors"
              >
                ← Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-[#1A2F1A] text-white font-medium py-3 rounded-xl hover:bg-[#2D4A2D] transition-colors"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Paso 3 — CV */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-medium text-[#1A2F1A] mb-1">Sube tu CV</h1>
            <p className="text-gray-400 text-sm mb-6">Nuestra IA analizará tu CV y extraerá tus skills automáticamente</p>

            <div
              className="bg-white border-2 border-dashed border-[#E8E4DA] rounded-2xl p-10 text-center mb-6 hover:border-[#1A2F1A] transition-colors cursor-pointer"
              onClick={() => document.getElementById('cv-input')?.click()}
            >
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm font-medium text-[#1A2F1A]">
                {cvFile ? cvFile.name : 'Haz clic para seleccionar tu CV'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Solo PDF · Máximo 10MB</p>
              <input
                id="cv-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-white text-[#1A2F1A] border border-[#E8E4DA] font-medium py-3 rounded-xl hover:border-[#1A2F1A] transition-colors"
              >
                ← Atrás
              </button>
              <button
                onClick={handleUploadCV}
                disabled={loading || !cvFile}
                className="flex-1 bg-[#1A2F1A] text-white font-medium py-3 rounded-xl hover:bg-[#2D4A2D] transition-colors disabled:opacity-50"
              >
                {loading ? 'Subiendo...' : 'Finalizar onboarding ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkerOnboarding