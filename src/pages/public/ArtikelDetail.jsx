import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { artikelService } from '../../services/artikelService'
import ArtikelCard from '../../components/public/ArtikelCard'
import Loading from '../../components/shared/Loading'
import Breadcrumb from '../../components/shared/Breadcrumb'
import { generateBreadcrumbFromRoute } from '../../utils/breadcrumbHelper'
import { formatDate, estimateReadingTime } from '../../utils/formatters'
import { Calendar, Clock, User, Eye } from 'lucide-react'

export default function ArtikelDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const [artikel, setArtikel] = useState(null)
  const [relatedArtikel, setRelatedArtikel] = useState([])
  const [loading, setLoading] = useState(true)
  const breadcrumbItems = generateBreadcrumbFromRoute(location.pathname, false)

  useEffect(() => {
    loadArtikel()
  }, [slug])

  const loadArtikel = async () => {
    try {
      setLoading(true)
      
      // Load artikel utama
      const data = await artikelService.getBySlug(slug)
      setArtikel(data)

      // Load related artikel secara parallel
      artikelService.getRelated(data.id, 4)
        .then(related => setRelatedArtikel(related))
        .catch(error => console.error('Error loading related artikel:', error))
    } catch (error) {
      console.error('Error loading artikel:', error)
    } finally {
      setLoading(false)
    }
  }

  // Increment views counter saat artikel dimuat
  useEffect(() => {
    if (artikel && artikel.id) {
      // Fire and forget - tidak perlu menunggu response
      artikelService.incrementViews(artikel.id)
    }
  }, [artikel?.id])

  if (loading) {
    return <Loading />
  }

  if (!artikel) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Background Gradient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-50 to-[#F8F9FA]"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-40"></div>
          <div className="absolute right-0 top-0 bottom-0 w-[800px] h-full bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 -translate-x-1/4"></div>
        </div>
        <div className="relative z-10 py-12 text-center">
          <p className="text-gray-600">Artikel tidak ditemukan</p>
        </div>
      </div>
    )
  }

  const readingTime = estimateReadingTime(artikel.konten || artikel.meta_description || '')

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Gradient (sama seperti landing page) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-50 to-[#F8F9FA]"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute right-0 top-0 bottom-0 w-[800px] h-full bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          {breadcrumbItems.length > 1 && (
            <div className="mb-8">
              <Breadcrumb items={breadcrumbItems} homeHref="/" />
            </div>
          )}

          {/* Article */}
          <article className="bg-white rounded-card shadow-card p-8 lg:p-12">
            {/* Hero Image */}
            {artikel.thumbnail_url && (
              <div className="mb-8 -mx-8 lg:-mx-12 -mt-8 lg:-mt-12">
                <img
                  src={artikel.thumbnail_url}
                  alt={artikel.judul}
                  className="w-full h-[400px] lg:h-[500px] object-cover rounded-t-card"
                />
              </div>
            )}

            {/* Badge Kategori */}
            <div className="mb-6">
              <span className="bg-secondary-yellow text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                Artikel
              </span>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(artikel.dipublikasikan_pada || artikel.dibuat_pada)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} menit baca</span>
              </div>
              {artikel.penulis && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{artikel.penulis}</span>
                </div>
              )}
              {artikel.dilihat !== undefined && artikel.dilihat !== null && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{artikel.dilihat} dilihat</span>
                </div>
              )}
            </div>

            {/* Judul */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 leading-tight">
              {artikel.judul}
            </h1>

            {/* Konten Artikel */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base prose-a:text-primary-blue prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: artikel.konten }}
            />
          </article>

          {/* Artikel Terkait */}
          {relatedArtikel.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArtikel.map((item) => (
                  <ArtikelCard key={item.id} artikel={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

