import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-2">
      {/* Logo con nombre animado */}
      <Link to="/" className="flex items-center gap-2 group">
        <img
          src="/src/assets/logo.svg"
          alt="Edifex"
          className="w-28 h-28 object-contain"
        />
        <span
          className="text-white font-bold text-2xl tracking-widest uppercase overflow-hidden"
          style={{
            animation: 'slideIn 0.8s ease-out both',
          }}
        >
          Edifex
        </span>
      </Link>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Links */}
      <div className="hidden md:flex items-center gap-7">
        <a href="#" className="text-white/75 text-sm hover:text-white transition-colors">Marketplace</a>
        <a href="#" className="text-white/75 text-sm hover:text-white transition-colors">Para operarios</a>
        <a href="#" className="text-white/75 text-sm hover:text-white transition-colors">Cómo funciona</a>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button className="text-white/75 text-sm hover:text-white transition-colors">
          Ingresar
        </button>
        <button className="bg-white text-[#1A2F1A] text-sm font-medium px-5 py-2 rounded-full hover:bg-white/90 transition-colors">
          Registrarse
        </button>
      </div>
    </nav>
  )
}

export default Navbar