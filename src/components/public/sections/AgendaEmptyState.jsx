import { Calendar, FileSearch } from 'lucide-react'

export default function AgendaEmptyState({ searchQuery, hasFilters }) {
  if (searchQuery || hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="mb-6">
          <FileSearch className="w-24 h-24 text-gray-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Agenda tidak ditemukan
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          {searchQuery
            ? `Tidak ada agenda yang ditemukan untuk "${searchQuery}". Silakan coba kata kunci lain atau ubah filter.`
            : 'Tidak ada agenda yang sesuai dengan filter yang dipilih. Silakan coba filter lain.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <Calendar className="w-24 h-24 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Belum ada agenda
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        Belum ada agenda kegiatan yang tersedia saat ini. Agenda akan ditampilkan di sini setelah dipublikasikan.
      </p>
    </div>
  )
}

