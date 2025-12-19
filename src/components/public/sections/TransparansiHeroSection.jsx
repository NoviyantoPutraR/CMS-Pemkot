import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ChevronRight } from 'lucide-react'

export default function TransparansiHeroSection() {
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
            <li className="text-gray-900 font-medium">Transparansi</li>
          </ol>
        </motion.nav>

        {/* Hero Content */}
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-poppins text-4xl lg:text-5xl font-bold mb-4 leading-tight text-primary-blue">
            Transparansi Anggaran
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Akses informasi anggaran Pemerintah Provinsi Jawa Timur secara transparan dan akurat. 
            Unduh dokumen anggaran dalam format Excel dan PDF untuk tahun-tahun yang tersedia.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

