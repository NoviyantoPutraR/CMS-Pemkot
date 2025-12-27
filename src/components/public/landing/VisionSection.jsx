import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function VisionSection() {
  const navigate = useNavigate()
  return (
    <section id="visi-misi" className="py-12 sm:py-16 lg:py-20 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
          {/* Images di pojok kiri */}
          <div className="flex items-center space-x-4 flex-shrink-0 justify-center lg:justify-start">
            <motion.img 
              src="/visi.jpg" 
              alt="Visi" 
              width={128}
              height={128}
              loading="lazy"
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full object-cover shadow-lg self-start lg:-mt-4" 
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.img 
              src="/misi.jpg" 
              alt="Misi" 
              width={128}
              height={128}
              loading="lazy"
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full object-cover shadow-lg" 
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            />
          </div>

          {/* Content di tengah dengan button di pojok kanan */}
          <div className="flex-1 relative">
            {/* Konten di tengah dengan text align left */}
            <div className="flex justify-center lg:pr-60">
              <div className="text-left max-w-xl w-full">
                <motion.h2 
                  className="text-2xl lg:text-3xl font-bold mb-4"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                >
                  Visi Pembangunan Provinsi Kerja Baik
                </motion.h2>
                <motion.p 
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                >
                  Terwujudnya masyarakat Kerja Baik yang adil, sejahtera, unggul, dan berdaulat dengan tata kelola pemerintahan yang partisipatif inklusif melalui kerja bersama dan semangat gotong royong.
                </motion.p>
                
                {/* Button di bawah content untuk mobile/tablet */}
                <motion.div
                  className="lg:hidden flex justify-center"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                >
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-700 w-full sm:w-auto sm:mx-auto"
                    onClick={() => navigate('/visi-misi')}
                  >
                    Lihat Visi Misi Provinsi
                  </button>
                </motion.div>
              </div>
            </div>
            
            {/* Button di pojok kanan tengah vertikal untuk desktop */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <motion.button 
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-700"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                onClick={() => navigate('/visi-misi')}
              >
                Lihat Visi Misi Provinsi
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

