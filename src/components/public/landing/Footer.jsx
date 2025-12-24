import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { pengaturanSitusService } from '../../../services/pengaturanSitusService'
import { layananService } from '../../../services/layananService'
import { transparansiAnggaranService } from '../../../services/transparansiAnggaranService'
import { sosialMediaService } from '../../../services/sosialMediaService'

export default function Footer() {
  const [footerData, setFooterData] = useState({
    nama_situs: '',
    deskripsi_situs: '',
    alamat: '',
    email: '',
    telepon: '',
  })
  const [layananList, setLayananList] = useState([])
  const [transparansiList, setTransparansiList] = useState([])
  const [socialMediaList, setSocialMediaList] = useState([])

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const data = await pengaturanSitusService.getFooterData()
        setFooterData(data)
      } catch (error) {
        console.error('Error loading footer data:', error)
      }
    }
    loadFooterData()
  }, [])

  useEffect(() => {
    const loadLayanan = async () => {
      try {
        const result = await layananService.getAll({
          page: 1,
          limit: 10,
          publishedOnly: true,
          sortBy: 'terbaru'
        })
        setLayananList(result.data || [])
      } catch (error) {
        console.error('Error loading layanan:', error)
      }
    }
    loadLayanan()
  }, [])

  useEffect(() => {
    const loadTransparansi = async () => {
      try {
        const data = await transparansiAnggaranService.getAll({ publishedOnly: true })
        setTransparansiList(data || [])
      } catch (error) {
        console.error('Error loading transparansi:', error)
      }
    }
    loadTransparansi()
  }, [])

  useEffect(() => {
    const loadSocialMedia = async () => {
      try {
        const data = await sosialMediaService.getAll()
        const activeSocialMedia = data.filter(item => item.aktif === true)
        setSocialMediaList(activeSocialMedia)
      } catch (error) {
        console.error('Error loading social media:', error)
      }
    }
    loadSocialMedia()
  }, [])

  return (
    <footer className="relative mt-16 bg-blue-900">
      <svg className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-blue-900" preserveAspectRatio="none" viewBox="0 0 1440 54">
        <path fill="currentColor" d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"></path>
      </svg>
      <div className="px-4 pt-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="grid gap-16 row-gap-10 mb-8 lg:grid-cols-6">
          {/* Logo & Description */}
          <div className="md:max-w-md lg:col-span-2">
            <a href="/" aria-label="Go home" title="Company" className="inline-flex items-center">
              <img src="/logo.png" alt="Logo" width={120} height={40} className="h-10 w-auto object-contain" />
              {footerData.nama_situs && (
                <span className="ml-2 text-xl font-bold tracking-wide text-gray-100 uppercase">{footerData.nama_situs}</span>
              )}
            </a>
            <div className="mt-4 lg:max-w-sm">
              {footerData.deskripsi_situs && (
                <p className="text-sm text-blue-50">
                  {footerData.deskripsi_situs}
                </p>
              )}
              {footerData.alamat && (
                <p className="mt-4 text-sm text-blue-50">
                  {footerData.alamat}
                </p>
              )}
            </div>
          </div>
          
          {/* Links Section */}
          <div className="grid grid-cols-1 gap-5 row-gap-8 lg:col-span-4 md:grid-cols-3 sm:grid-cols-2">
            <div>
              <p className="font-semibold tracking-wide text-blue-400">
                Kontak
              </p>
              <ul className="mt-2 space-y-2">
                {footerData.email && (
                  <li>
                    <p className="transition-colors duration-300 text-blue-50 flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      {footerData.email}
                    </p>
                  </li>
                )}
                {footerData.telepon && (
                  <li>
                    <p className="transition-colors duration-300 text-blue-50 flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      {footerData.telepon}
                    </p>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p className="font-semibold tracking-wide text-blue-400">
                Layanan
              </p>
              <ul className="mt-2 space-y-2">
                {layananList.length > 0 ? (
                  layananList.map((layanan) => (
                    <li key={layanan.id}>
                      <Link 
                        to={`/layanan/${layanan.slug}`} 
                        className="transition-colors duration-300 text-blue-50 hover:text-blue-400"
                      >
                        {layanan.judul}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link 
                      to="/layanan" 
                      className="transition-colors duration-300 text-blue-50 hover:text-blue-400"
                    >
                      Lihat Semua Layanan
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p className="font-semibold tracking-wide text-blue-400">
                Transparansi
              </p>
              <ul className="mt-2 space-y-2">
                {transparansiList.length > 0 ? (
                  transparansiList.map((transparansi) => (
                    <li key={transparansi.id}>
                      <Link 
                        to="/transparansi-anggaran" 
                        className="transition-colors duration-300 text-blue-50 hover:text-blue-400"
                      >
                        Anggaran {transparansi.tahun}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link 
                      to="/transparansi-anggaran" 
                      className="transition-colors duration-300 text-blue-50 hover:text-blue-400"
                    >
                      Anggaran Daerah
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col justify-between pt-5 pb-10 border-t border-blue-700 sm:flex-row">
          <p className="text-sm text-gray-100">
            © Copyright {new Date().getFullYear()} {footerData.nama_situs || 'Portal Resmi'}. All rights reserved.
          </p>
          <div className="flex items-center mt-4 space-x-4 sm:mt-0">
            {socialMediaList.map((socialMedia) => (
              <a
                key={socialMedia.id}
                href={socialMedia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 text-blue-100 hover:text-blue-400"
                aria-label={socialMedia.platform}
              >
                {socialMedia.platform === 'twitter' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ) : socialMedia.platform === 'instagram' ? (
                  <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                    <circle cx="15" cy="15" r="4"></circle>
                    <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10 C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1 c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z" />
                  </svg>
                ) : socialMedia.platform === 'facebook' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                    <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z" />
                  </svg>
                ) : socialMedia.platform === 'youtube' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                ) : socialMedia.platform === 'tiktok' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                ) : socialMedia.ikon_url ? (
                  <img src={socialMedia.ikon_url} alt={socialMedia.platform} width={20} height={20} loading="lazy" className="h-5 w-5" />
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

