import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'
  const [isOpen, setIsOpen] = useState(false)
  const [profilDropdownOpen, setProfilDropdownOpen] = useState(false)
  const [beritaDropdownOpen, setBeritaDropdownOpen] = useState(false)

  // Scroll to hero when hash is present
  useEffect(() => {
    if (location.pathname === '/' && (location.hash === '#hero' || window.location.hash === '#hero')) {
      setTimeout(() => {
        const element = document.getElementById('hero')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [location])

  const handleVisiMisiClick = (e) => {
    if (isHomePage) {
      e.preventDefault()
      const element = document.getElementById('visi-misi')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleBeritaClick = (e) => {
    if (isHomePage) {
      e.preventDefault()
      const element = document.getElementById('berita')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleTransparansiClick = (e) => {
    if (isHomePage) {
      e.preventDefault()
      const element = document.getElementById('transparansi')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleHeroClick = (e) => {
    if (isHomePage) {
      e.preventDefault()
      // Scroll langsung ke hero
      const element = document.getElementById('hero')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // Set flag untuk memberitahu Home component bahwa ini navigasi dari halaman lain
      sessionStorage.setItem('navigateToHome', 'true')
      // Link akan handle navigasi ke "/"
    }
  }

  return (
    <>
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-lg shadow-black/5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        
        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/"
              onClick={handleHeroClick}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <img src="https://plus.unsplash.com/premium_vector-1689096818551-edb79a6fa3da?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Logo" className="w-10 h-10 rounded-lg" />
              <div>
                <h1 className="text-lg font-bold text-black mb-0">
                  Portal Resmi JatimProv
                </h1>
                <p className="text-xs text-black mb-0">Jatim Bangkit, Tanpa Mendu</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div 
                className="relative group"
                onMouseEnter={() => setProfilDropdownOpen(true)}
                onMouseLeave={() => setProfilDropdownOpen(false)}
              >
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative flex items-center gap-1">
                  Profil
                  <ChevronDown className="w-3 h-3" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <div className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] ${profilDropdownOpen ? 'block' : 'hidden'} md:block md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300`}>
                  <ul className="py-2">
                    <li>
                      <Link 
                        to="/visi-misi" 
                        onClick={handleVisiMisiClick}
                        className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      >
                        Visi Misi
                      </Link>
                    </li>
                    <li>
                      <Link to="/tentang" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                        Tentang Kami
                      </Link>
                    </li>
                    <li>
                      <Link to="/perangkat-daerah" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                        Perangkat Daerah
                      </Link>
                    </li>
                    <li>
                      <Link to="/wisata" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                        Wisata
                      </Link>
                    </li>
                    <li>
                      <Link to="/video" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                        Video
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <Link to="/layanan" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                Layanan Publik
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div 
                className="relative group"
                onMouseEnter={() => setBeritaDropdownOpen(true)}
                onMouseLeave={() => setBeritaDropdownOpen(false)}
              >
                <a href="#berita" onClick={handleBeritaClick} className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative flex items-center gap-1">
                  Berita
                  <ChevronDown className="w-3 h-3" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <div className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] ${beritaDropdownOpen ? 'block' : 'hidden'} md:block md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300`}>
                  <ul className="py-2">
                    <li>
                      {isHomePage ? (
                        <a 
                          href="#berita" 
                          onClick={handleBeritaClick}
                          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                        >
                          Berita
                        </a>
                      ) : (
                        <Link to="/berita" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                          Berita
                        </Link>
                      )}
                    </li>
                    <li>
                      <Link to="/agenda" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                        Agenda Kota
                      </Link>
                    </li>
                    <li>
                      <Link to="/pengumuman" className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                        Pengumuman
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {isHomePage ? (
                <a 
                  href="#transparansi" 
                  onClick={handleTransparansiClick}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                >
                  Transparansi
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ) : (
                <Link to="/transparansi-anggaran" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                  Transparansi
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}
              <Link to="/sosial-media" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                Sosial Media
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              id="mobile-menu-btn"
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div id="mobile-menu" className={`md:hidden ${isOpen ? 'block' : 'hidden'} absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg animate-slide-down`}>
            <div className="px-4 py-6 space-y-4">
              <div>
                <a 
                  href="#" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200 flex items-center gap-1"
                  onClick={(e) => {
                    e.preventDefault()
                    setProfilDropdownOpen(!profilDropdownOpen)
                  }}
                >
                  Profil
                  <ChevronDown className="w-3 h-3" />
                </a>
                {profilDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link 
                      to="/visi-misi" 
                      onClick={handleVisiMisiClick}
                      className="block text-gray-600 hover:text-blue-600 py-1 transition-colors"
                    >
                      Visi Misi
                    </Link>
                    <Link to="/tentang" className="block text-gray-600 hover:text-blue-600 py-1 transition-colors">
                      Tentang Kami
                    </Link>
                    <Link to="/perangkat-daerah" className="block text-gray-600 hover:text-blue-600 py-1 transition-colors">
                      Perangkat Daerah
                    </Link>
                    <Link to="/wisata" className="block text-gray-600 hover:text-blue-600 py-1 transition-colors">
                      Wisata
                    </Link>
                    <Link to="/video" className="block text-gray-600 hover:text-blue-600 py-1 transition-colors">
                      Video
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/layanan" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200">Layanan Publik</Link>
              <div>
                <a 
                  href="#berita" 
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200 flex items-center gap-1"
                  onClick={(e) => {
                    if (isHomePage) {
                      e.preventDefault()
                      handleBeritaClick(e)
                    } else {
                      e.preventDefault()
                      setBeritaDropdownOpen(!beritaDropdownOpen)
                    }
                  }}
                >
                  Berita
                  <ChevronDown className="w-3 h-3" />
                </a>
                {beritaDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    {isHomePage ? (
                      <a 
                        href="#berita" 
                        onClick={handleBeritaClick}
                        className="block text-gray-600 hover:text-blue-600 py-1 transition-colors"
                      >
                        Berita
                      </a>
                    ) : (
                      <Link to="/berita" className="block text-gray-600 hover:text-blue-600 py-1 transition-colors">
                        Berita
                      </Link>
                    )}
                    <Link to="/agenda" className="block text-gray-600 hover:text-blue-600 py-1 transition-colors">
                      Agenda Kota
                    </Link>
                    <Link to="/pengumuman" className="block text-gray-600 hover:text-blue-600 py-1 transition-colors">
                      Pengumuman
                    </Link>
                  </div>
                )}
              </div>
              {isHomePage ? (
                <a 
                  href="#transparansi" 
                  onClick={handleTransparansiClick}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
                >
                  Transparansi
                </a>
              ) : (
                <Link to="/transparansi-anggaran" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200">Transparansi</Link>
              )}
              <Link to="/sosial-media" className="block text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200">Sosial Media</Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

