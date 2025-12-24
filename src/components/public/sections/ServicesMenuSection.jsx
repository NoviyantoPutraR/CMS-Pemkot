import { Link } from 'react-router-dom'

export default function ServicesMenuSection({ 
  kategori = [],
  title = "Layanan Publik",
  showViewAll = true,
  viewAllLink = "/layanan",
  backgroundColor = "bg-primary-blue"
}) {
  return (
    <section className={`py-16 md:py-24 ${backgroundColor} text-white`}>
      <div className="max-w-container mx-auto px-6 md:px-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
          {showViewAll && kategori.length > 0 && (
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
        {kategori.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {kategori.map((item, index) => (
              <ServiceItem key={item.id} item={item} number={index + 1} />
            ))}
          </div>
        ) : (
          <p className="text-center text-white/80 py-12">
            Belum ada kategori layanan
          </p>
        )}
      </div>
    </section>
  )
}

function ServiceItem({ item, number }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
      {/* Numbered Badge */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-yellow text-neutral-darkGray flex items-center justify-center font-bold text-lg">
          {number}
        </div>
        <div className="flex-1">
          {/* Icon */}
          {item.icon_url && (
            <div className="w-12 h-12 mb-3">
              <img
                src={item.icon_url}
                alt={item.nama}
                width={48}
                height={48}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
            {item.nama}
          </h3>
          
          {/* Description */}
          {item.deskripsi && (
            <p className="text-base text-white/80 mb-4 line-clamp-2">
              {item.deskripsi}
            </p>
          )}
        </div>
      </div>
      
      {/* More Info Button - Yellow Accent */}
      <Link
        to={`/layanan?kategori=${item.slug}`}
        className="inline-flex items-center gap-2 bg-secondary-yellow text-neutral-darkGray px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
      >
        <span>Info Lebih Lanjut</span>
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  )
}

