import { motion } from 'framer-motion'
import { FileText, FileSpreadsheet, Download, Calendar, ArrowDown } from 'lucide-react'
import { formatDate } from '../../utils/formatters'

export default function TransparansiCard({ anggaran, index = 0 }) {
  const handleDownload = (url, filename) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
        {/* Header Section dengan Accent Background */}
        <div className="relative bg-gradient-to-br from-primary-blue/5 via-primary-blue/3 to-transparent p-6 border-b border-gray-100">
          {/* Tahun Badge dengan Accent */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary-blue to-blue-700 text-white shadow-md">
                <span className="text-2xl font-bold">{anggaran.tahun}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Anggaran Tahun {anggaran.tahun}
                </h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Transparansi Anggaran
                </p>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          {anggaran.deskripsi && (
            <p className="text-sm text-gray-600 leading-relaxed mt-4 pl-20">
              {anggaran.deskripsi}
            </p>
          )}
        </div>

        {/* Action Section */}
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            {/* Tombol Unduh Excel */}
            {anggaran.file_excel_url && (
              <button
                onClick={() => handleDownload(anggaran.file_excel_url, `Anggaran_${anggaran.tahun}.xlsx`)}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md group/btn"
              >
                <FileSpreadsheet className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                <span>Unduh Excel</span>
                <ArrowDown className="w-4 h-4 opacity-70 group-hover/btn:translate-y-0.5 transition-transform" />
              </button>
            )}

            {/* Tombol Unduh PDF */}
            {anggaran.file_pdf_url && (
              <button
                onClick={() => handleDownload(anggaran.file_pdf_url, `Anggaran_${anggaran.tahun}.pdf`)}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-primary-blue hover:text-primary-blue hover:bg-primary-blue/5 active:bg-primary-blue/10 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md group/btn"
              >
                <FileText className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                <span>Unduh PDF</span>
                <ArrowDown className="w-4 h-4 opacity-70 group-hover/btn:translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Footer Section - Metadata */}
        {(anggaran.diperbarui_pada || anggaran.updated_at) && (
          <div className="px-6 pb-5 pt-0">
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-100">
                <Calendar className="w-3 h-3 text-gray-500" />
              </div>
              <span className="font-medium">Terakhir diperbarui:</span>
              <span>{formatDate(anggaran.diperbarui_pada || anggaran.updated_at)}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
