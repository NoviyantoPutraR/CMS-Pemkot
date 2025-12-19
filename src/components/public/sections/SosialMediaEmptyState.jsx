import { Share2 } from 'lucide-react'

export default function SosialMediaEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <Share2 className="w-24 h-24 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Belum ada media sosial yang tersedia
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        Media sosial resmi Pemerintah Provinsi Jawa Timur akan ditampilkan di sini.
      </p>
    </div>
  )
}

