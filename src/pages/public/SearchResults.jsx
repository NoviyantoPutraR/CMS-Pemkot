import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { searchService } from '../../services/searchService'
import BeritaCard from '../../components/public/BeritaCard'
import ArtikelCard from '../../components/public/ArtikelCard'
import LayananCard from '../../components/public/LayananCard'
import SearchAutocomplete from '../../components/public/SearchAutocomplete'
import Loading from '../../components/shared/Loading'
import { useDebounce } from '../../hooks/useDebounce'

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState({
    berita: [],
    artikel: [],
    layanan: [],
    total: 0
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const debouncedQuery = useDebounce(searchQuery, 500)

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // Update search query from URL
  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  // Perform search
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim()) {
      performSearch(debouncedQuery)
    } else {
      setResults({ berita: [], artikel: [], layanan: [], total: 0 })
    }
  }, [debouncedQuery])

  const performSearch = async (searchTerm) => {
    try {
      setLoading(true)
      const searchResults = await searchService.searchAll(searchTerm, { limit: 30 })
      setResults(searchResults)
      
      // Update URL without triggering navigation
      const params = new URLSearchParams()
      params.set('q', searchTerm)
      setSearchParams(params, { replace: true })
    } catch (error) {
      console.error('Error performing search:', error)
      setResults({ berita: [], artikel: [], layanan: [], total: 0 })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      performSearch(query)
    }
  }

  const filteredResults = {
    berita: activeTab === 'all' || activeTab === 'berita' ? results.berita : [],
    artikel: activeTab === 'all' || activeTab === 'artikel' ? results.artikel : [],
    layanan: activeTab === 'all' || activeTab === 'layanan' ? results.layanan : []
  }

  const totalFiltered = filteredResults.berita.length + filteredResults.artikel.length + filteredResults.layanan.length

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F8F9FA]">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-50 to-[#F8F9FA]"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute right-0 top-0 bottom-0 w-[800px] h-full bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10">
        {/* Search Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              className="text-3xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Hasil Pencarian
            </motion.h1>
            
            <div className="max-w-2xl">
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Apa yang Anda cari di Jawa Timur?"
              />
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loading />
              </div>
            ) : !query ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Masukkan kata kunci untuk mencari</p>
              </div>
            ) : totalFiltered === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">Tidak ada hasil ditemukan untuk "{query}"</p>
                <p className="text-gray-500">Coba gunakan kata kunci yang berbeda</p>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Semua ({results.total})
                  </button>
                  {results.berita.length > 0 && (
                    <button
                      onClick={() => setActiveTab('berita')}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'berita'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Berita ({results.berita.length})
                    </button>
                  )}
                  {results.artikel.length > 0 && (
                    <button
                      onClick={() => setActiveTab('artikel')}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'artikel'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Artikel ({results.artikel.length})
                    </button>
                  )}
                  {results.layanan.length > 0 && (
                    <button
                      onClick={() => setActiveTab('layanan')}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'layanan'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Layanan ({results.layanan.length})
                    </button>
                  )}
                </div>

                {/* Results Grid */}
                <div className="space-y-12">
                  {/* Berita Results */}
                  {filteredResults.berita.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResults.berita.map((item) => (
                          <BeritaCard key={item.id} berita={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Artikel Results */}
                  {filteredResults.artikel.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResults.artikel.map((item) => (
                          <ArtikelCard key={item.id} artikel={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Layanan Results */}
                  {filteredResults.layanan.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Layanan</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResults.layanan.map((item, index) => (
                          <LayananCard key={item.id} layanan={item} index={index} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

