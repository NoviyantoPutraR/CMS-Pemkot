import { FileSearch } from 'lucide-react'

export default function PengumumanEmptyState({ searchQuery }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <FileSearch className="w-24 h-24 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Pengumuman tidak ditemukan
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        {searchQuery
          ? `Tidak ada pengumuman yang ditemukan untuk "${searchQuery}". Silakan coba kata kunci lain atau ubah filter.`
          : 'Tidak ada pengumuman yang tersedia saat ini.'}
      </p>
    </div>
  )
}

