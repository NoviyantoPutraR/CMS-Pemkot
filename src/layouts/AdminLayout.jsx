import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import Navbar from '../components/admin/Navbar'
import Breadcrumb from '../components/shared/Breadcrumb'
import { generateBreadcrumbFromRoute } from '../utils/breadcrumbHelper'
import useAuthStore from '../store/useAuthStore'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const location = useLocation()
  const { user } = useAuthStore()
  
  // Check if current path is user's own profile page
  const profilePath = `/admin/pengguna/edit/${user?.id}`
  const isOwnProfile = location.pathname === profilePath
  
  // Check if pathname contains "edit" or "tambah" (only show breadcrumb on edit/add pages)
  const isEditOrTambahPage = location.pathname.includes('/edit/') || location.pathname.includes('/tambah')
  
  // Generate breadcrumb - use custom for profile page
  const breadcrumbItems = isOwnProfile 
    ? [{ label: 'Profil Saya', href: profilePath, current: true }]
    : generateBreadcrumbFromRoute(location.pathname, true)
  
  // Only show breadcrumb on edit/tambah pages, but not on profile page
  const shouldShowBreadcrumb = isEditOrTambahPage && !isOwnProfile && breadcrumbItems.length > 0

  // Load collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }
  }, [])

  // Save collapse state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString())
  }, [isCollapsed])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        showLogoutConfirm={showLogoutConfirm}
      />
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
          showLogoutConfirm={showLogoutConfirm}
          setShowLogoutConfirm={setShowLogoutConfirm}
        />
        <main className="p-6 bg-background">
          {shouldShowBreadcrumb && (
            <Breadcrumb items={breadcrumbItems} homeHref="/admin" />
          )}
          {children}
        </main>
      </div>
    </div>
  )
}

