import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { perangkatDaerahService } from '../../services/perangkatDaerahService'
import PerangkatDaerahCard from '../../components/public/PerangkatDaerahCard'
import PerangkatDaerahHeroSection from '../../components/public/sections/PerangkatDaerahHeroSection'
import PerangkatDaerahSearchFilter from '../../components/public/sections/PerangkatDaerahSearchFilter'
import PerangkatDaerahSkeleton from '../../components/public/sections/PerangkatDaerahSkeleton'
import PerangkatDaerahEmptyState from '../../components/public/sections/PerangkatDaerahEmptyState'
import PerangkatDaerahPagination from '../../components/public/sections/PerangkatDaerahPagination'
import { useDebounce } from '../../hooks/useDebounce'

export default function PerangkatDaerahList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [perangkat, setPerangkat] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'urutan')
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const debouncedSearch = useDebounce(search, 500)

  // Load stats untuk hero section
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [total, aktif] = await Promise.all([
          perangkatDaerahService.getCount(),
          perangkatDaerahService.getActiveCount(),
        ])
        console.log('Stats loaded:', { total, aktif })
        setStats({
          total: total || 0,
          aktif: aktif || 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        setStats({ total: 0, aktif: 0 })
      }
    }
    loadStats()
  }, [])

  // Load perangkat daerah list dengan filter dan pagination
  useEffect(() => {
    loadPerangkat()
    // Update URL params
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (sortBy !== 'urutan') params.set('sort', sortBy)
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params)
  }, [debouncedSearch, sortBy, page])

  const loadPerangkat = async () => {
    try {
      setLoading(true)
      const result = await perangkatDaerahService.getAll({
        page,
        limit: 12,
        search: debouncedSearch,
        aktifOnly: true, // Hanya perangkat aktif
      })
      
      // Sort data berdasarkan sortBy
      let sortedData = [...(result.data || [])]
      if (sortBy === 'nama') {
        // Sort berdasarkan nama perangkat (A-Z)
        sortedData.sort((a, b) => a.nama_perangkat.localeCompare(b.nama_perangkat, 'id'))
      }
      // Default: urutan (sudah di-sort dari service berdasarkan urutan)
      // Tidak perlu sort lagi karena sudah di-sort dari service
      
      setPerangkat(sortedData)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading perangkat daerah:', error)
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
        <PerangkatDaerahHeroSection stats={stats} />

        {/* Search & Filter Section */}
        <PerangkatDaerahSearchFilter
          search={search}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Perangkat Daerah Grid Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && perangkat.length === 0 ? (
              <PerangkatDaerahSkeleton count={6} />
            ) : perangkat.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Daftar Perangkat Daerah</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {perangkat.map((item, index) => (
                    <PerangkatDaerahCard key={item.id} perangkat={item} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                <PerangkatDaerahPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <PerangkatDaerahEmptyState 
                searchQuery={debouncedSearch}
              />
            )}
          </div>
        </section>

        {/* Metadata Section */}
        {perangkat.length > 0 && (
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

