import { Link } from 'react-router-dom'
import { formatDate, stripHtml, truncate } from '../../../utils/formatters'

export default function NewsGridSection({ 
  items = [],
  title = "Berita Terbaru",
  type = "berita", // 'berita' or 'artikel'
  limit = 3,
  showViewAll = true,
  viewAllLink = null,
  backgroundColor = "bg-white"
}) {
  const displayedItems = items.slice(0, limit)
  const defaultViewAllLink = type === 'artikel' ? '/artikel' : '/berita'
  const finalViewAllLink = viewAllLink || defaultViewAllLink

  return (
    <section className={`py-16 md:py-24 ${backgroundColor}`}>
      <div className="max-w-container mx-auto px-6 md:px-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-darkGray">{title}</h2>
          {showViewAll && displayedItems.length > 0 && (
            <Link
              to={finalViewAllLink}
              className="flex items-center gap-2 text-primary-blue font-semibold hover:underline transition-colors"
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
        {displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayedItems.map((item) => (
              <NewsCard key={item.id} item={item} type={type} />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-gray600 py-12">
            Belum ada {type === 'artikel' ? 'artikel' : 'berita'}
          </p>
        )}
      </div>
    </section>
  )
}

function NewsCard({ item, type }) {
  const excerpt = truncate(stripHtml(item.konten || item.meta_description || ''), 150)
  const detailLink = `/${type}/${item.slug}`

  return (
    <Link
      to={detailLink}
      className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Featured Image */}
      {item.thumbnail_url && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={item.thumbnail_url}
            alt={item.judul}
            width={400}
            height={192}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          {/* Category Badge - Top of image */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-secondary-yellow text-neutral-darkGray text-sm font-semibold">
              {type === 'artikel' ? 'Artikel' : 'Berita'}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Date Stamp */}
        <div className="flex items-center gap-2 text-sm text-neutral-gray600 mb-3">
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
          <span>{formatDate(item.dibuat_pada || item.dipublikasikan_pada)}</span>
        </div>
        
        {/* Headline */}
        <h3 className="text-xl md:text-2xl font-semibold mb-3 line-clamp-2 text-neutral-darkGray hover:text-primary-blue transition-colors">
          {item.judul}
        </h3>
        
        {/* Excerpt */}
        <p className="text-base text-neutral-gray600 line-clamp-3 mb-4">{excerpt}</p>
        
        {/* Read More Link */}
        <div className="flex items-center text-primary-blue font-medium text-sm hover:underline">
          <span>Baca selengkapnya</span>
          <svg
            className="w-4 h-4 ml-2"
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
        </div>
      </div>
    </Link>
  )
}

