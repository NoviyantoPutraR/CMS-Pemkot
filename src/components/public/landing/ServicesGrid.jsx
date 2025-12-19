import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver'

export default function ServicesGrid({ activeTab }) {
  // Photos from HeroSection
  const heroPhotos = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1764418658842-997924ee31cc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Jawa Timur'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Gunung Bromo'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1532081192133-b6d660228cc4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Tumpak Sewu'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1672557680301-095dfa1b223e?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Monumen Kota Malang'
    }
  ]

  const allData = {
    layanan: [
    {
      icon: '👥',
      title: 'Layanan Kependudukan',
      description: 'Layanan informasi seputar kepedudukan administrasi',
      bgColor: 'bg-red-100',
    },
    {
      icon: '💼',
      title: 'Bursa Kerja',
      description: 'Layanan informasi seputar lowongan pekerjaan yang sedang dibuka',
      bgColor: 'bg-green-100',
    },
    {
      icon: '📄',
      title: 'E-Samsat',
      description: 'Layanan informasi tentang elektronik samsat kendaraan bermotor',
      bgColor: 'bg-blue-100',
    },
    {
      icon: '💰',
      title: 'Investasi',
      description: 'Layanan Untuk potensi investasi Penanaman Modal Bidang Bisnis Investasi',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: '🏥',
      title: 'Kearsiapan',
      description: 'Informasi dokumen arsip untuk persiapan dalam menjaring kesempatan',
      bgColor: 'bg-red-100',
    },
    {
      icon: '📋',
      title: 'Perijinan',
      description: 'Layanan informasi seputar persetujuan perijinan yang berdedak diprivatskan',
      bgColor: 'bg-green-100',
    },
    {
      icon: '🔧',
      title: 'LPSE Jatim',
      description: 'Layanan informasi tentang Elektronik Pengaduan Barang',
      bgColor: 'bg-blue-100',
    },
    {
      icon: '📢',
      title: 'Pengaduan',
      description: 'Layanan pengaduan keluhan untuk penyuluhan dari pengaduan',
      bgColor: 'bg-yellow-100',
    },
    ],
    agenda: [
      {
        icon: '📅',
        title: 'Rapat Koordinasi',
        description: 'Agenda rapat koordinasi antar dinas untuk pembahasan program kerja',
        bgColor: 'bg-blue-100',
      },
      {
        icon: '🎯',
        title: 'Pelatihan SDM',
        description: 'Program pelatihan sumber daya manusia untuk meningkatkan kompetensi',
        bgColor: 'bg-purple-100',
      },
      {
        icon: '🏛️',
        title: 'Sidang Paripurna',
        description: 'Agenda sidang paripurna DPRD Provinsi Jawa Timur',
        bgColor: 'bg-indigo-100',
      },
      {
        icon: '📊',
        title: 'Evaluasi Program',
        description: 'Kegiatan evaluasi program pembangunan daerah',
        bgColor: 'bg-cyan-100',
      },
      {
        icon: '🤝',
        title: 'Kunjungan Kerja',
        description: 'Agenda kunjungan kerja ke berbagai daerah di Jawa Timur',
        bgColor: 'bg-teal-100',
      },
      {
        icon: '📝',
        title: 'Workshop Digital',
        description: 'Workshop peningkatan kapasitas digitalisasi pelayanan publik',
        bgColor: 'bg-pink-100',
      },
      {
        icon: '🎪',
        title: 'Festival Budaya',
        description: 'Agenda festival budaya Jawa Timur tahunan',
        bgColor: 'bg-orange-100',
      },
      {
        icon: '🏆',
        title: 'Penghargaan',
        description: 'Acara penganugerahan penghargaan kepada pegawai berprestasi',
        bgColor: 'bg-amber-100',
      },
    ],
    wisata: [
      {
        icon: '🏔️',
        title: 'Gunung Bromo',
        description: 'Destinasi wisata alam dengan pemandangan sunrise yang menakjubkan',
        bgColor: 'bg-amber-100',
      },
      {
        icon: '🏖️',
        title: 'Pantai Pasir Putih',
        description: 'Pantai dengan pasir putih dan air laut yang jernih di Malang',
        bgColor: 'bg-cyan-100',
      },
      {
        icon: '🏛️',
        title: 'Candi Penataran',
        description: 'Candi Hindu terbesar di Jawa Timur dengan arsitektur yang megah',
        bgColor: 'bg-stone-100',
      },
      {
        icon: '🌋',
        title: 'Kawah Ijen',
        description: 'Wisata alam dengan blue fire dan danau kawah yang unik',
        bgColor: 'bg-emerald-100',
      },
      {
        icon: '🏞️',
        title: 'Taman Nasional Baluran',
        description: 'Taman nasional dengan savana dan satwa liar endemik',
        bgColor: 'bg-lime-100',
      },
      {
        icon: '🏯',
        title: 'Kota Tua Surabaya',
        description: 'Wisata sejarah dengan bangunan kolonial yang bersejarah',
        bgColor: 'bg-rose-100',
      },
      {
        icon: '🌊',
        title: 'Air Terjun Tumpak Sewu',
        description: 'Air terjun dengan pemandangan yang spektakuler di Lumajang',
        bgColor: 'bg-sky-100',
      },
      {
        icon: '🏜️',
        title: 'Gumuk Pasir Parangtritis',
        description: 'Gumuk pasir unik yang menjadi ikon wisata Banyuwangi',
        bgColor: 'bg-yellow-100',
      },
    ],
  }

  const currentData = allData[activeTab] || allData.layanan
  const isWisata = activeTab === 'wisata'
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayData.map((item, index) => {
            if (isWisata) {
              const photo = heroPhotos[index]
              return (
                <div 
                  key={index} 
                  className="group relative w-full h-[200px] bg-[#f2f2f2] rounded-[10px] flex items-center justify-center overflow-hidden"
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
                    src={photo.url} 
                    alt={photo.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div 
                    className="card-content-wisata absolute top-0 left-0 w-full h-full p-5 bg-white box-border z-10"
                    style={{
                      transform: 'rotateX(-90deg)',
                      transformOrigin: 'bottom',
                      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    <p className="m-0 text-2xl text-[#333] font-bold">Card Title</p>
                    <p className="mt-2.5 text-sm text-[#777] leading-[1.4]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                  </div>
                </div>
              )
            }
            
            return (
              <ServiceCard key={index} item={item} index={index} />
            )
          })}
        </div>
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
          <span className="text-xl">{item.icon}</span>
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

