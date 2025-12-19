import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { artikelService } from '../../services/artikelService'
import ArtikelCard from '../../components/public/ArtikelCard'
import ArtikelHeroSection from '../../components/public/sections/ArtikelHeroSection'
import ArtikelSearchFilter from '../../components/public/sections/ArtikelSearchFilter'
import BeritaPagination from '../../components/public/sections/BeritaPagination'
import ArtikelEmptyState from '../../components/public/sections/ArtikelEmptyState'
import Loading from '../../components/shared/Loading'
import { useDebounce } from '../../hooks/useDebounce'

export default function ArtikelList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [artikel, setArtikel] = useState([])
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
        const statsData = await artikelService.getStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    loadStats()
  }, [])

  // Load artikel list dengan filter dan pagination
  useEffect(() => {
    loadArtikel()
    // Update URL params
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (sortBy !== 'terbaru') params.set('sort', sortBy)
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params)
  }, [debouncedSearch, sortBy, page])

  const loadArtikel = async () => {
    try {
      setLoading(true)
      const result = await artikelService.getAll({
        page,
        limit: 12,
        search: debouncedSearch,
        publishedOnly: true,
        sortBy: sortBy,
      })
      setArtikel(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading artikel:', error)
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
  if (loading && artikel.length === 0) {
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
        <ArtikelHeroSection stats={stats} />

        {/* Search & Filter Section */}
        <ArtikelSearchFilter
          search={search}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Artikel Grid Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && artikel.length === 0 ? (
              <Loading />
            ) : artikel.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Daftar Artikel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artikel.map((item) => (
                    <ArtikelCard key={item.id} artikel={item} />
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
              <ArtikelEmptyState searchQuery={debouncedSearch} />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

