import { formatDateTime } from '../../utils/formatters'
import { colors, components } from '../../utils/designTokens'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

const getStatusBadge = (agenda) => {
  const now = new Date()
  const tanggalMulai = new Date(agenda.tanggal_mulai)
  const tanggalSelesai = agenda.tanggal_selesai ? new Date(agenda.tanggal_selesai) : null

  if (agenda.status === 'dibatalkan') {
    return {
      label: 'Dibatalkan',
      bgColor: '#FEE2E2',
      textColor: '#991B1B',
    }
  }

  if (agenda.status === 'selesai') {
    return {
      label: 'Selesai',
      bgColor: '#D1FAE5',
      textColor: '#065F46',
    }
  }

  if (tanggalSelesai && now > tanggalSelesai) {
    return {
      label: 'Selesai',
      bgColor: '#D1FAE5',
      textColor: '#065F46',
    }
  }

  if (now >= tanggalMulai && (!tanggalSelesai || now <= tanggalSelesai)) {
    return {
      label: 'Berlangsung',
      bgColor: '#DBEAFE',
      textColor: '#1E40AF',
    }
  }

  return {
    label: 'Mendatang',
    bgColor: '#FEF3C7',
    textColor: '#92400E',
  }
}

export default function AgendaCard({ agenda }) {
  const statusBadge = getStatusBadge(agenda)
  const dateStr = formatDateTime(agenda.tanggal_mulai)
  const [cardRef, isVisible] = useIntersectionObserver()

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-card p-6 shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(10px)',
        transition: 'opacity 0.65s ease-out, filter 0.65s ease-out, transform 0.3s ease-out, box-shadow 0.3s ease-out',
      }}
    >
      {/* Date and Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-caption text-neutral-gray600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{dateStr}</span>
        </div>
        <span
          className="px-3 py-1 rounded-badge text-caption font-semibold"
          style={{
            backgroundColor: statusBadge.bgColor,
            color: statusBadge.textColor,
          }}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-h3 font-semibold text-neutral-gray900 mb-3 line-clamp-2">
        {agenda.judul}
      </h3>

      {/* Description */}
      {agenda.deskripsi && (
        <p className="text-small text-neutral-gray600 mb-4 line-clamp-2">
          {agenda.deskripsi}
        </p>
      )}

      {/* Location */}
      {agenda.lokasi && (
        <div className="flex items-center gap-2 text-small text-neutral-gray600">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="line-clamp-1">{agenda.lokasi}</span>
        </div>
      )}
    </div>
  )
}

