import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { layananService } from '../../services/layananService'
import Loading from '../../components/shared/Loading'
import Breadcrumb from '../../components/shared/Breadcrumb'
import { generateBreadcrumbFromRoute } from '../../utils/breadcrumbHelper'

export default function LayananDetail() {
  const { id } = useParams()
  const location = useLocation()
  const [layanan, setLayanan] = useState(null)
  const [loading, setLoading] = useState(true)
  const breadcrumbItems = generateBreadcrumbFromRoute(location.pathname, false)

  useEffect(() => {
    loadLayanan()
  }, [id])

  const loadLayanan = async () => {
    try {
      setLoading(true)
      const data = await layananService.getById(id)
      setLayanan(data)
    } catch (error) {
      console.error('Error loading layanan:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!layanan) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Layanan tidak ditemukan</p>
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

          {/* Content */}
          <article>
            {layanan.icon_url && (
              <div className="mb-6 flex items-center justify-center">
                <img
                  src={layanan.icon_url}
                  alt={layanan.judul}
                  className="w-32 h-32 object-cover"
                />
              </div>
            )}

            <h1 className="text-4xl font-bold mb-6">{layanan.judul}</h1>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: layanan.konten }}
            />
          </article>
        </div>
      </div>
    </div>
  )
}

