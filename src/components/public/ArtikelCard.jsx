import { Link } from 'react-router-dom'
import { Calendar, Clock, User } from 'lucide-react'
import { formatDate, stripHtml, truncate, estimateReadingTime } from '../../utils/formatters'

export default function ArtikelCard({ artikel }) {
  const excerpt = truncate(stripHtml(artikel.konten || artikel.meta_description || ''), 150)
  const readingTime = estimateReadingTime(artikel.konten || artikel.meta_description || '')

  return (
    <Link
      to={`/artikel/${artikel.slug}`}
      className="block bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-highlighted hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Thumbnail dengan rasio 16:9 */}
      {artikel.thumbnail_url && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={artikel.thumbnail_url}
            alt={artikel.judul}
            width={400}
            height={225}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge kategori kecil di atas gambar */}
          <div className="absolute top-2 left-2">
            <span className="bg-secondary-yellow text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
              Artikel
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Metadata: Tanggal */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(artikel.dipublikasikan_pada || artikel.dibuat_pada)}</span>
        </div>

        {/* Judul artikel (maksimal 2 baris) */}
        <h3 className="text-h2 font-semibold mb-3 line-clamp-2 text-gray-900 group-hover:text-primary-blue transition-colors">
          {artikel.judul}
        </h3>

        {/* Ringkasan singkat (2-3 baris) */}
        {excerpt && (
          <p className="text-body text-gray-600 line-clamp-3 mb-4">{excerpt}</p>
        )}

        {/* Metadata: Waktu baca dan penulis */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime} menit baca</span>
          </div>
          {/* Penulis atau instansi (jika ada di data) */}
          {artikel.penulis && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{artikel.penulis}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

