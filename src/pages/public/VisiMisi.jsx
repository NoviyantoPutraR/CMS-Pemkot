import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { halamanService } from '../../services/halamanService'
import Loading from '../../components/shared/Loading'
import Breadcrumb from '../../components/shared/Breadcrumb'
import { STATIC_PAGES } from '../../utils/constants'
import { formatDate } from '../../utils/formatters'

export default function VisiMisi() {
  const [halaman, setHalaman] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Scroll ke atas saat masuk ke halaman
    window.scrollTo({ top: 0, behavior: 'smooth' })
    loadHalaman()
  }, [])

  const loadHalaman = async () => {
    try {
      setLoading(true)
      const data = await halamanService.getBySlug(STATIC_PAGES.VISI_MISI)
      setHalaman(data)
    } catch (error) {
      console.error('Error loading halaman:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!halaman) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Halaman tidak ditemukan</p>
      </div>
    )
  }

  // Ambil visi dan misi dari database
  const visi = halaman?.visi || ''
  const misi = halaman?.misi && Array.isArray(halaman.misi) ? halaman.misi : []

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Profil', href: '/tentang' },
    { label: 'Visi & Misi', href: '/visi-misi', current: true }
  ]

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Gradient (sama seperti halaman transparansi) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-50 to-[#F8F9FA]"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute right-0 top-0 bottom-0 w-[800px] h-full bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 -translate-x-1/4"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Breadcrumb items={breadcrumbItems} homeHref="/" />
          </motion.div>

          {/* Hero Content */}
          <div className="max-w-4xl">
            <motion.h1
              className="font-poppins text-4xl lg:text-5xl font-bold text-primary-blue mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              Visi & Misi
            </motion.h1>
            <motion.p
              className="text-lg text-gray-700 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Arah pembangunan dan tujuan Pemerintah Provinsi Jawa Timur dalam mewujudkan masyarakat yang adil, sejahtera, unggul, dan berdaulat.
            </motion.p>

            {/* Hero Card */}
            <motion.div
              className="bg-white rounded-lg shadow-sm p-6 max-w-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <p className="text-gray-700 leading-relaxed">
                Arah Pembangunan dan Tujuan Pemerintah Provinsi Jawa Timur
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Visi */}
      <section className="py-20 bg-white -mt-px">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-poppins text-3xl lg:text-4xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Visi
          </motion.h2>
          
          {visi && (
            <motion.div
              className="bg-white border-l-4 border-[#0052FF] rounded-lg shadow-lg p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="text-xl text-gray-800 leading-relaxed text-justify">
                {visi}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Section Misi */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-poppins text-3xl lg:text-4xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Misi
          </motion.h2>
          
          {misi.length > 0 && (
            <div className="space-y-6">
              {misi.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-6 flex gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0052FF] text-white flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <p className="text-lg text-gray-800 leading-relaxed text-justify flex-1 pt-1">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Metadata */}
      {halaman.diperbarui_pada && (
        <motion.section
          className="py-8 bg-white border-t border-gray-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-500 text-center">
              Terakhir diperbarui: {formatDate(halaman.diperbarui_pada)}
            </p>
          </div>
        </motion.section>
      )}
      </div>
    </div>
  )
}

