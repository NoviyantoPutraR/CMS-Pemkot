import { motion } from 'framer-motion'
import { MapPin, User } from 'lucide-react'

export default function PerangkatDaerahCard({ perangkat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className="p-6">
        {/* Header dengan foto (opsional) */}
        <div className="flex items-start gap-4 mb-4">
          {perangkat.foto_url ? (
            <div className="flex-shrink-0">
              <img
                src={perangkat.foto_url}
                alt={perangkat.nama_perangkat}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-blue transition-colors line-clamp-2">
              {perangkat.nama_perangkat}
            </h3>
          </div>
        </div>

        {/* Informasi Kepala */}
        {perangkat.jabatan_kepala && perangkat.nama_kepala && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-600 mb-1">{perangkat.jabatan_kepala}</p>
            <p className="text-sm font-medium text-gray-900">{perangkat.nama_kepala}</p>
          </div>
        )}

        {/* Alamat */}
        {perangkat.alamat && (
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-2">{perangkat.alamat}</p>
          </div>
        )}

        {/* Kontak (opsional) */}
        {perangkat.kontak && (
          <div className="text-sm text-gray-500">
            <span className="font-medium">Kontak:</span> {perangkat.kontak}
          </div>
        )}
      </div>
    </motion.div>
  )
}

