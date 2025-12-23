import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ClipboardList, BookOpen } from 'lucide-react'

export default function QuickAccessSection() {
  const quickAccessItems = [
    {
      icon: ClipboardList,
      title: 'Layanan Aplikasi dan Pengaduan Online Rakyat',
      description: 'Sampaikan aspirasi Anda atau dapatkan pelayanan publik lebih baik, sehingga resolusi mendapat solusi.',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      link: '/layanan',
    },
    {
      icon: BookOpen,
      title: 'Cari data tentang Jawa Timur Langsung',
      description: 'Jelajahi artikel informatif dan wawasan mendalam tentang Jawa Timur untuk memperluas pengetahuan Anda.',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      link: '/artikel',
    },
  ]

  return (
    <section className="quick-access-section py-16 bg-blue-800 mb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2 
          className="text-3xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Akses Cepat
        </motion.h2>
        <motion.p 
          className="text-center text-blue-100 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          Dapatkan kemudahan akses ke berbagai layanan Pemerintah Provinsi Jawa Timur<br />
          untuk kebutuhan Anda.
        </motion.p>

        <div className="flex justify-center gap-4 flex-wrap py-2">
          {quickAccessItems.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg hover:shadow-2xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                ease: "easeOut", 
                delay: 0.2 + index * 0.1
              }}
            >
              <div className="flex items-center space-x-4 h-full">
                <div className={`w-16 h-16 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-8 h-8 ${item.iconColor}`} strokeWidth={2} />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2 min-h-[3.5rem]">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{item.description}</p>
                  <Link to={item.link} className="text-sm text-blue-600 font-medium">Selengkapnya →</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .quick-access-section {
          --bg: radial-gradient(rgba(0, 0, 0, 0.1) 5%, transparent 6%);
          --size: 3rem;
          background-image: radial-gradient(rgba(0, 0, 0, 0.1) 5%, transparent 6%),
            radial-gradient(rgba(0, 0, 0, 0.1) 5%, transparent 6%);
          background-position: 0 0, calc(var(--size) / 2) calc(var(--size) / 2);
          background-size: var(--size) var(--size);
        }
      `}</style>
    </section>
  )
}

