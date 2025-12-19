import { FileX } from 'lucide-react'

export default function TransparansiEmptyState({ hasFilter = false }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <FileX className="w-24 h-24 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Data Transparansi Anggaran Tidak Ditemukan
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        {hasFilter
          ? 'Tidak ada data transparansi anggaran untuk filter yang dipilih. Silakan coba filter lain.'
          : 'Tidak ada data transparansi anggaran yang tersedia saat ini.'}
      </p>
    </div>
  )
}

