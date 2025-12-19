import { Video } from 'lucide-react'

export default function VideoEmptyState({ searchQuery }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <Video className="w-24 h-24 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Video tidak ditemukan
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        {searchQuery
          ? `Tidak ada video yang ditemukan untuk "${searchQuery}". Silakan coba kata kunci lain.`
          : 'Tidak ada video yang tersedia saat ini.'}
      </p>
    </div>
  )
}

