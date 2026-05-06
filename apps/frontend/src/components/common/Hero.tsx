function Hero() {
  return (
    <div className="relative h-[620px] overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src="/images/hero.jpg"
        alt="Operario de construcción"
        className="w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A190A]/85 via-[#0A190A]/50 to-[#0A190A]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A190A]/60 via-transparent to-transparent" />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-end px-16 pb-16">

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#A8D5A8] text-xs px-4 py-2 rounded-full w-fit mb-5 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-[#6FCF6F] animate-pulse" />
          Marketplace inteligente de construcción
        </div>

        <h1 className="text-white text-6xl font-medium leading-[1.05] tracking-tight max-w-2xl mb-5">
          Encuentra al operario<br />
          perfecto para tu <span className="text-[#A8D5A8]">obra</span>
        </h1>

        <p className="text-white/60 text-base max-w-lg leading-relaxed mb-8">
          IA que conecta clientes con los mejores electricistas, plomeros, albañiles y más — verificados y cerca de ti.
        </p>

        <div className="flex gap-3 mb-10">
          <button className="bg-white text-[#1A2F1A] font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-white/90 transition-all hover:scale-105">
            Publicar un trabajo
          </button>
          <button className="bg-white/10 text-white border border-white/25 text-sm px-7 py-3.5 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm">
            Soy operario →
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-10 pt-7 border-t border-white/10">
          <div>
            <div className="text-white text-2xl font-semibold">2.4K+</div>
            <div className="text-white/45 text-xs mt-1">Operarios activos</div>
          </div>
          <div>
            <div className="text-white text-2xl font-semibold">12K+</div>
            <div className="text-white/45 text-xs mt-1">Trabajos completados</div>
          </div>
          <div>
            <div className="text-white text-2xl font-semibold">4.9★</div>
            <div className="text-white/45 text-xs mt-1">Calificación promedio</div>
          </div>
          <div>
            <div className="text-white text-2xl font-semibold">98%</div>
            <div className="text-white/45 text-xs mt-1">Satisfacción</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero