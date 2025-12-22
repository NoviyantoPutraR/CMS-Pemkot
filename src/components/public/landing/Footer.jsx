import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { pengaturanSitusService } from '../../../services/pengaturanSitusService'
import { layananService } from '../../../services/layananService'
import { transparansiAnggaranService } from '../../../services/transparansiAnggaranService'

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
              <svg className="w-8 text-blue-400" viewBox="0 0 24 24" strokeLinejoin="round" strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10" stroke="currentColor" fill="none">
                <rect x="3" y="1" width="7" height="12"></rect>
                <rect x="3" y="17" width="7" height="6"></rect>
                <rect x="14" y="1" width="7" height="6"></rect>
                <rect x="14" y="11" width="7" height="12"></rect>
              </svg>
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
                    <p className="transition-colors duration-300 text-blue-50">📧 {footerData.email}</p>
                  </li>
                )}
                {footerData.telepon && (
                  <li>
                    <p className="transition-colors duration-300 text-blue-50">📞 {footerData.telepon}</p>
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
            <a href="/" className="transition-colors duration-300 text-blue-100 hover:text-blue-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                <path
                  d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z"
                ></path>
              </svg>
            </a>
            <a href="/" className="transition-colors duration-300 text-blue-100 hover:text-blue-400">
              <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                <circle cx="15" cy="15" r="4"></circle>
                <path
                  d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"
                ></path>
              </svg>
            </a>
            <a href="/" className="transition-colors duration-300 text-blue-100 hover:text-blue-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                <path
                  d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

