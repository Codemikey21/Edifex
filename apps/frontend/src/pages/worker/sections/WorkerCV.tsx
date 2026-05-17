import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import api from '../../../services/api'

function WorkerCV() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
      setError('')
      setUploaded(false)
    } else {
      setError('Solo se aceptan archivos PDF.')
    }
  }

  const handleUpload = async () => {
    if (!cvFile) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('cv', cvFile)
      await api.post('/worker/cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploaded(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al subir el CV.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
      setError('')
      setUploaded(false)
    } else {
      setError('Solo se aceptan archivos PDF.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#061a07', marginBottom: 4 }}>Mi CV</h2>
        <p style={{ color: '#737971', fontSize: 14 }}>Sube tu currículum para que los clientes puedan conocerte mejor</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: '12px 16px', background: '#ffdad6', color: '#93000a',
            borderRadius: 12, fontSize: 13, marginBottom: 16
          }}
        >
          {error}
        </motion.div>
      )}

      {uploaded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding: '12px 16px', background: '#bdebbd', color: '#436c47',
            borderRadius: 12, fontSize: 13, marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          CV subido exitosamente.
        </motion.div>
      )}

      {/* Upload Zone */}
      <motion.div
        style={{
          background: 'white', borderRadius: 16, padding: 28,
          boxShadow: '0 4px 20px rgba(26,47,26,0.05)', marginBottom: 20
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{
            border: `2px dashed ${cvFile ? '#3f6743' : '#c3c8bf'}`,
            borderRadius: 16, padding: '48px 24px',
            textAlign: 'center', cursor: 'pointer',
            background: cvFile ? '#f0faf0' : '#faf9f5',
            transition: 'all 0.3s'
          }}
          whileHover={{ borderColor: '#3f6743', scale: 1.01 }}
        >
          <motion.div
            animate={cvFile ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <span className="material-symbols-outlined" style={{
              fontSize: 56, display: 'block', marginBottom: 16,
              color: cvFile ? '#3f6743' : '#c3c8bf',
              fontVariationSettings: cvFile ? "'FILL' 1" : "'FILL' 0"
            }}>
              {cvFile ? 'check_circle' : 'upload_file'}
            </span>
          </motion.div>

          {cvFile ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#ba1a1a', fontVariationSettings: "'FILL' 1" }}>
                  picture_as_pdf
                </span>
                <span style={{ fontWeight: 700, color: '#061a07', fontSize: 16 }}>{cvFile.name}</span>
              </div>
              <p style={{ fontSize: 13, color: '#737971' }}>
                {(cvFile.size / 1024 / 1024).toFixed(2)} MB • Haz clic para cambiar
              </p>
            </motion.div>
          ) : (
            <>
              <p style={{ fontWeight: 700, color: '#061a07', fontSize: 16, marginBottom: 8 }}>
                Arrastra tu CV aquí
              </p>
              <p style={{ fontSize: 14, color: '#737971', marginBottom: 12 }}>
                O haz clic para buscar en tu dispositivo
              </p>
              <span style={{
                padding: '6px 16px', background: '#efeeea', borderRadius: 9999,
                fontSize: 12, fontWeight: 700, color: '#737971',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                Solo PDF • Máx. 10MB
              </span>
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

        {cvFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 12 }}
          >
            <motion.button
              onClick={() => { setCvFile(null); setUploaded(false) }}
              style={{
                padding: '10px 20px', background: 'none',
                border: '1.5px solid #c3c8bf', color: '#434841',
                borderRadius: 9999, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif'
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={handleUpload}
              disabled={uploading}
              style={{
                padding: '10px 28px',
                background: uploaded ? '#3f6743' : '#061a07',
                color: 'white', border: 'none', borderRadius: 9999,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', display: 'flex',
                alignItems: 'center', gap: 8, transition: 'background 0.3s'
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                {uploaded ? 'check_circle' : 'cloud_upload'}
              </span>
              {uploading ? 'Subiendo...' : uploaded ? '¡Subido!' : 'Subir CV'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div
        style={{
          background: '#f0faf0', borderRadius: 16, padding: 24,
          border: '1px solid #bdebbd'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#3f6743', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>lightbulb</span>
          Consejos para un buen CV
        </h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Incluye tus proyectos más relevantes con fotos si es posible',
            'Menciona certificaciones y cursos completados',
            'Describe claramente tus años de experiencia por área',
            'Agrega referencias de clientes anteriores',
          ].map((tip, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: '#436c47' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, marginTop: 2, flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

export default WorkerCV