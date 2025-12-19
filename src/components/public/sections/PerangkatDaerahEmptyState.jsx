import { Building2 } from 'lucide-react'

export default function PerangkatDaerahEmptyState({ searchQuery }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <Building2 className="w-24 h-24 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Perangkat daerah tidak ditemukan
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        {searchQuery
          ? `Tidak ada perangkat daerah yang ditemukan untuk "${searchQuery}". Silakan coba kata kunci lain.`
          : 'Tidak ada perangkat daerah yang tersedia saat ini.'}
      </p>
    </div>
  )
}

