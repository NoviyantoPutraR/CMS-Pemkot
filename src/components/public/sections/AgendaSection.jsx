import { Link } from 'react-router-dom'
import { formatDateTime } from '../../../utils/formatters'

export default function AgendaSection({ 
  agenda = [],
  title = "Agenda Kota",
  showViewAll = true,
  viewAllLink = "/agenda",
  backgroundColor = "bg-primary-blue"
}) {
  const getStatusBadge = (item) => {
    const now = new Date()
    const tanggalMulai = new Date(item.tanggal_mulai)
    const tanggalSelesai = item.tanggal_selesai ? new Date(item.tanggal_selesai) : null

    if (item.status === 'dibatalkan') {
      return {
        label: 'Dibatalkan',
        bgColor: '#FEE2E2',
        textColor: '#991B1B',
      }
    }

    if (item.status === 'selesai') {
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

  return (
    <section className={`py-16 md:py-24 ${backgroundColor} text-white`}>
      <div className="max-w-container mx-auto px-6 md:px-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
          {showViewAll && agenda.length > 0 && (
            <Link
              to={viewAllLink}
              className="flex items-center gap-2 text-white font-semibold hover:underline transition-colors"
            >
              <span>Lihat Semua</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
        {agenda.length > 0 ? (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {agenda.map((item) => {
                const statusBadge = getStatusBadge(item)
                return (
                  <AgendaCard key={item.id} item={item} statusBadge={statusBadge} />
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-white/80 py-12">
            Belum ada agenda
          </p>
        )}
      </div>
    </section>
  )
}

function AgendaCard({ item, statusBadge }) {
  const dateStr = formatDateTime(item.tanggal_mulai)

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg min-w-[300px] md:min-w-[350px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Date Badge - Prominent */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-neutral-gray600">
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
          <span className="font-semibold text-neutral-darkGray">{dateStr}</span>
        </div>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: statusBadge.bgColor,
            color: statusBadge.textColor,
          }}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Event Title */}
      <h3 className="text-xl md:text-2xl font-semibold text-neutral-darkGray mb-3 line-clamp-2">
        {item.judul}
      </h3>

      {/* Description */}
      {item.deskripsi && (
        <p className="text-base text-neutral-gray600 mb-4 line-clamp-2">
          {item.deskripsi}
        </p>
      )}

      {/* Location */}
      {item.lokasi && (
        <div className="flex items-center gap-2 text-sm text-neutral-gray600">
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
          <span className="line-clamp-1">{item.lokasi}</span>
        </div>
      )}
    </div>
  )
}

