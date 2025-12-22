import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GalleryContainer from './Gallery'
import { pengaturanSitusService } from '../../../services/pengaturanSitusService'

export default function HeroSection() {
  const [heroData, setHeroData] = useState({
    nama_situs: '',
    deskripsi_situs: '',
  })

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const data = await pengaturanSitusService.getHeroData()
        setHeroData(data)
      } catch (error) {
        console.error('Error loading hero data:', error)
      }
    }
    loadHeroData()
  }, [])
  const photos = [
    {
      id: '1',
      actor: 'Jawa Timur',
      color: '#333',
      urls: {
        full: 'https://images.unsplash.com/photo-1764418658842-997924ee31cc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        regular: 'https://images.unsplash.com/photo-1764418658842-997924ee31cc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        small: 'https://images.unsplash.com/photo-1764418658842-997924ee31cc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        thumbnail: 'https://images.unsplash.com/photo-1764418658842-997924ee31cc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      width: 1170,
      height: 780
    },
    {
      id: '2',
      actor: 'Gunung Bromo',
      color: '#333',
      urls: {
        full: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        regular: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        small: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        thumbnail: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      width: 1175,
      height: 784
    },
    {
      id: '3',
      actor: 'Tumpak Sewu',
      color: '#333',
      urls: {
        full: 'https://images.unsplash.com/photo-1532081192133-b6d660228cc4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        regular: 'https://images.unsplash.com/photo-1532081192133-b6d660228cc4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        small: 'https://images.unsplash.com/photo-1532081192133-b6d660228cc4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        thumbnail: 'https://images.unsplash.com/photo-1532081192133-b6d660228cc4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      width: 687,
      height: 1030
    },
    {
      id: '4',
      actor: 'Monumen Kota Malang',
      color: '#333',
      urls: {
        full: 'https://images.unsplash.com/photo-1672557680301-095dfa1b223e?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        regular: 'https://images.unsplash.com/photo-1672557680301-095dfa1b223e?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        small: 'https://images.unsplash.com/photo-1672557680301-095dfa1b223e?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        thumbnail: 'https://images.unsplash.com/photo-1672557680301-095dfa1b223e?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      width: 1173,
      height: 782
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
                className="font-poppins text-base mb-6 text-gray-600"
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
            
            {/* Search Box */}
            <motion.div 
              className="group relative w-full max-w-lg bg-white rounded-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 fill-[#9e9ea7] z-10" 
                aria-hidden="true" 
                viewBox="0 0 24 24"
              >
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
              <input 
                type="text" 
                name="query" 
                id="query"
                placeholder="Apa yang Anda cari di Jawa Timur?" 
                className="rounded-full w-full h-14 bg-[#f3f3f4] py-2 pl-10 pr-28 outline-none border-2 border-transparent transition-all duration-300 ease-in-out placeholder:text-[#9e9ea7] hover:bg-white hover:border-[#2563EB] hover:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] focus:bg-white focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]" 
              />
              <button 
                type="submit" 
                className="group button absolute right-2.5 top-2.5 h-9 sm:h-10 px-3 sm:px-5 text-sm sm:text-base font-medium rounded-full overflow-hidden inline-flex items-center text-[#1d1d1f] bg-[rgba(255,208,116,1)] border-2 border-[rgba(255,208,116,1)]"
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

