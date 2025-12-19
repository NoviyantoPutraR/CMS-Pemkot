import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { sosialMediaService } from '../../services/sosialMediaService'
import SosialMediaHeroSection from '../../components/public/sections/SosialMediaHeroSection'
import SocialMediaCard from '../../components/public/SocialMediaCard'
import SosialMediaEmptyState from '../../components/public/sections/SosialMediaEmptyState'
import { Shield } from 'lucide-react'

export default function SosialMedia() {
  const [socialMediaList, setSocialMediaList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSocialMedia()
  }, [])

  const loadSocialMedia = async () => {
    try {
      setLoading(true)
      const data = await sosialMediaService.getAll()
      // Filter hanya yang aktif
      const activeSocialMedia = data.filter(item => item.aktif === true)
      setSocialMediaList(activeSocialMedia)
    } catch (error) {
      console.error('Error loading social media:', error)
    } finally {
      setLoading(false)
    }
  }

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 animate-pulse">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-200"></div>
        <div className="space-y-2 w-full">
          <div className="h-5 bg-gray-200 rounded mx-auto w-24"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-32"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero Section */}
      <SosialMediaHeroSection />

      {/* Main Content */}
      <section className="relative py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Credibility Text */}
          {!loading && socialMediaList.length > 0 && (
            <motion.div
              className="mb-8 lg:mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 text-gray-600 text-sm lg:text-base bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary-blue" />
                <span>
                  Semua akun di bawah ini merupakan kanal resmi Pemerintah Provinsi Jawa Timur
                </span>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && socialMediaList.length === 0 && (
            <SosialMediaEmptyState />
          )}

          {/* Social Media Grid */}
          {!loading && socialMediaList.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {socialMediaList.map((socialMedia, index) => (
                <SocialMediaCard
                  key={socialMedia.id}
                  platform={socialMedia.platform}
                  url={socialMedia.url}
                  ikon_url={socialMedia.ikon_url}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

