import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function VisionSection() {
  const navigate = useNavigate()
  return (
    <section id="visi-misi" className="py-16 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Images di pojok kiri */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <motion.img 
              src="https://images.unsplash.com/photo-1764173039192-2bbd508d5211?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Leader 1" 
              width={128}
              height={128}
              loading="lazy"
              className="w-32 h-32 rounded-full object-cover shadow-lg self-start -mt-4" 
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.img 
              src="https://plus.unsplash.com/premium_photo-1763265293425-f7ad17012b13?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Leader 2" 
              width={128}
              height={128}
              loading="lazy"
              className="w-32 h-32 rounded-full object-cover shadow-lg" 
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            />
          </div>

          {/* Content di tengah dengan button di pojok kanan */}
          <div className="flex-1 relative">
            {/* Button di pojok kanan tengah vertikal */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <motion.button 
                className="fancy-button relative bg-blue-600 text-white px-8 py-3 rounded-full text-sm font-medium"
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                onClick={() => navigate('/visi-misi')}
              >
                Lihat Visi Misi Provinsi
              </motion.button>
            </div>
            
            {/* Konten di tengah dengan text align left */}
            <div className="flex justify-center pr-60">
              <div className="text-left max-w-xl">
                <motion.h2 
                  className="text-3xl font-bold mb-4"
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .fancy-button {
          background-image: linear-gradient(to bottom right, #3B82F6, #1E40AF) !important;
          border: none;
          box-shadow: 0px 4px 0px #1E40AF !important;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .fancy-button:hover {
          transform: translateY(-2px);
          box-shadow: 0px 6px 0px #1E40AF !important;
        }
        .fancy-button:active {
          transform: translateY(0px);
          box-shadow: none !important;
          background-image: linear-gradient(to bottom right, #1E40AF, #3B82F6) !important;
        }
        .fancy-button:before,
        .fancy-button:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
        }
        .fancy-button:before {
          top: -3px;
          left: -3px;
          border-radius: 40px;
          border-top: 3px solid #fff;
          border-left: 3px solid #fff;
        }
        .fancy-button:after {
          bottom: -3px;
          right: -3px;
          border-radius: 40px;
          border-bottom: 3px solid #fff;
          border-right: 3px solid #fff;
        }
      `}</style>
    </section>
  )
}

