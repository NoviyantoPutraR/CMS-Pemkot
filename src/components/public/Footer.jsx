import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Pemerintah Kota</h3>
            <p className="text-gray-400">
              Portal informasi resmi pemerintah kota untuk melayani masyarakat.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/berita" className="text-gray-400 hover:text-white">
                  Berita
                </Link>
              </li>
              <li>
                <Link to="/layanan" className="text-gray-400 hover:text-white">
                  Layanan
                </Link>
              </li>
              <li>
                <Link to="/tentang" className="text-gray-400 hover:text-white">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/sosial-media" className="text-gray-400 hover:text-white">
                  Sosial Media
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Kontak</h3>
            <p className="text-gray-400">
              Email: info@pemerintahkota.go.id<br />
              Telp: (021) 1234-5678
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pemerintah Kota. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

