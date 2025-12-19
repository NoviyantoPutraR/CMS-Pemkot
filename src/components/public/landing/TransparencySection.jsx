import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TransparencySection() {
  const reports = [
    {
      title: 'Rencana Kerja Pemerintah Daerah (RKPD) Jatim Tahun 2024 - Part 1-4',
      description: 'Dokumen perencanaan pembangunan tahunan',
    },
    {
      title: 'Pergub Penjabaran Perubahan APBD Provinsi Jawa Timur Tahun 2024',
      description: 'Peraturan Gubernur terkait anggaran daerah',
    },
    {
      title: 'Laporan Keuangan BUMD Provinsi Jawa Timur Tahun 2023',
      description: 'Dokumen informasi keuangan Badan Usaha Milik Daerah',
    },
    {
      title: 'Laporan Realisasi Anggaran APBD Provinsi Jawa Timur Tahun 2024',
      description: 'Dokumen realisasi anggaran pendapatan dan belanja daerah',
    },
    {
      title: 'Laporan Kinerja Instansi Pemerintah (LKIP) Tahun 2024',
      description: 'Dokumen evaluasi kinerja instansi pemerintah daerah',
    },
    {
      title: 'Laporan Pertanggungjawaban Kepala Daerah Tahun 2024',
      description: 'Dokumen pertanggungjawaban pelaksanaan tugas kepala daerah',
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)
  const trackRef = useRef(null)
  const autoSlideIntervalRef = useRef(null)
  const carouselRef = useRef(null)

  // Calculate visible cards based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      let newVisibleCards
      if (window.innerWidth >= 1024) {
        newVisibleCards = 3
      } else if (window.innerWidth >= 768) {
        newVisibleCards = 2
      } else {
        newVisibleCards = 1
      }
      
      setVisibleCards((prev) => {
        if (prev !== newVisibleCards) {
          setCurrentIndex(0)
          return newVisibleCards
        }
        return prev
      })
    }

    updateVisibleCards()
    window.addEventListener('resize', updateVisibleCards)
    return () => window.removeEventListener('resize', updateVisibleCards)
  }, [])

  // Update carousel position
  useEffect(() => {
    if (trackRef.current && trackRef.current.children.length > 0) {
      const firstCard = trackRef.current.children[0]
      const cardWidth = firstCard.offsetWidth
      const gap = 24 // gap-6 = 1.5rem = 24px
      const offset = -currentIndex * (cardWidth + gap)
      trackRef.current.style.transform = `translateX(${offset}px)`
    }
  }, [currentIndex, visibleCards])

  // Auto slide function
  const startAutoSlide = () => {
    autoSlideIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, reports.length - visibleCards)
        return (prev + 1) % (maxIndex + 1)
      })
    }, 5000)
  }

  // Reset auto slide timer
  const resetAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current)
    }
    startAutoSlide()
  }

  // Initialize auto slide
  useEffect(() => {
    startAutoSlide()
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
      }
    }
  }, [visibleCards])

  // Pause on hover
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const handleMouseEnter = () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current)
      }
    }

    const handleMouseLeave = () => {
      startAutoSlide()
    }

    carousel.addEventListener('mouseenter', handleMouseEnter)
    carousel.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      carousel.removeEventListener('mouseenter', handleMouseEnter)
      carousel.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Navigation functions
  const nextSlide = () => {
    const maxIndex = Math.max(0, reports.length - visibleCards)
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
    resetAutoSlide()
  }

  const prevSlide = () => {
    const maxIndex = Math.max(0, reports.length - visibleCards)
    setCurrentIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1))
    resetAutoSlide()
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    resetAutoSlide()
  }

  // Calculate number of indicator dots
  const maxIndex = Math.max(0, reports.length - visibleCards)
  const indicatorCount = maxIndex + 1

  return (
    <section id="transparansi" className="py-16 bg-blue-800 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-200 rounded-full blur-2xl"></div>
      </div>
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="text-white">
            <motion.h2 
              className="text-3xl font-bold mb-3"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Transparansi Laporan Pemerintah<br />
              Provinsi Jawa Timur
            </motion.h2>
            <motion.p 
              className="text-sm text-blue-100"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              Menyajikan publikasi dokumen resmi yang transparan, akurat, dan<br />
              dapat dipertanggungjawabkan kepada masyarakat dan pemegang<br />
              kepentingan lainnya.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <Link
              to="/transparansi-anggaran"
              className="fancy-button bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium relative inline-block"
            >
              Lihat Semua Laporan ↗
            </Link>
          </motion.div>
          <style>{`
            .fancy-button {
              background-image: linear-gradient(to bottom right, #3B82F6, #1E40AF);
              border: none;
              box-shadow: 0px 4px 0px #1E40AF;
              transition: all 0.2s ease-in-out;
              cursor: pointer;
            }
            .fancy-button:hover {
              transform: translateY(-2px);
              box-shadow: 0px 6px 0px #1E40AF;
            }
            .fancy-button:active {
              transform: translateY(0px);
              box-shadow: none;
              background-image: linear-gradient(to bottom right, #1E40AF, #3B82F6);
            }
            .fancy-button:before,
            .fancy-button:after {
              content: "";
              position: absolute;
              width: 0;
              height: 0;
            }
            .fancy-button:before {
              top: -3px;
              left: -3px;
              border-radius: 40px;
              border-top: 3px solid #fff;
              border-left: 3px solid #fff;
            }
            .fancy-button:after {
              bottom: -3px;
              right: -3px;
              border-radius: 40px;
              border-bottom: 3px solid #fff;
              border-right: 3px solid #fff;
            }
          `}</style>
        </div>

        {/* Carousel Container */}
        <div className="relative" ref={carouselRef}>
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 z-10 w-12 h-12 rounded-full bg-[#FACC15] shadow-md flex items-center justify-center text-gray-800 hover:bg-[#FFD83F] active:bg-[#FFD83F] transition-all duration-300"
          >
            <ChevronLeft className="text-xl" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 z-10 w-12 h-12 rounded-full bg-[#FACC15] shadow-md flex items-center justify-center text-gray-800 hover:bg-[#FFD83F] active:bg-[#FFD83F] transition-all duration-300"
          >
            <ChevronRight className="text-xl" />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden relative py-2">
            <div
              ref={trackRef}
              className="flex gap-6 transition-transform duration-500 ease-in-out"
            >
          {reports.map((report, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    ease: "easeOut", 
                    delay: index * 0.1 
                  }}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full border border-gray-100 flex flex-col transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
                    <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600">📄</span>
                </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-3">{report.title}</h3>
                  <p className="text-xs text-gray-600">{report.description}</p>
                </div>
              </div>
                      <div className="flex items-center space-x-2 text-xs text-blue-800 mt-auto">
                <Download className="w-4 h-4" />
                <span>Unduh Dokumen</span>
              </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          {indicatorCount > 1 && (
            <div className="flex justify-center mt-6 space-x-3">
              {Array.from({ length: indicatorCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

