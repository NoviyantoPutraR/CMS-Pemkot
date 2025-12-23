import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

// Sample news data (hardcoded for now)
const newsData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1761839257661-c2392c65ea72?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Indeks SPBE Capai 3.62, Pemprov Jatim Terus Giatkan Pelayanan Publik yang Cepat, Efisien, Berbasis Digital",
    date: "12 Februari 2025",
    link: "#"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1761839257661-c2392c65ea72?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Gubernur Khofifah Ajak Masyarakat Manfaatkan Program Konversi Sepeda Motor Listrik",
    date: "11 Februari 2025",
    link: "#"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1761839257661-c2392c65ea72?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Pemprov Jatim Luncurkan Program Digitalisasi Pelayanan Publik",
    date: "10 Februari 2025",
    link: "#"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1761839257661-c2392c65ea72?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Inovasi Teknologi untuk Meningkatkan Kualitas Hidup Masyarakat Jatim",
    date: "9 Februari 2025",
    link: "#"
  }
]

export default function HighlightNewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)
  const trackRef = useRef(null)
  const autoSlideIntervalRef = useRef(null)
  const carouselRef = useRef(null)
  const sectionRef = useRef(null)
  
  // Intersection Observer for scroll animation
  const isInView = useInView(sectionRef, { 
    once: true,
    amount: 0.2 
  })
  
  // Animation variants
  const leftPanelVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }
  
  const cardsVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" }
    }
  }

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
          setCurrentIndex(0) // Reset to first slide when screen size changes
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
      const gap = 16 // 1rem = 16px (gap-4)
      const offset = -currentIndex * (cardWidth + gap)
      trackRef.current.style.transform = `translateX(${offset}px)`
    }
  }, [currentIndex, visibleCards])

  // Auto slide function
  const startAutoSlide = () => {
    autoSlideIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, newsData.length - visibleCards)
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
    const maxIndex = Math.max(0, newsData.length - visibleCards)
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
    resetAutoSlide()
  }

  const prevSlide = () => {
    const maxIndex = Math.max(0, newsData.length - visibleCards)
    setCurrentIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1))
    resetAutoSlide()
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    resetAutoSlide()
  }

  // Calculate number of indicator dots
  const maxIndex = Math.max(0, newsData.length - visibleCards)
  const indicatorCount = maxIndex + 1

  return (
    <div id="berita" className="relative overflow-visible">
      {/* Background Pattern dengan Gradasi Bulat */}
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        <div className="relative h-full w-full [&>div]:absolute [&>div]:top-0 [&>div]:right-0 [&>div]:z-[-2] [&>div]:h-full [&>div]:w-full [&>div]:bg-gradient-to-l [&>div]:from-blue-200 [&>div]:to-white [&>div]:rounded-full [&>div]:blur-3xl">
          <div style={{ 
            width: '800px', 
            height: '800px',
            transform: 'translate(40%, -40%)',
            opacity: 0.5
          }}></div>
        </div>
      </div>
      <div className="relative z-10">
      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0.4; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        .animate-fade {
          animation: fadeIn 0.8s ease-in-out;
        }
        .testimonial-card {
          transition: all 0.5s ease;
        }
        .testimonial-card-wrapper {
          transition: all 0.5s ease;
        }
        .testimonial-card-wrapper:hover {
          transform: translateY(-5px);
        }
        .testimonial-card-wrapper:hover .card-content {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .active-dot {
          transform: scale(1.4);
          background-color: #4F46E5;
        }
        .nav-button {
          transition: all 0.3s ease;
        }
        .nav-button:hover {
          background-color: #4F46E5;
          color: white;
        }
        #testimonial-track {
          transition: transform 0.5s ease-in-out;
        }
        .news-panel-bg {
          --s: 60px;
          --c1: rgba(29, 78, 216, 0.15);
          --c2: rgba(59, 130, 246, 0.05);
          --_g: radial-gradient(
            25% 25% at 25% 25%,
            var(--c1) 99%,
            rgba(0, 0, 0, 0) 101%
          );
          background: var(--_g) var(--s) var(--s) / calc(2 * var(--s))
              calc(2 * var(--s)),
            var(--_g) 0 0 / calc(2 * var(--s)) calc(2 * var(--s)),
            radial-gradient(50% 50%, var(--c2) 98%, rgba(0, 0, 0, 0)) 0 0 / var(--s)
              var(--s),
            repeating-conic-gradient(var(--c2) 0 50%, var(--c1) 0 100%)
              calc(0.5 * var(--s)) 0 / calc(2 * var(--s)) var(--s),
            #1e40af;
        }
      `}</style>
      <div className="pt-0 relative">
        {/* Overlay gradasi smooth untuk menyambung natural */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none"></div>
        <div className="max-w-full pl-0 relative z-10">
          <div className="grid lg:grid-cols-12 gap-0 items-stretch" ref={sectionRef}>
            {/* Left Panel - Full height */}
            <motion.div 
              className="lg:col-span-3 bg-blue-700 p-6 text-white min-h-[350px] flex flex-col justify-center items-center text-center news-panel-bg"
              variants={leftPanelVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <h3 className="text-2xl font-bold mb-3">Highlight Berita Terkini</h3>
              <p className="text-sm text-blue-100 mb-4">Update Berita Seputar Provinsi Kerja Baik</p>
              <Link 
                to="/berita"
                className="inline-block bg-yellow-400 text-blue-900 px-6 py-2 rounded-full text-sm font-semibold hover:bg-yellow-300 transition-colors"
              >
                Lihat Berita Lainnya
              </Link>
            </motion.div>

            {/* Carousel Container */}
            <motion.div 
              className="lg:col-span-9 relative min-h-[350px] flex flex-col px-4 sm:px-6 lg:px-8 py-6" 
              ref={carouselRef}
              variants={cardsVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="nav-button absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-white"
              >
                <ChevronLeft className="text-xl" />
              </button>
              <button
                onClick={nextSlide}
                className="nav-button absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-white"
              >
                <ChevronRight className="text-xl" />
              </button>

              {/* Carousel Track */}
              <div className="overflow-hidden relative flex-1 py-6 px-3 pb-8">
                <div
                  id="testimonial-track"
                  ref={trackRef}
                  className="flex gap-4 h-full"
                >
                  {newsData.map((news, index) => (
                    <div
                      key={news.id}
                      className="testimonial-card testimonial-card-wrapper flex-shrink-0 w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] px-0 animate-fade"
                    >
                      <div className="card-content bg-white rounded-xl overflow-hidden shadow-lg h-full border border-gray-100 flex flex-col">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4 flex-1 flex flex-col">
                          <h4 className="font-semibold text-sm mb-2 line-clamp-3">
                            {news.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2">{news.date}</p>
                          <a
                            href={news.link}
                            className="text-xs text-blue-600 font-medium hover:text-blue-800 mt-auto"
                          >
                            Baca Selengkapnya →
                          </a>
                        </div>
                      </div>
                    </div>
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
                      className={`indicator-dot w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'active-dot bg-indigo-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

