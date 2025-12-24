import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver'
import { agendaKotaService } from '../../../services/agendaKotaService'
import { wisataService } from '../../../services/wisataService'
import { layananService } from '../../../services/layananService'
import AgendaServiceCard from './AgendaServiceCard'
import Loading from '../../shared/Loading'
import { truncate, stripHtml } from '../../../utils/formatters'
import { 
  Users, 
  Briefcase, 
  Receipt, 
  TrendingUp, 
  Archive, 
  ClipboardCheck, 
  Settings, 
  Megaphone,
  Calendar,
  Target,
  Building2,
  BarChart3,
  Globe,
  FileEdit,
  Star,
  Award,
  Mountain,
  Waves,
  Flame,
  Trees,
  Landmark,
  Snowflake
} from 'lucide-react'

export default function ServicesGrid({ activeTab }) {
  const [agendaData, setAgendaData] = useState([])
  const [agendaLoading, setAgendaLoading] = useState(false)
  const [agendaError, setAgendaError] = useState(null)
  const [wisataData, setWisataData] = useState([])
  const [wisataLoading, setWisataLoading] = useState(false)
  const [wisataError, setWisataError] = useState(null)
  const [layananData, setLayananData] = useState([])
  const [layananLoading, setLayananLoading] = useState(false)
  const [layananError, setLayananError] = useState(null)
  // Default image fallback
  const defaultWisataImage = 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  // Fetch agenda data when activeTab is 'agenda'
  useEffect(() => {
    if (activeTab === 'agenda') {
      const fetchAgenda = async () => {
        try {
          setAgendaLoading(true)
          setAgendaError(null)
          const result = await agendaKotaService.getAll({
            page: 1,
            limit: 8,
            publishedOnly: true,
            sortOrder: 'asc'
          })
          setAgendaData(result.data || [])
        } catch (error) {
          console.error('Error fetching agenda:', error)
          setAgendaError(error.message || 'Gagal memuat data agenda')
          setAgendaData([])
        } finally {
          setAgendaLoading(false)
        }
      }
      fetchAgenda()
    } else {
      // Clear agenda data when switching tabs
      setAgendaData([])
    }
  }, [activeTab])

  // Fetch wisata data when activeTab is 'wisata'
  useEffect(() => {
    if (activeTab === 'wisata') {
      const fetchWisata = async () => {
        try {
          setWisataLoading(true)
          setWisataError(null)
          const result = await wisataService.getAll({
            page: 1,
            limit: 4,
            publishedOnly: true,
            sortBy: 'terbaru'
          })
          setWisataData(result.data || [])
        } catch (error) {
          console.error('Error fetching wisata:', error)
          setWisataError(error.message || 'Gagal memuat data wisata')
          setWisataData([])
        } finally {
          setWisataLoading(false)
        }
      }
      fetchWisata()
    } else {
      // Clear wisata data when switching tabs
      setWisataData([])
    }
  }, [activeTab])

  // Fetch layanan data when activeTab is 'layanan' or default
  useEffect(() => {
    if (activeTab === 'layanan' || !activeTab || activeTab === '') {
      const fetchLayanan = async () => {
        try {
          setLayananLoading(true)
          setLayananError(null)
          const result = await layananService.getAll({
            page: 1,
            limit: 8,
            publishedOnly: true,
            sortBy: 'terbaru'
          })
          setLayananData(result.data || [])
        } catch (error) {
          console.error('Error fetching layanan:', error)
          setLayananError(error.message || 'Gagal memuat data layanan')
          setLayananData([])
        } finally {
          setLayananLoading(false)
        }
      }
      fetchLayanan()
    } else {
      // Clear layanan data when switching tabs
      setLayananData([])
    }
  }, [activeTab])

  const isWisata = activeTab === 'wisata'
  const isAgenda = activeTab === 'agenda'
  const isLayanan = activeTab === 'layanan' || !activeTab || activeTab === ''

  return (
    <div className="relative overflow-visible py-12">
      {/* Background Pattern dengan Gradasi Bulat */}
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        <div className="relative h-full w-full [&>div]:absolute [&>div]:top-0 [&>div]:left-0 [&>div]:z-[-2] [&>div]:h-full [&>div]:w-full [&>div]:bg-gradient-to-l [&>div]:from-blue-200 [&>div]:to-white [&>div]:rounded-full [&>div]:blur-3xl">
          <div style={{ 
            width: '800px', 
            height: '800px',
            transform: 'translate(-40%, -40%)',
            opacity: 0.5
          }}></div>
        </div>
      </div>
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Agenda Loading State */}
        {isAgenda && agendaLoading && (
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        )}

        {/* Agenda Error State */}
        {isAgenda && !agendaLoading && agendaError && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-2">Gagal memuat data agenda</p>
            <p className="text-gray-500 text-sm">{agendaError}</p>
          </div>
        )}

        {/* Agenda Empty State */}
        {isAgenda && !agendaLoading && !agendaError && agendaData.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Belum ada agenda tersedia</p>
            <p className="text-gray-500 text-sm mt-2">Agenda akan ditampilkan di sini setelah dipublikasikan</p>
          </div>
        )}

        {/* Agenda Grid */}
        {isAgenda && !agendaLoading && agendaData.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {agendaData.map((agenda, index) => (
              <AgendaServiceCard key={agenda.id} agenda={agenda} index={index} />
            ))}
          </div>
        )}

        {/* Wisata Loading State */}
        {isWisata && wisataLoading && (
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        )}

        {/* Wisata Error State */}
        {isWisata && !wisataLoading && wisataError && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-2">Gagal memuat data wisata</p>
            <p className="text-gray-500 text-sm">{wisataError}</p>
          </div>
        )}

        {/* Wisata Empty State */}
        {isWisata && !wisataLoading && !wisataError && wisataData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Belum ada wisata tersedia</p>
            <p className="text-gray-500 text-sm mt-2">Wisata akan ditampilkan di sini setelah dipublikasikan</p>
          </div>
        )}

        {/* Wisata Grid */}
        {isWisata && !wisataLoading && wisataData.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {wisataData.slice(0, 4).map((item, index) => (
              <Link
                key={item.id}
                to={`/wisata/${item.slug}`}
                className="group relative w-full h-[200px] bg-[#f2f2f2] rounded-[10px] flex items-center justify-center overflow-hidden cursor-pointer"
                style={{
                  perspective: '1000px',
                  boxShadow: '0 0 0 5px rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(255, 255, 255, 0.2)'
                  const content = e.currentTarget.querySelector('.card-content-wisata')
                  if (content) {
                    content.style.transform = 'rotateX(0deg)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 0 0 5px rgba(255, 255, 255, 0.5)'
                  const content = e.currentTarget.querySelector('.card-content-wisata')
                  if (content) {
                    content.style.transform = 'rotateX(-90deg)'
                  }
                }}
              >
                <img 
                  src={item.gambar_url || defaultWisataImage} 
                  alt={item.nama}
                  width={400}
                  height={300}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultWisataImage
                  }}
                />
                <div 
                  className="card-content-wisata absolute top-0 left-0 w-full h-full p-5 bg-white box-border z-10"
                  style={{
                    transform: 'rotateX(-90deg)',
                    transformOrigin: 'bottom',
                    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <p className="m-0 text-2xl text-[#333] font-bold line-clamp-2">{item.nama}</p>
                  <p className="mt-2.5 text-sm text-[#777] leading-[1.4] line-clamp-4">{truncate(item.deskripsi || '', 150)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Layanan Loading State */}
        {isLayanan && layananLoading && (
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        )}

        {/* Layanan Error State */}
        {isLayanan && !layananLoading && layananError && (
          <div className="text-center py-20">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">Gagal memuat data layanan</p>
            <p className="text-gray-500 text-sm">{layananError}</p>
          </div>
        )}

        {/* Layanan Empty State */}
        {isLayanan && !layananLoading && !layananError && layananData.length === 0 && (
          <div className="text-center py-20">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Belum ada layanan tersedia</p>
            <p className="text-gray-500 text-sm mt-2">Layanan akan ditampilkan di sini setelah dipublikasikan</p>
          </div>
        )}

        {/* Layanan Grid */}
        {isLayanan && !layananLoading && layananData.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {layananData.map((layanan, index) => (
              <ServiceCard key={layanan.id} layanan={layanan} index={index} />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

function ServiceCard({ layanan, index }) {
  const [cardRef, isVisible] = useIntersectionObserver()
  const [iconError, setIconError] = useState(false)
  
  // Get description from meta_description or strip HTML from konten
  const description = layanan.meta_description 
    ? truncate(layanan.meta_description, 100)
    : truncate(stripHtml(layanan.konten || ''), 100)
  
  // Gradient colors for icon background (rotating based on index)
  const gradientColors = [
    'from-blue-500/10 via-blue-400/10 to-cyan-500/10',
    'from-emerald-500/10 via-green-400/10 to-teal-500/10',
    'from-purple-500/10 via-pink-400/10 to-rose-500/10',
    'from-amber-500/10 via-orange-400/10 to-yellow-500/10',
    'from-indigo-500/10 via-blue-400/10 to-purple-500/10',
    'from-red-500/10 via-rose-400/10 to-pink-500/10',
    'from-cyan-500/10 via-blue-400/10 to-indigo-500/10',
    'from-green-500/10 via-emerald-400/10 to-teal-500/10',
  ]
  const gradientClass = gradientColors[index % gradientColors.length]
  
  // Default icon fallback
  const DefaultIcon = Settings

  // Get navigation link
  const linkTo = layanan.slug ? `/layanan/${layanan.slug}` : `/layanan/${layanan.id}`
  
  // Determine if we should show icon image or fallback
  const showIconImage = layanan.icon_url && !iconError

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <Link
        to={linkTo}
        className="group relative block w-full aspect-[160/192] rounded-[20px] overflow-hidden"
      >
        {/* Card Container with Premium Design */}
        <div className="relative h-full w-full bg-gradient-to-br from-white via-gray-50/50 to-white border border-gray-200/60 backdrop-blur-sm transition-all duration-500 ease-out hover:border-blue-300/60 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
          {/* Gradient Overlay on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          {/* Content Container */}
          <div className="relative h-full flex flex-col items-center justify-center text-center p-6 z-10">
            {/* Icon Container */}
            <motion.div
              className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-500`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {showIconImage ? (
                <img
                  src={layanan.icon_url}
                  alt={layanan.judul}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="w-10 h-10 object-contain"
                  onError={() => setIconError(true)}
                />
              ) : (
                <DefaultIcon className="w-8 h-8 text-gray-700" />
              )}
            </motion.div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {layanan.judul}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
              {description || 'Tidak ada deskripsi tersedia'}
            </p>
          </div>

          {/* Button - Slide Up on Hover */}
          <motion.div
            className="absolute left-1/2 bottom-0 w-[70%] -translate-x-1/2 z-20"
            initial={{ y: '100%', opacity: 0 }}
            whileHover={{ y: '50%', opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              Selengkapnya
            </div>
          </motion.div>

          {/* Shine Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </div>
      </Link>
    </motion.div>
  )
}

