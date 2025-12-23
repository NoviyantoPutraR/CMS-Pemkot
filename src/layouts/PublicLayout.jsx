import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/public/landing/Header'
import Footer from '../components/public/landing/Footer'

export default function PublicLayout({ children }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  // Ensure dark mode is always removed when entering public routes
  // This prevents admin dark mode from affecting public UI
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark')
    // Note: We don't modify localStorage as per requirement 2c
  }, [location.pathname]) // Re-run on route change

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
