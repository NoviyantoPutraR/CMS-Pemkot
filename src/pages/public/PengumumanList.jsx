import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { pengumumanService } from '../../services/pengumumanService'
import PengumumanCard from '../../components/public/PengumumanCard'
import PengumumanHeroSection from '../../components/public/sections/PengumumanHeroSection'
import PengumumanSearchFilter from '../../components/public/sections/PengumumanSearchFilter'
import PengumumanPagination from '../../components/public/sections/PengumumanPagination'
import PengumumanEmptyState from '../../components/public/sections/PengumumanEmptyState'
import Loading from '../../components/shared/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import { motion } from 'framer-motion'

export default function PengumumanList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [pengumuman, setPengumuman] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [periodFilter, setPeriodFilter] = useState(searchParams.get('periode') || '')
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
        const statsData = await pengumumanService.getPublicStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    loadStats()
  }, [])

  // Load pengumuman list dengan filter dan pagination
  useEffect(() => {
    loadPengumuman()
    // Update URL params
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (statusFilter) params.set('status', statusFilter)
    if (periodFilter) params.set('periode', periodFilter)
    if (sortBy !== 'terbaru') params.set('sort', sortBy)
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params)
  }, [debouncedSearch, statusFilter, periodFilter, sortBy, page])

  const loadPengumuman = async () => {
    try {
      setLoading(true)
      const result = await pengumumanService.getAllPublic({
        page,
        limit: 12,
        search: debouncedSearch,
        statusFilter: statusFilter || '',
        periodFilter: periodFilter || '',
        sortBy: sortBy,
      })
      setPengumuman(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading pengumuman:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value) => {
    setSearch(value)
    setPage(1) // Reset ke halaman pertama saat search
  }

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
    setPage(1) // Reset ke halaman pertama saat filter berubah
  }

  const handlePeriodFilterChange = (value) => {
    setPeriodFilter(value)
    setPage(1) // Reset ke halaman pertama saat filter berubah
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
  if (loading && pengumuman.length === 0) {
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
        <PengumumanHeroSection stats={stats} />

        {/* Search & Filter Section */}
        <PengumumanSearchFilter
          search={search}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          periodFilter={periodFilter}
          onPeriodFilterChange={handlePeriodFilterChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Pengumuman Grid Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && pengumuman.length === 0 ? (
              <Loading />
            ) : pengumuman.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Daftar Pengumuman</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pengumuman.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <PengumumanCard pengumuman={item} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <PengumumanPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <PengumumanEmptyState searchQuery={debouncedSearch} />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

