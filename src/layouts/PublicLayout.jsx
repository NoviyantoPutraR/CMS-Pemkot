import { useLocation } from 'react-router-dom'
import Header from '../components/public/landing/Header'
import Footer from '../components/public/landing/Footer'

export default function PublicLayout({ children }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  // Home page sudah include Header dan Footer sendiri
  if (isHomePage) {
    return <>{children}</>
  }

  // Halaman lain menggunakan Header dan Footer dari layout
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
