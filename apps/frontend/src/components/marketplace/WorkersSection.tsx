import { useState, useEffect } from 'react'
import WorkerCard from './WorkerCard'
import { workerService } from '../../services/workerService'

const categories = ['Todos', 'Electricidad', 'Plomería', 'Albañilería', 'Carpintería', 'Pintura', 'Techado']

const categoryMap: Record<string, string> = {
  'Electricidad': 'electrical',
  'Plomería': 'plumbing',
  'Albañilería': 'masonry',
  'Carpintería': 'carpentry',
  'Pintura': 'painting',
  'Techado': 'roofing',
}

function WorkersSection() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true)
        const category = activeCategory !== 'Todos' ? categoryMap[activeCategory] : undefined
        const data = await workerService.getWorkers({ category })
        setWorkers(data.data || [])
      } catch (error) {
        console.error('Error cargando operarios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [activeCategory])

  return (
    <div className="px-10 py-10">
      {/* Header */}
      <div className="flex justify-between items-end mb-5">
        <div>
          <h2 className="text-2xl font-medium text-[#1A2F1A]">Operarios destacados</h2>
          <p className="text-sm text-gray-400 mt-1">Profesionales verificados disponibles ahora mismo</p>
        </div>
        <a href="#" className="text-sm text-[#1A2F1A] border-b border-[#1A2F1A] pb-0.5 hover:opacity-70 transition-opacity">
          Ver todos
        </a>
      </div>

      {/* Categorías */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm px-4 py-2 rounded-full border transition-all ${
              activeCategory === cat
                ? 'bg-[#1A2F1A] text-white border-[#1A2F1A]'
                : 'bg-transparent text-gray-500 border-[#D4CEBC] hover:border-[#1A2F1A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-[#E8E4DA]" />
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {!loading && workers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No hay operarios disponibles en esta categoría aún.</p>
          <p className="text-gray-300 text-xs mt-1">Sé el primero en registrarte como operario.</p>
        </div>
      )}

      {/* Grid */}
      {!loading && workers.length > 0 && (
        <div className="grid grid-cols-3 gap-5">
          {workers.map((worker) => (
            <WorkerCard
              key={worker.id}
              name={worker.user?.name || 'Operario'}
              role={worker.categories?.[0] || 'Construcción'}
              rating={parseFloat(worker.rating) || 0}
              reviews={worker.total_reviews || 0}
              price={worker.hourly_rate || worker.daily_rate || 0}
              priceType={worker.hourly_rate ? 'hora' : 'día'}
              tags={worker.skills?.slice(0, 3).map((s: any) => s.name) || []}
              image={worker.user?.avatar || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80'}
              available={worker.is_available}
              topRated={parseFloat(worker.rating) >= 4.8}
              avatarColor="#1A2F1A"
              initials={worker.user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'OP'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WorkersSection