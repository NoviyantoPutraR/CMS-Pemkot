import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { agendaKotaService } from '../../services/agendaKotaService'
import AgendaCard from '../../components/public/AgendaCard'
import AgendaHeroSection from '../../components/public/sections/AgendaHeroSection'
import AgendaSearchFilter from '../../components/public/sections/AgendaSearchFilter'
import AgendaPagination from '../../components/public/sections/AgendaPagination'
import AgendaEmptyState from '../../components/public/sections/AgendaEmptyState'
import Loading from '../../components/shared/Loading'
import { useDebounce } from '../../hooks/useDebounce'

export default function AgendaList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [agenda, setAgenda] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || 'semua')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'semua')
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [lastUpdated, setLastUpdated] = useState(null)
  const debouncedSearch = useDebounce(search, 500)

  // Load stats untuk hero section
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await agendaKotaService.getStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    loadStats()
  }, [])

  // Helper function untuk menghitung range tanggal
  const getDateRange = (filter) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    switch (filter) {
      case 'hari-ini':
        const startToday = new Date(now)
        const endToday = new Date(now)
        endToday.setHours(23, 59, 59, 999)
        return { start: startToday.toISOString(), end: endToday.toISOString() }
      
      case 'minggu-ini':
        const startWeek = new Date(now)
        const dayOfWeek = startWeek.getDay()
        const diff = startWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Monday
        startWeek.setDate(diff)
        const endWeek = new Date(now)
        endWeek.setDate(diff + 6)
        endWeek.setHours(23, 59, 59, 999)
        return { start: startWeek.toISOString(), end: endWeek.toISOString() }
      
      case 'bulan-ini':
        const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        endMonth.setHours(23, 59, 59, 999)
        return { start: startMonth.toISOString(), end: endMonth.toISOString() }
      
      default:
        return null
    }
  }

  // Helper function untuk menentukan status berdasarkan tanggal
  const getStatusFromDate = (agendaItem) => {
    const now = new Date()
    const tanggalMulai = new Date(agendaItem.tanggal_mulai)
    const tanggalSelesai = agendaItem.tanggal_selesai ? new Date(agendaItem.tanggal_selesai) : null

    if (agendaItem.status === 'dibatalkan') return 'dibatalkan'
    if (agendaItem.status === 'selesai') return 'selesai'
    if (tanggalSelesai && now > tanggalSelesai) return 'selesai'
    if (now >= tanggalMulai && (!tanggalSelesai || now <= tanggalSelesai)) return 'berlangsung'
    return 'akan-datang'
  }

  // Load agenda list dengan filter dan pagination
  useEffect(() => {
    loadAgenda()
    // Update URL params
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (dateFilter !== 'semua') params.set('date', dateFilter)
    if (statusFilter !== 'semua') params.set('status', statusFilter)
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params)
  }, [debouncedSearch, dateFilter, statusFilter, page])

  const loadAgenda = async () => {
    try {
      setLoading(true)
      
      // Get all published agenda first
      const result = await agendaKotaService.getAll({
        page: 1,
        limit: 1000, // Get all to filter client-side
        search: debouncedSearch,
        publishedOnly: true,
      })

      let filteredAgenda = result.data || []

      // Apply date filter
      if (dateFilter !== 'semua') {
        const dateRange = getDateRange(dateFilter)
        if (dateRange) {
          filteredAgenda = filteredAgenda.filter((item) => {
            const tanggalMulai = new Date(item.tanggal_mulai)
            return tanggalMulai >= new Date(dateRange.start) && tanggalMulai <= new Date(dateRange.end)
          })
        }
      }

      // Apply status filter
      if (statusFilter !== 'semua') {
        filteredAgenda = filteredAgenda.filter((item) => {
          const itemStatus = getStatusFromDate(item)
          return itemStatus === statusFilter
        })
      }

      // Sort by tanggal_mulai ascending
      filteredAgenda.sort((a, b) => {
        return new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai)
      })

      // Apply pagination
      const limit = 12
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedAgenda = filteredAgenda.slice(startIndex, endIndex)
      const totalFiltered = filteredAgenda.length
      const totalPagesCount = Math.ceil(totalFiltered / limit)

      setAgenda(paginatedAgenda)
      setTotalPages(totalPagesCount)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading agenda:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleDateFilterChange = (value) => {
    setDateFilter(value)
    setPage(1)
  }

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show loading hanya saat initial load
  if (loading && agenda.length === 0 && !stats) {
    return <Loading />
  }

  const hasFilters = dateFilter !== 'semua' || statusFilter !== 'semua'

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
        <AgendaHeroSection stats={stats} />

        {/* Search & Filter Section */}
        <AgendaSearchFilter
          search={search}
          onSearchChange={handleSearchChange}
          dateFilter={dateFilter}
          onDateFilterChange={handleDateFilterChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />

        {/* Agenda Grid Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && agenda.length === 0 ? (
              <Loading />
            ) : agenda.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Daftar Agenda</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agenda.map((item) => (
                    <AgendaCard key={item.id} agenda={item} />
                  ))}
                </div>

                {/* Pagination */}
                <AgendaPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />

                {/* Metadata: Terakhir diperbarui */}
                {lastUpdated && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                      Terakhir diperbarui: {lastUpdated.toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Asia/Jakarta'
                      })}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <AgendaEmptyState 
                searchQuery={debouncedSearch} 
                hasFilters={hasFilters}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

