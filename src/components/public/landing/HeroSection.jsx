import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GalleryContainer from './Gallery'
import SearchAutocomplete from '../SearchAutocomplete'

export default function HeroSection({ heroData = { nama_situs: '', deskripsi_situs: '' }, loading = false }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const photos = [
    {
      id: '1',
      actor: 'Jawa Timur',
      color: '#333',
      urls: {
        full: '/jatim.jpg',
        regular: '/jatim.jpg',
        small: '/jatim.jpg',
        thumbnail: '/jatim.jpg'
      },
      width: 1600,
      height: 900
    },
    {
      id: '2',
      actor: 'Gunung Bromo',
      color: '#333',
      urls: {
        full: '/bromo.jpg',
        regular: '/bromo.jpg',
        small: '/bromo.jpg',
        thumbnail: '/bromo.jpg'
      },
      width: 1600,
      height: 900
    },
    {
      id: '3',
      actor: 'Pulau Bawean',
      color: '#333',
      urls: {
        full: '/PulauBawean.jpg',
        regular: '/PulauBawean.jpg',
        small: '/PulauBawean.jpg',
        thumbnail: '/PulauBawean.jpg'
      },
      width: 600,
      height: 800
    },
    {
      id: '4',
      actor: 'Pantai Jonggring Saloko',
      color: '#333',
      urls: {
        full: '/pantai.jpg',
        regular: '/pantai.jpg',
        small: '/pantai.jpg',
        thumbnail: '/pantai.jpg'
      },
      width: 1600,
      height: 900
    }
  ]

  return (
    <section id="hero" className="relative pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center rounded-lg p-8 bg-white shadow-lg">
          {/* Hero Content */}
          <div className="text-gray-900">
            <motion.p 
              className="font-poppins text-lg font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Selamat Datang Di
            </motion.p>
            {loading ? (
              <>
                <div className="h-12 lg:h-16 bg-gray-200 rounded-lg mb-4 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded-lg mb-6 animate-pulse" />
              </>
            ) : (
              <>
                {heroData.nama_situs && (
                  <motion.h2 
                    className="font-poppins text-4xl lg:text-5xl font-bold mb-4 leading-tight text-black"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  >
                    {heroData.nama_situs.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < heroData.nama_situs.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </motion.h2>
                )}
                {heroData.deskripsi_situs && (
                  <motion.p 
                    className="font-poppins text-base mb-6 text-gray-800 sm:text-gray-600"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  >
                    {heroData.deskripsi_situs.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < heroData.deskripsi_situs.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </motion.p>
                )}
              </>
            )}
            
            {/* Search Box */}
            <motion.div 
              className="relative w-full max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                  }
                }}
                className="relative"
              >
                <SearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
                  placeholder="Apa yang Anda cari di Kerja Baik?"
                  className="w-full"
                  showButton={true}
                />
                <button 
                  type="submit" 
                  className="group button absolute right-2.5 top-2.5 h-9 sm:h-10 px-3 sm:px-5 text-sm sm:text-base font-medium rounded-full overflow-hidden inline-flex items-center text-[#1d1d1f] bg-[rgba(255,208,116,1)] border-2 border-[rgba(255,208,116,1)] shadow-md sm:shadow-none z-20"
                >
                  <span className="button-bg block absolute top-0 left-0 w-full h-full rounded-full overflow-hidden transition-transform duration-[1800ms] ease-[cubic-bezier(0.19,1,0.22,1)]">
                    <span className="button-bg-layers block absolute left-1/2 -translate-x-1/2 -top-[60%] aspect-square" style={{ width: 'max(200%, 10rem)' }}>
                      <span className="button-bg-layer-1 block absolute top-0 left-0 w-full h-full rounded-full bg-[rgba(163,116,255,1)] scale-0 transition-transform duration-[1300ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100"></span>
                      <span className="button-bg-layer-2 block absolute top-0 left-0 w-full h-full rounded-full bg-[rgba(23,241,209,1)] scale-0 transition-transform duration-[1300ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100" style={{ transitionDelay: '100ms' }}></span>
                      <span className="button-bg-layer-3 block absolute top-0 left-0 w-full h-full rounded-full bg-[rgba(255,208,116,1)] scale-0 transition-transform duration-[1300ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-100" style={{ transitionDelay: '200ms' }}></span>
                    </span>
                  </span>
                  <span className="button-inner relative inline-flex items-center pointer-events-none z-10">
                    <span className="button-inner-static block transition-[transform,opacity] duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] opacity-100 group-hover:opacity-0 group-hover:-translate-y-[70%]">
                      Cari Sekarang
                    </span>
                    <span className="button-inner-hover absolute top-0 left-0 block opacity-0 translate-y-[70%] transition-[transform,opacity] duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100 group-hover:translate-y-0 text-white">
                      Cari Sekarang
                    </span>
                  </span>
                </button>
              </form>
            </motion.div>
          </div>

          {/* Hero Image with Gallery Animation */}
          <div className="hidden lg:block relative h-[400px] w-full overflow-hidden rounded-lg">
            <GalleryContainer photos={photos} />
          </div>
        </div>
      </div>
    </section>
  )
}

