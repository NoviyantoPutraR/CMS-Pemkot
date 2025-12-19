import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { wisataService } from '../../services/wisataService'
import WisataCard from '../../components/public/WisataCard'
import WisataHeroSection from '../../components/public/sections/WisataHeroSection'
import WisataSearchFilter from '../../components/public/sections/WisataSearchFilter'
import WisataSkeleton from '../../components/public/sections/WisataSkeleton'
import WisataEmptyState from '../../components/public/sections/WisataEmptyState'
import WisataPagination from '../../components/public/sections/WisataPagination'
import { useDebounce } from '../../hooks/useDebounce'

export default function WisataList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [wisata, setWisata] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
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
        const statsData = await wisataService.getPublicStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    loadStats()
  }, [])

  // Load wisata list dengan filter dan pagination
  useEffect(() => {
    loadWisata()
    // Update URL params
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (sortBy !== 'terbaru') params.set('sort', sortBy)
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params)
  }, [debouncedSearch, sortBy, page])

  const loadWisata = async () => {
    try {
      setLoading(true)
      const result = await wisataService.getAll({
        page,
        limit: 12,
        search: debouncedSearch,
        publishedOnly: true,
        sortBy: sortBy,
      })
      setWisata(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading wisata:', error)
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
        <WisataHeroSection stats={stats} />

        {/* Search & Filter Section */}
        <WisataSearchFilter
          search={search}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Wisata Grid Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && wisata.length === 0 ? (
              <WisataSkeleton count={6} />
            ) : wisata.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Daftar Destinasi Wisata</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wisata.map((item, index) => (
                    <WisataCard key={item.id} wisata={item} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                <WisataPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <WisataEmptyState 
                searchQuery={debouncedSearch}
              />
            )}
          </div>
        </section>

        {/* Metadata Section */}
        {wisata.length > 0 && (
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

