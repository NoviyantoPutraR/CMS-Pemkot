import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { halamanService } from '../../services/halamanService'
import Loading from '../../components/shared/Loading'
import Breadcrumb from '../../components/shared/Breadcrumb'
import { STATIC_PAGES } from '../../utils/constants'
import { formatDate } from '../../utils/formatters'

export default function Tentang() {
  const [halaman, setHalaman] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHalaman()
  }, [])

  const loadHalaman = async () => {
    try {
      setLoading(true)
      const data = await halamanService.getBySlug(STATIC_PAGES.TENTANG)
      setHalaman(data)
    } catch (error) {
      console.error('Error loading halaman:', error)
    } finally {
      setLoading(false)
    }
  }

  // Breadcrumb items: Beranda / Profil / Tentang Kami
  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Profil', href: '#' },
    { label: 'Tentang Kami', href: '/tentang', current: true }
  ]

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

  // Ambil tugas dan fungsi dari database
  const tugasDanFungsi = halaman?.tugas_dan_fungsi && Array.isArray(halaman.tugas_dan_fungsi) 
    ? halaman.tugas_dan_fungsi 
    : []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Breadcrumb items={breadcrumbItems} homeHref="/" />
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-primary-blue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              Tentang Kami
            </motion.h1>
            <motion.p
              className="text-xl lg:text-2xl mb-8 text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Profil dan Peran Pemerintah Provinsi Kerja Baik dalam melayani masyarakat dan membangun daerah
            </motion.p>

            {/* Hero Card */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <p className="text-[#0052FF] font-medium text-lg">
                Profil dan Peran Pemerintah Provinsi Kerja Baik
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section: Profil Singkat */}
        <section className="mb-20">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold mb-8 text-[#333333]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Profil Singkat
          </motion.h2>
          <motion.div
            className="bg-white rounded-lg shadow-md p-8 lg:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="prose prose-lg max-w-none prose-p:text-[#333333] prose-p:leading-relaxed prose-p:text-base prose-p:text-justify">
              {halaman.konten ? (
                <div dangerouslySetInnerHTML={{ __html: halaman.konten }} className="[&_p]:text-justify" />
              ) : (
                <>
                  <p className="text-base leading-relaxed text-[#333333] text-justify mb-4">
                    Pemerintah Provinsi Jawa Timur merupakan lembaga eksekutif di tingkat provinsi yang bertanggung jawab
                    atas penyelenggaraan pemerintahan daerah. Sebagai salah satu provinsi terbesar di Indonesia,
                    Jawa Timur memiliki peran strategis dalam pembangunan nasional.
                  </p>
                  <p className="text-base leading-relaxed text-[#333333] text-justify">
                    Pemerintah Provinsi Jawa Timur berkedudukan sebagai instansi vertikal yang melaksanakan tugas
                    pemerintahan daerah sesuai dengan otonomi daerah dan tugas pembantuan. Kami berkomitmen untuk
                    memberikan pelayanan terbaik kepada masyarakat dan mendorong pembangunan yang berkelanjutan di seluruh
                    wilayah Jawa Timur.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </section>

        {/* Section: Tugas & Fungsi */}
        {tugasDanFungsi.length > 0 && (
          <section className="mb-20">
            <motion.h2
              className="text-3xl lg:text-4xl font-bold mb-8 text-[#333333]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Tugas dan Fungsi
            </motion.h2>
            <motion.div
              className="bg-white rounded-lg shadow-md p-8 lg:p-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ul className="space-y-6">
                {tugasDanFungsi.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#0052FF] mt-2 mr-4"></div>
                    <p className="text-base leading-relaxed text-[#333333] flex-1">
                      {item}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </section>
        )}

        {/* Section: Struktur Organisasi (Optional - dapat ditampilkan jika ada data) */}
        {/* 
        <section className="mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-[#333333]">
            Struktur Organisasi
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8 lg:p-10">
            <p className="text-base leading-relaxed text-[#333333] mb-4">
              Struktur organisasi Pemerintah Provinsi Jawa Timur terdiri dari berbagai perangkat daerah
              yang bertugas melaksanakan fungsi pemerintahan sesuai dengan bidang masing-masing.
            </p>
            <p className="text-sm text-gray-600 italic">
              Informasi struktur organisasi lengkap dapat diakses melalui menu Struktur Organisasi.
            </p>
          </div>
        </section>
        */}
      </div>

      {/* Metadata Section */}
      {halaman.diperbarui_pada && (
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-600 text-center">
              Terakhir diperbarui: <span className="font-medium">{formatDate(halaman.diperbarui_pada)}</span>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

