import api from './api'

export const workerService = {
  // Obtener todos los operarios activos
  getWorkers: async (params?: { category?: string; city?: string }) => {
    const response = await api.get('/workers', { params })
    return response.data
  },

  // Obtener perfil de un operario
  getWorkerProfile: async (id: number) => {
    const response = await api.get(`/workers/${id}`)
    return response.data
  },

  // Actualizar perfil del operario autenticado
  updateProfile: async (data: object) => {
    const response = await api.post('/worker/profile', data)
    return response.data
  },

  // Agregar skill
  addSkill: async (data: { name: string; category?: string; years_experience?: number }) => {
    const response = await api.post('/worker/skills', data)
    return response.data
  },

  // Agregar certificación
  addCertification: async (data: { name: string; issuer?: string; year?: number }) => {
    const response = await api.post('/worker/certifications', data)
    return response.data
  },

  // Subir CV
  uploadCV: async (file: File) => {
    const formData = new FormData()
    formData.append('cv', file)
    const response = await api.post('/worker/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}