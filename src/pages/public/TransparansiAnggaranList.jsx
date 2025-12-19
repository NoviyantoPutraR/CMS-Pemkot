import { useState, useEffect, useMemo } from 'react'
import { transparansiAnggaranService } from '../../services/transparansiAnggaranService'
import TransparansiHeroSection from '../../components/public/sections/TransparansiHeroSection'
import TransparansiFilterSection from '../../components/public/sections/TransparansiFilterSection'
import TransparansiCard from '../../components/public/TransparansiCard'
import TransparansiEmptyState from '../../components/public/sections/TransparansiEmptyState'
import TransparansiSkeleton from '../../components/public/sections/TransparansiSkeleton'
import Loading from '../../components/shared/Loading'

export default function TransparansiAnggaranList() {
  const [anggaran, setAnggaran] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(null)
  const [sortBy, setSortBy] = useState('terbaru')

  // Scroll ke atas saat masuk ke halaman
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Load data
  useEffect(() => {
    loadAnggaran()
  }, [])

  const loadAnggaran = async () => {
    try {
      setLoading(true)
      const data = await transparansiAnggaranService.getAll({ publishedOnly: true })
      setAnggaran(data || [])
    } catch (error) {
      console.error('Error loading transparansi anggaran:', error)
    } finally {
      setLoading(false)
    }
  }

  // Extract available years
  const availableYears = useMemo(() => {
    const years = anggaran.map((item) => item.tahun).filter(Boolean)
    return [...new Set(years)].sort((a, b) => b - a) // Sort descending
  }, [anggaran])

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = anggaran

    // Filter by year
    if (selectedYear) {
      filtered = filtered.filter((item) => item.tahun === parseInt(selectedYear))
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'terbaru') {
        return b.tahun - a.tahun // Descending (newest first)
      } else {
        return a.tahun - b.tahun // Ascending (oldest first)
      }
    })

    return sorted
  }, [anggaran, selectedYear, sortBy])

  const handleYearChange = (year) => {
    setSelectedYear(year ? parseInt(year) : null)
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
  }

  // Show loading hanya saat initial load
  if (loading && anggaran.length === 0) {
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
        <TransparansiHeroSection />

        {/* Filter Section */}
        <TransparansiFilterSection
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          availableYears={availableYears}
        />

        {/* Daftar Transparansi Anggaran */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <TransparansiSkeleton />
            ) : filteredAndSortedData.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Daftar Transparansi Anggaran
                </h2>
                <div className="space-y-6">
                  {filteredAndSortedData.map((item, index) => (
                    <TransparansiCard key={item.id} anggaran={item} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <TransparansiEmptyState hasFilter={!!selectedYear} />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

