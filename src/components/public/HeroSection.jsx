import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/berita?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="relative pt-0 pb-20 md:pb-32 bg-white overflow-hidden">
      {/* Organic Blue Blob Shapes - Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-blue opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-container mx-auto px-6 md:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Left */}
          <div className="max-w-[600px]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight uppercase tracking-tight text-primary-blue">
              Selamat Datang di Portal Pemerintah Kota
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-darkGray">
              Informasi terbaru dan layanan publik untuk masyarakat
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita, artikel, atau layanan..."
                  className="w-full rounded-full px-5 py-3 pr-12 text-neutral-darkGray placeholder:text-neutral-gray600 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 shadow-md text-base border border-neutral-gray200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray600 hover:text-primary-blue transition-colors"
                  aria-label="Search"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Hero Image in Circular Frame - Right */}
          <div className="hidden lg:block relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Circular Frame with Decorative Elements */}
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 rounded-full border-8 border-primary-blue opacity-20"></div>
                <div className="absolute inset-4 rounded-full bg-neutral-lightGray flex items-center justify-center overflow-hidden">
                  {/* Placeholder for hero image */}
                  <div className="w-full h-full bg-gradient-to-br from-primary-blue/20 to-secondary-yellow/20 flex items-center justify-center">
                    <svg className="w-32 h-32 text-primary-blue opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

