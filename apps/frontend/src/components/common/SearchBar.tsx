function SearchBar() {
  return (
    <div className="mx-10 -mt-7 relative z-10">
      <div className="bg-white rounded-2xl shadow-lg border border-[#E8E4DA] flex items-center gap-4 px-6 py-4">
        
        {/* Qué necesitas */}
        <div className="flex flex-col flex-1">
          <span className="text-xs text-gray-400 mb-1">¿Qué necesitas?</span>
          <input
            type="text"
            placeholder="Electricista, plomero, pintor..."
            className="outline-none text-sm text-[#1A2F1A] bg-transparent placeholder-gray-300"
          />
        </div>

        <div className="w-px h-8 bg-[#E8E4DA]" />

        {/* Dónde */}
        <div className="flex flex-col flex-1">
          <span className="text-xs text-gray-400 mb-1">¿Dónde?</span>
          <input
            type="text"
            placeholder="Ciudad o barrio..."
            className="outline-none text-sm text-[#1A2F1A] bg-transparent placeholder-gray-300"
          />
        </div>

        <div className="w-px h-8 bg-[#E8E4DA]" />

        {/* Disponibilidad */}
        <div className="flex flex-col flex-1">
          <span className="text-xs text-gray-400 mb-1">Disponibilidad</span>
          <input
            type="text"
            placeholder="Cuando necesites..."
            className="outline-none text-sm text-[#1A2F1A] bg-transparent placeholder-gray-300"
          />
        </div>

        {/* Botón */}
        <button className="bg-[#1A2F1A] text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#2D4A2D] transition-colors whitespace-nowrap">
          Buscar operario
        </button>

      </div>
    </div>
  )
}

export default SearchBar