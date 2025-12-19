import { Link } from 'react-router-dom'
import { stripHtml, truncate } from '../../utils/formatters'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function LayananCard({ layanan, index = 0 }) {
  const excerpt = layanan.meta_description 
    ? truncate(layanan.meta_description, 100)
    : truncate(stripHtml(layanan.konten || ''), 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={`/layanan/${layanan.slug || layanan.id}`}
        className="block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
      >
        {layanan.icon_url && (
          <div className="p-6 bg-gray-50 flex items-center justify-center border-b border-gray-100">
            <img
              src={layanan.icon_url}
              alt={layanan.judul}
              className="w-20 h-20 object-contain"
            />
          </div>
        )}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-primary-blue transition-colors">
            {layanan.judul}
          </h3>
          <p className="text-base text-gray-600 line-clamp-2 mb-4">{excerpt}</p>
          <div className="flex items-center text-primary-blue text-sm font-medium group-hover:gap-2 transition-all">
            <span>Lihat Detail</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

