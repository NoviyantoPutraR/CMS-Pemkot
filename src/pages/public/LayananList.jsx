import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { layananService } from '../../services/layananService'
import LayananCard from '../../components/public/LayananCard'
import LayananHeroSection from '../../components/public/sections/LayananHeroSection'
import LayananSearchFilter from '../../components/public/sections/LayananSearchFilter'
import LayananSkeleton from '../../components/public/sections/LayananSkeleton'
import LayananEmptyState from '../../components/public/sections/LayananEmptyState'
import LayananPagination from '../../components/public/sections/LayananPagination'
import { useDebounce } from '../../hooks/useDebounce'

export default function LayananList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [layanan, setLayanan] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'terbaru')
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const debouncedSearch = useDebounce(search, 500)

  // Load stats untuk hero section
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await layananService.getPublicStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    loadStats()
  }, [])

  // Load layanan list dengan filter dan pagination
  useEffect(() => {
    loadLayanan()
    // Update URL params
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (sortBy !== 'terbaru') params.set('sort', sortBy)
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params)
  }, [debouncedSearch, sortBy, page])

  const loadLayanan = async () => {
    try {
      setLoading(true)
      const result = await layananService.getAll({
        page,
        limit: 12,
        search: debouncedSearch,
        publishedOnly: true,
        sortBy: sortBy,
      })
      setLayanan(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading layanan:', error)
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
        <LayananHeroSection stats={stats} />

        {/* Search & Filter Section */}
        <LayananSearchFilter
          search={search}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Layanan Grid Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && layanan.length === 0 ? (
              <LayananSkeleton count={6} />
            ) : layanan.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Daftar Layanan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {layanan.map((item, index) => (
                    <LayananCard key={item.id} layanan={item} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                <LayananPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <LayananEmptyState 
                searchQuery={debouncedSearch}
              />
            )}
          </div>
        </section>

        {/* Metadata Section */}
        {layanan.length > 0 && (
          <section className="py-6 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-sm text-gray-500 text-center">
                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

