import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { truncate } from '../../utils/formatters'

export default function WisataCard({ wisata, index = 0 }) {
  const excerpt = truncate(wisata.deskripsi || '', 120)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={`/wisata/${wisata.slug}`}
        className="block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
      >
        {/* Gambar Destinasi */}
        {wisata.gambar_url && (
          <div className="relative w-full aspect-video overflow-hidden">
            <img
              src={wisata.gambar_url}
              alt={wisata.nama}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-6">
          {/* Nama Destinasi */}
          <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-primary-blue transition-colors line-clamp-2">
            {wisata.nama}
          </h3>

          {/* Lokasi */}
          {wisata.alamat && (
            <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{wisata.alamat}</span>
            </div>
          )}

          {/* Deskripsi Singkat */}
          {excerpt && (
            <p className="text-base text-gray-600 line-clamp-3">{excerpt}</p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

