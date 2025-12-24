import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { beritaService } from '../../services/beritaService'
import BeritaCard from '../../components/public/BeritaCard'
import Loading from '../../components/shared/Loading'
import Breadcrumb from '../../components/shared/Breadcrumb'
import { generateBreadcrumbFromRoute } from '../../utils/breadcrumbHelper'
import { formatDate } from '../../utils/formatters'

export default function BeritaDetail() {
  const { slug } = useParams()
  const location = useLocation()
  const [berita, setBerita] = useState(null)
  const [relatedBerita, setRelatedBerita] = useState([])
  const [loading, setLoading] = useState(true)
  const breadcrumbItems = generateBreadcrumbFromRoute(location.pathname, false)

  useEffect(() => {
    loadBerita()
  }, [slug])

  const loadBerita = async () => {
    try {
      setLoading(true)
      
      // Load berita utama
      const data = await beritaService.getBySlug(slug)
      setBerita(data)

      // Load related berita secara parallel
      beritaService.getRelated(data.id, 4)
        .then(related => setRelatedBerita(related))
        .catch(error => console.error('Error loading related berita:', error))
    } catch (error) {
      console.error('Error loading berita:', error)
    } finally {
      setLoading(false)
    }
  }

  // Increment views counter saat berita dimuat
  useEffect(() => {
    if (berita && berita.id) {
      // Fire and forget - tidak perlu menunggu response
      beritaService.incrementViews(berita.id)
    }
  }, [berita?.id])

  if (loading) {
    return <Loading />
  }

  if (!berita) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Berita tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          {breadcrumbItems.length > 1 && (
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} homeHref="/" />
            </div>
          )}

          {/* Article */}
          <article>
            {berita.thumbnail_url && (
              <img
                src={berita.thumbnail_url}
                alt={berita.judul}
                width={1200}
                height={675}
                fetchpriority="high"
                className="w-full h-96 object-cover rounded-lg mb-6"
              />
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{formatDate(berita.dibuat_pada)}</span>
            </div>

            <h1 className="text-4xl font-bold mb-6">{berita.judul}</h1>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: berita.konten }}
            />
          </article>

          {/* Related Berita */}
          {relatedBerita.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Berita Terkait</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedBerita.map((item) => (
                  <BeritaCard key={item.id} berita={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

