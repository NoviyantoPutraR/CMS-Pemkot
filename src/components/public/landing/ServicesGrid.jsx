import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver'
import { agendaKotaService } from '../../../services/agendaKotaService'
import { wisataService } from '../../../services/wisataService'
import AgendaServiceCard from './AgendaServiceCard'
import Loading from '../../shared/Loading'
import { truncate } from '../../../utils/formatters'
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

  const allData = {
    layanan: [
    {
      icon: Users,
      title: 'Layanan Kependudukan',
      description: 'Layanan informasi seputar kepedudukan administrasi',
      bgColor: 'bg-red-100',
    },
    {
      icon: Briefcase,
      title: 'Bursa Kerja',
      description: 'Layanan informasi seputar lowongan pekerjaan yang sedang dibuka',
      bgColor: 'bg-green-100',
    },
    {
      icon: Receipt,
      title: 'E-Samsat',
      description: 'Layanan informasi tentang elektronik samsat kendaraan bermotor',
      bgColor: 'bg-blue-100',
    },
    {
      icon: TrendingUp,
      title: 'Investasi',
      description: 'Layanan Untuk potensi investasi Penanaman Modal Bidang Bisnis Investasi',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Archive,
      title: 'Kearsiapan',
      description: 'Informasi dokumen arsip untuk persiapan dalam menjaring kesempatan',
      bgColor: 'bg-red-100',
    },
    {
      icon: ClipboardCheck,
      title: 'Perijinan',
      description: 'Layanan informasi seputar persetujuan perijinan yang berdedak diprivatskan',
      bgColor: 'bg-green-100',
    },
    {
      icon: Settings,
      title: 'LPSE Jatim',
      description: 'Layanan informasi tentang Elektronik Pengaduan Barang',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Megaphone,
      title: 'Pengaduan',
      description: 'Layanan pengaduan keluhan untuk penyuluhan dari pengaduan',
      bgColor: 'bg-yellow-100',
    },
    ],
    wisata: [
      {
        icon: Mountain,
        title: 'Gunung Bromo',
        description: 'Destinasi wisata alam dengan pemandangan sunrise yang menakjubkan',
        bgColor: 'bg-amber-100',
      },
      {
        icon: Waves,
        title: 'Pantai Pasir Putih',
        description: 'Pantai dengan pasir putih dan air laut yang jernih di Malang',
        bgColor: 'bg-cyan-100',
      },
      {
        icon: Building2,
        title: 'Candi Penataran',
        description: 'Candi Hindu terbesar di Jawa Timur dengan arsitektur yang megah',
        bgColor: 'bg-stone-100',
      },
      {
        icon: Flame,
        title: 'Kawah Ijen',
        description: 'Wisata alam dengan blue fire dan danau kawah yang unik',
        bgColor: 'bg-emerald-100',
      },
      {
        icon: Trees,
        title: 'Taman Nasional Baluran',
        description: 'Taman nasional dengan savana dan satwa liar endemik',
        bgColor: 'bg-lime-100',
      },
      {
        icon: Landmark,
        title: 'Kota Tua Surabaya',
        description: 'Wisata sejarah dengan bangunan kolonial yang bersejarah',
        bgColor: 'bg-rose-100',
      },
      {
        icon: Waves,
        title: 'Air Terjun Tumpak Sewu',
        description: 'Air terjun dengan pemandangan yang spektakuler di Lumajang',
        bgColor: 'bg-sky-100',
      },
      {
        icon: Snowflake,
        title: 'Gumuk Pasir Parangtritis',
        description: 'Gumuk pasir unik yang menjadi ikon wisata Banyuwangi',
        bgColor: 'bg-yellow-100',
      },
    ],
  }

  const currentData = allData[activeTab] || allData.layanan
  const isWisata = activeTab === 'wisata'
  const isAgenda = activeTab === 'agenda'
  const displayData = isWisata ? currentData.slice(0, 4) : currentData

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

        {/* Other Tabs Grid */}
        {!isAgenda && !isWisata && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayData.map((item, index) => (
              <ServiceCard key={index} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

function ServiceCard({ item, index }) {
  const [cardRef, isVisible] = useIntersectionObserver()

  return (
    <div 
      ref={cardRef}
      className="group relative w-full aspect-[160/192] rounded-[20px] bg-[#f5f5f5] p-5 border-2 border-[#c3c6ce] transition-all duration-500 ease-out overflow-visible hover:border-[#008bf8] hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)]"
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(10px)',
        transition: 'opacity 0.65s ease-out, filter 0.65s ease-out',
      }}
    >
      <div className="text-black h-full flex flex-col gap-1.5 justify-center items-center text-center">
        <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center mb-1.5`}>
          {item.icon && <item.icon className="w-6 h-6 text-gray-700" />}
        </div>
        <p className="text-lg font-bold">{item.title}</p>
        <p className="text-xs text-[rgb(134,134,134)]">{item.description}</p>
      </div>
      <button className="absolute left-1/2 bottom-0 w-[60%] rounded-2xl border-none bg-[#008bf8] text-white text-sm py-1.5 px-3 transition-all duration-300 ease-out translate-x-[-50%] translate-y-[125%] opacity-0 group-hover:translate-y-[50%] group-hover:opacity-100">
        Selengkapnya
      </button>
    </div>
  )
}

