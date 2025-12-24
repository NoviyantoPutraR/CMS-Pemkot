import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { wisataService } from '../../services/wisataService'
import Loading from '../../components/shared/Loading'
import Breadcrumb from '../../components/shared/Breadcrumb'
import { generateBreadcrumbFromRoute } from '../../utils/breadcrumbHelper'
import { MapPin, Navigation } from 'lucide-react'

export default function WisataDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const [wisata, setWisata] = useState(null)
  const [loading, setLoading] = useState(true)
  const breadcrumbItems = generateBreadcrumbFromRoute(location.pathname, false)

  // Scroll ke atas saat masuk ke halaman atau slug berubah
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  useEffect(() => {
    loadWisata()
  }, [slug])

  const loadWisata = async () => {
    try {
      setLoading(true)
      const data = await wisataService.getBySlug(slug)
      setWisata(data)
    } catch (error) {
      console.error('Error loading wisata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!wisata) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Wisata tidak ditemukan</p>
      </div>
    )
  }

  const googleMapsUrl = wisata.koordinat_lat && wisata.koordinat_lng
    ? `https://www.google.com/maps?q=${wisata.koordinat_lat},${wisata.koordinat_lng}`
    : null

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-50 to-[#F8F9FA]"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute right-0 top-0 bottom-0 w-[800px] h-full bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            {breadcrumbItems.length > 1 && (
              <div className="mb-6">
                <Breadcrumb items={breadcrumbItems} homeHref="/" />
              </div>
            )}

            {/* Content */}
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Gambar Utama */}
              {wisata.gambar_url && (
                <div className="relative w-full h-96 overflow-hidden">
                  <img
                    src={wisata.gambar_url}
                    alt={wisata.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                {/* Nama Wisata */}
                <h1 className="text-4xl font-bold mb-6 text-gray-900">{wisata.nama}</h1>

                {/* Alamat */}
                {wisata.alamat && (
                  <div className="flex items-start gap-3 mb-6 text-gray-700">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-primary-blue" />
                    <div>
                      <p className="font-semibold mb-1">Alamat</p>
                      <p className="text-gray-600">{wisata.alamat}</p>
                    </div>
                  </div>
                )}

                {/* Koordinat & Maps Link */}
                {googleMapsUrl && (
                  <div className="mb-6">
                    <div className="flex items-start gap-3 text-gray-700 mb-3">
                      <Navigation className="w-5 h-5 mt-1 flex-shrink-0 text-primary-blue" />
                      <div>
                        <p className="font-semibold mb-1">Lokasi</p>
                        <p className="text-gray-600">
                          {wisata.koordinat_lat}, {wisata.koordinat_lng}
                        </p>
                      </div>
                    </div>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      Buka di Google Maps
                    </a>
                  </div>
                )}

                {/* Deskripsi Singkat */}
                {wisata.deskripsi && (
                  <div className="mb-6">
                    <p className="text-lg text-gray-700 leading-relaxed">{wisata.deskripsi}</p>
                  </div>
                )}

                {/* Konten Lengkap */}
                {wisata.konten && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: wisata.konten }}
                    />
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}

