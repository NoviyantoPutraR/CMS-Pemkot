import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../../components/public/landing/Header'
import HeroSection from '../../components/public/landing/HeroSection'
import HighlightNewsSection from '../../components/public/landing/HighlightNewsSection'
import TabsSection from '../../components/public/landing/TabsSection'
import ServicesGrid from '../../components/public/landing/ServicesGrid'
import TransparencySection from '../../components/public/landing/TransparencySection'
import VisionSection from '../../components/public/landing/VisionSection'
import QuickAccessSection from '../../components/public/landing/QuickAccessSection'
import Footer from '../../components/public/landing/Footer'
import { pengaturanSitusService } from '../../services/pengaturanSitusService'
import { beritaService } from '../../services/beritaService'

export default function Home() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('layanan')
  
  // State untuk homepage data (loaded in parallel)
  const [heroData, setHeroData] = useState({
    nama_situs: '',
    deskripsi_situs: '',
  })
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)

  // Parallelize API calls untuk faster LCP
  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        setLoading(true)
        // Load hero data dan berita data secara parallel
        const [heroDataResult, newsDataResult] = await Promise.all([
          pengaturanSitusService.getHeroData().catch((error) => {
            console.error('Error loading hero data:', error)
            return { nama_situs: '', deskripsi_situs: '' }
          }),
          beritaService.getLatest(6).catch((error) => {
            console.error('Error loading berita:', error)
            return []
          }),
        ])
        
        setHeroData(heroDataResult)
        setNewsData(newsDataResult)
      } catch (error) {
        console.error('Error loading homepage data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadHomepageData()
  }, [])

  // Scroll to hero when navigating from other pages
  useEffect(() => {
    // Check if we came from another page (not initial load)
    const fromOtherPage = sessionStorage.getItem('navigateToHome')
    
    if (fromOtherPage === 'true') {
      // Clear the flag
      sessionStorage.removeItem('navigateToHome')
      
      // Scroll to top first
      window.scrollTo({ top: 0, behavior: 'instant' })
      
      // Then scroll to hero
      const timer = setTimeout(() => {
        const element = document.getElementById('hero')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 200)
      
      return () => clearTimeout(timer)
    }
  }, [location.pathname])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Gradient Menyambung dari atas ke bawah */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradasi utama dari atas ke bawah */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-50 to-[#F8F9FA]"></div>
        {/* Dekorasi lingkaran */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute right-0 top-0 bottom-0 w-[800px] h-full bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 -translate-x-1/4"></div>
      </div>
      <div className="relative z-10">
      <Header />
      <HeroSection heroData={heroData} loading={loading} />
      <section className="relative overflow-visible">
        <div className="relative z-10">
          <HighlightNewsSection newsData={newsData} loading={loading} />
          <TabsSection activeTab={activeTab} onTabChange={setActiveTab} />
          <ServicesGrid activeTab={activeTab} />
        </div>
      </section>
      <TransparencySection />
      <VisionSection />
      <QuickAccessSection />
      <Footer />
      </div>
    </div>
  )
}
