import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { formatDate, stripHtml, truncate } from '../../utils/formatters'

export default function BeritaCard({ berita }) {
  const excerpt = truncate(stripHtml(berita.konten || berita.meta_description || ''), 150)

  return (
    <Link
      to={`/berita/${berita.slug}`}
      className="block bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-highlighted hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Thumbnail dengan rasio 16:9 */}
      {berita.thumbnail_url && (
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={berita.thumbnail_url}
            alt={berita.judul}
            width={400}
            height={225}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge kategori kecil di atas gambar (jika diperlukan) */}
          <div className="absolute top-2 left-2">
            <span className="bg-secondary-yellow text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
              Berita
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Tanggal dengan ikon kalender */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(berita.dipublikasikan_pada || berita.dibuat_pada)}</span>
        </div>

        {/* Judul berita (maksimal 2 baris) */}
        <h3 className="text-h2 font-semibold mb-3 line-clamp-2 text-gray-900 group-hover:text-primary-blue transition-colors">
          {berita.judul}
        </h3>

        {/* Ringkasan singkat (2-3 baris) */}
        {excerpt && (
          <p className="text-body text-gray-600 line-clamp-3">{excerpt}</p>
        )}
      </div>
    </Link>
  )
}

