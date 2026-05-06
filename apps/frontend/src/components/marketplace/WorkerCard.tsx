interface WorkerCardProps {
  name: string
  role: string
  rating: number
  reviews: number
  price: number
  priceType: string
  tags: string[]
  image: string
  available: boolean
  topRated?: boolean
  avatarColor: string
  initials: string
}

function WorkerCard({
  name, role, rating, reviews, price, priceType,
  tags, image, available, topRated, avatarColor, initials
}: WorkerCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E4DA] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group">

      {/* Imagen */}
      <div className="h-44 overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          {topRated ? (
            <span className="bg-[#A8D5A8] text-[#1A2F1A] text-xs px-3 py-1 rounded-full font-medium">
              Top rated
            </span>
          ) : available ? (
            <span className="bg-[#1A2F1A] text-[#A8D5A8] text-xs px-3 py-1 rounded-full">
              Disponible
            </span>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
            style={{ background: avatarColor }}
          >
            {initials}
          </div>
          <div>
            <div className="text-sm font-medium text-[#1A2F1A]">{name}</div>
            <div className="text-xs text-gray-400">{role}</div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-[#1A2F1A] text-sm">{'★'.repeat(Math.floor(rating))}</span>
          <span className="text-gray-300 text-sm">{'★'.repeat(5 - Math.floor(rating))}</span>
          <span className="text-xs text-gray-400 ml-1">{rating} ({reviews} reseñas)</span>
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 bg-[#F5F2ED] text-gray-500 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#F0EBE0] flex justify-between items-center">
        <div className="text-sm font-medium text-[#1A2F1A]">
          ${price.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ {priceType}</span>
        </div>
        <button className="bg-[#1A2F1A] text-white text-xs px-4 py-2 rounded-full hover:bg-[#2D4A2D] transition-colors">
          Contratar
        </button>
      </div>
    </div>
  )
}

export default WorkerCard