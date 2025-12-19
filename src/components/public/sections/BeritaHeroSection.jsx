import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ChevronRight } from 'lucide-react'

export default function BeritaHeroSection({ stats }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient dengan Decorative Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradasi utama dari atas ke bawah */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-50 to-[#F8F9FA]"></div>
        {/* Dekorasi lingkaran kiri */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-40"></div>
        {/* Dekorasi lingkaran kanan */}
        <div className="absolute right-0 top-0 bottom-0 w-[800px] h-full bg-gradient-to-l from-blue-200 via-blue-100 to-transparent rounded-full blur-3xl opacity-30 -translate-x-1/4"></div>
        {/* Wave pattern dengan opacity rendah */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-100/20 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Breadcrumb */}
        <motion.nav
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link to="/" className="flex items-center hover:text-primary-blue transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Beranda
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li className="text-gray-900 font-medium">Berita</li>
          </ol>
        </motion.nav>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-poppins text-4xl lg:text-5xl font-bold mb-4 leading-tight text-primary-blue">
              Berita & Informasi Jawa Timur
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl">
              Update resmi kebijakan, agenda, dan informasi publik Pemerintah Provinsi Jawa Timur
            </p>
          </motion.div>

          {/* Stats Card (Optional) */}
          {stats && (
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-card shadow-card p-6 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Statistik</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-primary-blue">{stats.total || 0}</p>
                    <p className="text-sm text-gray-600">Total Berita</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-2xl font-bold text-primary-blue">{stats.thisMonth || 0}</p>
                    <p className="text-sm text-gray-600">Berita Bulan Ini</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

