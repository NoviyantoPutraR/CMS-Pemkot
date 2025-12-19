import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { beritaService } from '../../services/beritaService'
import BeritaCard from '../../components/public/BeritaCard'
import BeritaHeroSection from '../../components/public/sections/BeritaHeroSection'
import BeritaSearchFilter from '../../components/public/sections/BeritaSearchFilter'
import FeaturedNewsSection from '../../components/public/sections/FeaturedNewsSection'
import BeritaPagination from '../../components/public/sections/BeritaPagination'
import BeritaEmptyState from '../../components/public/sections/BeritaEmptyState'
import Loading from '../../components/shared/Loading'
import { useDebounce } from '../../hooks/useDebounce'

export default function BeritaList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [berita, setBerita] = useState([])
  const [featuredNews, setFeaturedNews] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'terbaru')
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const debouncedSearch = useDebounce(search, 500)

  // Scroll ke atas saat masuk ke halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Load stats untuk hero section
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await beritaService.getStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    loadStats()
  }, [])

  // Load featured news (berita terbaru pertama)
  useEffect(() => {
    const loadFeaturedNews = async () => {
      try {
        setLoadingFeatured(true)
        const latest = await beritaService.getLatest(1)
        if (latest && latest.length > 0) {
          setFeaturedNews(latest[0])
        }
      } catch (error) {
        console.error('Error loading featured news:', error)
      } finally {
        setLoadingFeatured(false)
      }
    }
    loadFeaturedNews()
  }, [])

  // Load berita list dengan filter dan pagination
  useEffect(() => {
    loadBerita()
    // Update URL params
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (sortBy !== 'terbaru') params.set('sort', sortBy)
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params)
  }, [debouncedSearch, sortBy, page])

  const loadBerita = async () => {
    try {
      setLoading(true)
      const result = await beritaService.getAll({
        page,
        limit: 12,
        search: debouncedSearch,
        publishedOnly: true,
        sortBy: sortBy,
      })
      setBerita(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading berita:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value) => {
    setSearch(value)
    setPage(1) // Reset ke halaman pertama saat search
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setPage(1) // Reset ke halaman pertama saat sort berubah
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show loading hanya saat initial load
  if (loading && berita.length === 0 && !featuredNews) {
    return <Loading />
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Gradient (sama seperti landing page) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-50 to-[#F8F9FA]"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute right-0 top-0 bottom-0 w-[800px] h-full bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <BeritaHeroSection stats={stats} />

        {/* Search & Filter Section */}
        <BeritaSearchFilter
          search={search}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Featured News Section */}
        {!loadingFeatured && featuredNews && (
          <FeaturedNewsSection berita={featuredNews} />
        )}

        {/* News Grid Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && berita.length === 0 ? (
              <Loading />
            ) : berita.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Daftar Berita</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {berita.map((item) => (
                    <BeritaCard key={item.id} berita={item} />
                  ))}
                </div>

                {/* Pagination */}
                <BeritaPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <BeritaEmptyState searchQuery={debouncedSearch} />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

