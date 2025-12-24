import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { formatDate, stripHtml, truncate } from '../../../utils/formatters'
import { Button } from '../../ui/button'

export default function FeaturedNewsSection({ berita }) {
  if (!berita) return null

  const excerpt = truncate(stripHtml(berita.konten || berita.meta_description || ''), 200)

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Berita Unggulan</h2>
        
        <Link
          to={`/berita/${berita.slug}`}
          className="block group"
        >
          <div className="relative overflow-hidden rounded-card shadow-card hover:shadow-card-highlighted transition-all duration-300 bg-white">
            {/* Image dengan Overlay Gradient */}
            {berita.thumbnail_url && (
              <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                <img
                  src={berita.thumbnail_url}
                  alt={berita.judul}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay gradient tipis */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Badge Kategori (jika ada) - menggunakan warna aksen kuning/gold */}
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary-yellow text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                    Berita Terkini
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="flex items-center gap-2 text-sm mb-3 text-white/90">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(berita.dipublikasikan_pada || berita.dibuat_pada)}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 line-clamp-2 group-hover:text-secondary-yellow transition-colors">
                    {berita.judul}
                  </h3>
                  {excerpt && (
                    <p className="text-base md:text-lg text-white/90 line-clamp-2 mb-4">
                      {excerpt}
                    </p>
                  )}
                  <Button
                    variant="default"
                    className="bg-primary-blue hover:bg-primary-blue/90 text-white"
                  >
                    Baca Selengkapnya
                  </Button>
                </div>
              </div>
            )}

            {/* Fallback jika tidak ada gambar */}
            {!berita.thumbnail_url && (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(berita.dipublikasikan_pada || berita.dibuat_pada)}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 group-hover:text-primary-blue transition-colors">
                  {berita.judul}
                </h3>
                {excerpt && (
                  <p className="text-base text-gray-600 mb-4 line-clamp-3">
                    {excerpt}
                  </p>
                )}
                <Button
                  variant="default"
                  className="bg-primary-blue hover:bg-primary-blue/90 text-white"
                >
                  Baca Selengkapnya
                </Button>
              </div>
            )}
          </div>
        </Link>
      </div>
    </section>
  )
}

