import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import Navbar from '../components/admin/Navbar'
import Breadcrumb from '../components/shared/Breadcrumb'
import { generateBreadcrumbFromRoute } from '../utils/breadcrumbHelper'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const breadcrumbItems = generateBreadcrumbFromRoute(location.pathname, true)

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
      />
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6 bg-background">
          {breadcrumbItems.length > 1 && (
            <Breadcrumb items={breadcrumbItems} homeHref="/admin" />
          )}
          {children}
        </main>
      </div>
    </div>
  )
}

