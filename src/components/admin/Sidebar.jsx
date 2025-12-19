import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Newspaper, 
  BookOpen,
  Calendar,
  Briefcase, 
  FileText, 
  Users,
  Building2,
  FileSpreadsheet,
  FolderTree,
  MapPin,
  Video,
  Megaphone,
  Share2,
  Settings,
  X,
  PanelLeftClose,
  PanelRightClose,
  UserCircle
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import { PAGE_CODES } from '../../utils/constants'

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, permission: null, group: 'utama' },
  { path: '/admin/pengguna', label: 'Pengguna', icon: Users, permission: PAGE_CODES.MANAJEMEN_PENGGUNA, group: 'pengguna' },
  { path: '/admin/berita', label: 'Berita', icon: Newspaper, permission: PAGE_CODES.BERITA, group: 'konten' },
  { path: '/admin/artikel', label: 'Artikel', icon: BookOpen, permission: PAGE_CODES.ARTIKEL, group: 'konten' },
  { path: '/admin/agenda', label: 'Agenda Kota', icon: Calendar, permission: PAGE_CODES.AGENDA_KOTA, group: 'konten' },
  { path: '/admin/wisata', label: 'Wisata', icon: MapPin, permission: PAGE_CODES.WISATA, group: 'konten' },
  { path: '/admin/video', label: 'Video', icon: Video, permission: PAGE_CODES.VIDEO, group: 'konten' },
  { path: '/admin/pengumuman', label: 'Pengumuman', icon: Megaphone, permission: PAGE_CODES.PENGUMUMAN, group: 'konten' },
  { path: '/admin/layanan', label: 'Layanan', icon: Briefcase, permission: PAGE_CODES.LAYANAN, group: 'pengaturan' },
  { path: '/admin/perangkat-daerah', label: 'Perangkat Daerah', icon: Building2, permission: PAGE_CODES.PERANGKAT_DAERAH, group: 'pengaturan' },
  { path: '/admin/transparansi', label: 'Transparansi', icon: FileSpreadsheet, permission: PAGE_CODES.TRANSPARANSI, group: 'pengaturan' },
  { path: '/admin/halaman', label: 'Halaman', icon: FileText, permission: PAGE_CODES.HALAMAN, group: 'pengaturan' },
  { path: '/admin/sosial-media', label: 'Sosial Media', icon: Share2, permission: PAGE_CODES.SOSIAL_MEDIA, group: 'pengaturan' },
  { path: '/admin/pengaturan', label: 'Pengaturan', icon: Settings, permission: PAGE_CODES.PENGATURAN, group: 'pengaturan' },
]

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const location = useLocation()
  const { hasPermission, profile } = useAuthStore()
  
  const isSuperadmin = profile?.peran === 'superadmin'
  
  // Filter menu berdasarkan permission
  const visibleMenuItems = menuItems.filter(item => {
    // Jika superadmin, hanya tampilkan Dashboard dan Pengguna
    if (isSuperadmin) {
      return item.path === '/admin' || item.path === '/admin/pengguna'
    }
    
    // Jika tidak ada permission requirement, tampilkan
    if (!item.permission) return true
    
    // Check permission
    return hasPermission(item.permission)
  })

  return (
    <>
      {/* Overlay backdrop untuk mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-30 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40
        flex flex-col
        transition-all duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        w-64
      `}>
        {/* Header - Fixed di atas */}
        <div className={`flex-shrink-0 h-[68px] flex items-center transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-6'
        }`}>
          <div className={`flex items-center gap-2 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
            isCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-auto'
          }`}>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              CMS Admin
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Toggle Collapse Button - Desktop Only */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelRightClose className="w-5 h-5 text-sidebar-foreground" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-sidebar-foreground" />
              )}
            </button>
            {/* Close Button - Mobile Only */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>
        </div>
        
        {/* Nav - Scrollable area */}
        <nav className={`flex-1 overflow-y-auto space-y-1 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:p-2' : 'p-4'
        }`}>
          {visibleMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
                className={`
                  group relative flex items-center rounded-lg transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'lg:justify-center lg:px-0 lg:py-3 lg:w-full' : 'justify-start px-4 py-3'}
                  ${isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`flex-shrink-0 transition-all duration-300 ${
                  isCollapsed ? 'lg:w-5 lg:h-5' : 'w-5 h-5'
                }`} />
                <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isCollapsed ? 'lg:opacity-0 lg:w-0 lg:ml-0' : 'opacity-100 w-auto ml-3'
                }`}>
                  {item.label}
                </span>
                
                {/* Tooltip untuk collapsed mode */}
                {isCollapsed && (
                  <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground border border-border text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-border"></div>
                  </div>
                )}
              </Link>
            )
          })}
          
          {/* Profil Saya - Always visible for non-superadmin */}
          {!isSuperadmin && (
            <Link
              to={`/admin/pengguna/edit/${profile?.id}`}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose()
                }
              }}
              className={`
                group relative flex items-center rounded-lg transition-all duration-300 ease-in-out
                ${isCollapsed ? 'lg:justify-center lg:px-0 lg:py-3 lg:w-full' : 'justify-start px-4 py-3'}
                ${location.pathname === `/admin/pengguna/edit/${profile?.id}`
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }
              `}
              title={isCollapsed ? 'Profil Saya' : ''}
            >
              <UserCircle className={`flex-shrink-0 transition-all duration-300 ${
                isCollapsed ? 'lg:w-5 lg:h-5' : 'w-5 h-5'
              }`} />
              <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed ? 'lg:opacity-0 lg:w-0 lg:ml-0' : 'opacity-100 w-auto ml-3'
              }`}>
                Profil Saya
              </span>
              
              {isCollapsed && (
                <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-popover text-popover-foreground border border-border text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Profil Saya
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-4 border-r-border"></div>
                </div>
              )}
            </Link>
          )}
        </nav>
      </aside>
    </>
  )
}

