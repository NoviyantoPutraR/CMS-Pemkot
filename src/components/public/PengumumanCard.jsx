import { Calendar, FileText } from 'lucide-react'
import { formatDate, stripHtml, truncate } from '../../utils/formatters'

export default function PengumumanCard({ pengumuman }) {
  const excerpt = truncate(stripHtml(pengumuman.konten || ''), 150)
  
  // Tentukan status berdasarkan tanggal_berlaku_selesai
  const today = new Date().toISOString().split('T')[0]
  const isAktif = !pengumuman.tanggal_berlaku_selesai || 
                  pengumuman.tanggal_berlaku_selesai >= today
  const status = isAktif ? 'aktif' : 'berakhir'
  
  // Format periode berlaku
  const formatPeriode = () => {
    if (!pengumuman.tanggal_berlaku_mulai && !pengumuman.tanggal_berlaku_selesai) {
      return null
    }
    
    const mulai = pengumuman.tanggal_berlaku_mulai 
      ? formatDate(pengumuman.tanggal_berlaku_mulai)
      : null
    const selesai = pengumuman.tanggal_berlaku_selesai
      ? formatDate(pengumuman.tanggal_berlaku_selesai)
      : null
    
    if (mulai && selesai) {
      return `${mulai} - ${selesai}`
    } else if (mulai) {
      return `Mulai: ${mulai}`
    } else if (selesai) {
      return `Sampai: ${selesai}`
    }
    
    return null
  }

  const periode = formatPeriode()

  return (
    <div className="bg-white rounded-card border border-gray-200 overflow-hidden shadow-card hover:shadow-card-highlighted hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-6">
        {/* Badge Status dan Ikon Lampiran */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                status === 'aktif'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {status === 'aktif' ? 'Aktif' : 'Berakhir'}
            </span>
            {pengumuman.file_lampiran_url && (
              <div className="flex items-center gap-1 text-gray-500">
                <FileText className="w-4 h-4" />
                <span className="text-xs">Lampiran</span>
              </div>
            )}
          </div>
        </div>

        {/* Judul Pengumuman */}
        <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-gray-900 group-hover:text-primary-blue transition-colors">
          {pengumuman.judul}
        </h3>

        {/* Periode Berlaku */}
        {periode && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Calendar className="w-4 h-4" />
            <span>{periode}</span>
          </div>
        )}

        {/* Ringkasan Konten */}
        {excerpt && (
          <p className="text-base text-gray-600 line-clamp-3 mb-4">{excerpt}</p>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {pengumuman.dipublikasikan_pada
              ? `Dipublikasikan: ${formatDate(pengumuman.dipublikasikan_pada)}`
              : `Dibuat: ${formatDate(pengumuman.dibuat_pada)}`}
          </p>
        </div>
      </div>
    </div>
  )
}

