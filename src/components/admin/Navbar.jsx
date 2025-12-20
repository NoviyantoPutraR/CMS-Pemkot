import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card'
import { LogOut, User, Menu, Moon, Sun, AlertTriangle, Shield, UserCog, FileEdit } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { ROLES, ROLE_LABELS } from '../../utils/constants'

export default function Navbar({ onMenuClick, showLogoutConfirm, setShowLogoutConfirm }) {
  const { profile, signOut } = useAuthStore()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false)
    await handleLogout()
  }

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-30">
      <div className="h-[68px] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger menu button untuk mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">
            Selamat Datang {profile?.nama_lengkap || profile?.email || 'Admin'}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </button>
          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end text-sm gap-1">
              {profile?.peran && (
                <Badge 
                  variant={
                    profile.peran === ROLES.SUPERADMIN ? 'destructive' :
                    profile.peran === ROLES.ADMIN_SKPD ? 'default' :
                    'secondary'
                  }
                  className="text-xs"
                >
                  {profile.peran === ROLES.SUPERADMIN && <Shield className="w-3 h-3 mr-1" />}
                  {profile.peran === ROLES.ADMIN_SKPD && <UserCog className="w-3 h-3 mr-1" />}
                  {profile.peran === ROLES.PENULIS && <FileEdit className="w-3 h-3 mr-1" />}
                  {ROLE_LABELS[profile.peran] || profile.peran}
                </Badge>
              )}
            </div>
            {profile?.peran !== ROLES.SUPERADMIN && (
              <Link 
                to={`/admin/pengguna/edit/${profile?.id}`}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                title="Edit Profil"
              >
                <User className="w-4 h-4 text-muted-foreground" />
              </Link>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogoutClick} className="transition-colors duration-200">
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 transition-opacity"
            onClick={handleCancelLogout}
          />
          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-destructive/10">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle>Konfirmasi Keluar</CardTitle>
                    <CardDescription>
                      Apakah Anda yakin ingin keluar dari panel admin?
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Anda akan diarahkan ke halaman login dan harus masuk kembali untuk mengakses panel admin.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancelLogout}
                >
                  Batal
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleConfirmLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Ya, Keluar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </nav>
  )
}

