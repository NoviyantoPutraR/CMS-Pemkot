import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { videoService } from '../../services/videoService'
import VideoCard from '../../components/public/VideoCard'
import VideoHeroSection from '../../components/public/sections/VideoHeroSection'
import VideoSearchFilter from '../../components/public/sections/VideoSearchFilter'
import VideoEmptyState from '../../components/public/sections/VideoEmptyState'
import BeritaPagination from '../../components/public/sections/BeritaPagination'
import Loading from '../../components/shared/Loading'
import { useDebounce } from '../../hooks/useDebounce'

export default function VideoList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [videos, setVideos] = useState([])
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
        const statsData = await videoService.getStats()
        setStats(statsData)
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }
    loadStats()
  }, [])

  // Load video list dengan filter dan pagination
  useEffect(() => {
    loadVideos()
    // Update URL params
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (sortBy !== 'terbaru') params.set('sort', sortBy)
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params)
  }, [debouncedSearch, sortBy, page])

  const loadVideos = async () => {
    try {
      setLoading(true)
      const result = await videoService.getAll({
        page,
        limit: 12,
        search: debouncedSearch,
        publishedOnly: true,
        sortBy: sortBy,
      })
      setVideos(result.data)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading videos:', error)
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
  if (loading && videos.length === 0) {
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
        <VideoHeroSection stats={stats} />

        {/* Search & Filter Section */}
        <VideoSearchFilter
          search={search}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Video Grid Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading && videos.length === 0 ? (
              <Loading />
            ) : videos.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Daftar Video</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} />
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
              <VideoEmptyState searchQuery={debouncedSearch} />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

