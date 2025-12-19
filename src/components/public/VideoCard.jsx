import { Play, Eye, Calendar } from 'lucide-react'
import { formatDate, formatVideoDuration, formatVideoViews } from '../../utils/formatters'
import { motion } from 'framer-motion'

export default function VideoCard({ video, index = 0 }) {
  const handleClick = () => {
    if (video.url_video) {
      window.open(video.url_video, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        onClick={handleClick}
        className="block bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
      >
        {/* Thumbnail dengan aspect ratio 16:9 */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.judul}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <Play className="w-16 h-16 text-primary-blue opacity-50" />
            </div>
          )}
          
          {/* Play icon overlay di tengah */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-primary-blue ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Durasi badge di corner bottom-right */}
          {video.durasi && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
              {formatVideoDuration(video.durasi)}
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Judul video (maksimal 2 baris) */}
          <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-gray-900 group-hover:text-primary-blue transition-colors">
            {video.judul}
          </h3>

          {/* Deskripsi singkat (2 baris) */}
          {video.deskripsi && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {video.deskripsi}
            </p>
          )}

          {/* Metadata: Views dan Tanggal */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {video.dilihat !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{formatVideoViews(video.dilihat)}</span>
                </div>
              )}
              {video.dibuat_pada && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(video.dibuat_pada)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

