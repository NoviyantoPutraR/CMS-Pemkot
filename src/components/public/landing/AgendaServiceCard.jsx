import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { formatDate } from '../../../utils/formatters'
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver'

const getStatusBadge = (agenda) => {
  const now = new Date()
  const tanggalMulai = new Date(agenda.tanggal_mulai)
  const tanggalSelesai = agenda.tanggal_selesai ? new Date(agenda.tanggal_selesai) : null

  if (agenda.status === 'dibatalkan') {
    return {
      label: 'Dibatalkan',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
    }
  }

  if (agenda.status === 'selesai') {
    return {
      label: 'Selesai',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    }
  }

  if (tanggalSelesai && now > tanggalSelesai) {
    return {
      label: 'Selesai',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    }
  }

  if (now >= tanggalMulai && (!tanggalSelesai || now <= tanggalSelesai)) {
    return {
      label: 'Berlangsung',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    }
  }

  return {
    label: 'Mendatang',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  }
}

export default function AgendaServiceCard({ agenda, index = 0 }) {
  const statusBadge = getStatusBadge(agenda)
  const [cardRef, isVisible] = useIntersectionObserver()
  
  // Format tanggal untuk display
  const dateStr = formatDate(agenda.tanggal_mulai)
  const timeStr = new Date(agenda.tanggal_mulai).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  })

  // Gradient colors berdasarkan index untuk variasi visual
  const gradientColors = [
    'from-blue-50 to-indigo-50',
    'from-purple-50 to-pink-50',
    'from-cyan-50 to-teal-50',
    'from-amber-50 to-orange-50',
    'from-emerald-50 to-green-50',
    'from-rose-50 to-red-50',
    'from-violet-50 to-purple-50',
    'from-sky-50 to-blue-50',
  ]
  const gradientClass = gradientColors[index % gradientColors.length]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative w-full aspect-[160/192] rounded-2xl bg-gradient-to-br overflow-hidden border border-gray-200/50 hover:border-blue-300 transition-all duration-500 ease-out shadow-sm hover:shadow-xl"
      style={{
        filter: isVisible ? 'blur(0px)' : 'blur(10px)',
      }}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-5 z-10">
        {/* Icon & Status Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusBadge.bgColor} ${statusBadge.textColor} ${statusBadge.borderColor} backdrop-blur-sm`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug lg:line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
          {agenda.judul}
        </h3>

        {/* Description */}
        {agenda.deskripsi && (
          <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-grow">
            {agenda.deskripsi}
          </p>
        )}

        {/* Date & Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Clock className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="font-medium">{dateStr}</span>
            <span className="text-gray-400">•</span>
            <span>{timeStr}</span>
          </div>
          
          {/* Location */}
          {agenda.lokasi && (
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{agenda.lokasi}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-500 pointer-events-none" />
    </motion.div>
  )
}

