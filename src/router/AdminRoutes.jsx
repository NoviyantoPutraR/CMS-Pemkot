import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import Login from '../pages/admin/Login'
import { BYPASS_AUTH } from '../utils/authConfig'
import PermissionGuard from '../components/admin/PermissionGuard'
import { PAGE_CODES } from '../utils/constants'

// Lazy load admin components untuk code splitting
const AdminLayout = lazy(() => import('../layouts/AdminLayout'))
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const BeritaList = lazy(() => import('../pages/admin/Berita/BeritaList'))
const TambahBerita = lazy(() => import('../pages/admin/Berita/TambahBerita'))
const EditBerita = lazy(() => import('../pages/admin/Berita/EditBerita'))
const ArtikelList = lazy(() => import('../pages/admin/Artikel/ArtikelList'))
const TambahArtikel = lazy(() => import('../pages/admin/Artikel/TambahArtikel'))
const EditArtikel = lazy(() => import('../pages/admin/Artikel/EditArtikel'))
const LayananList = lazy(() => import('../pages/admin/Layanan/LayananList'))
const TambahLayanan = lazy(() => import('../pages/admin/Layanan/TambahLayanan'))
const EditLayanan = lazy(() => import('../pages/admin/Layanan/EditLayanan'))
const HalamanList = lazy(() => import('../pages/admin/Halaman/HalamanList'))
const TambahHalaman = lazy(() => import('../pages/admin/Halaman/TambahHalaman'))
const EditHalaman = lazy(() => import('../pages/admin/Halaman/EditHalaman'))
const AdminList = lazy(() => import('../pages/admin/Pengguna/AdminList'))
const TambahAdmin = lazy(() => import('../pages/admin/Pengguna/TambahAdmin'))
const EditAdmin = lazy(() => import('../pages/admin/Pengguna/EditAdmin'))
const AgendaList = lazy(() => import('../pages/admin/Agenda/AgendaList'))
const TambahAgenda = lazy(() => import('../pages/admin/Agenda/TambahAgenda'))
const EditAgenda = lazy(() => import('../pages/admin/Agenda/EditAgenda'))
const PerangkatDaerahList = lazy(() => import('../pages/admin/PerangkatDaerah/PerangkatDaerahList'))
const TambahPerangkatDaerah = lazy(() => import('../pages/admin/PerangkatDaerah/TambahPerangkatDaerah'))
const EditPerangkatDaerah = lazy(() => import('../pages/admin/PerangkatDaerah/EditPerangkatDaerah'))
const TransparansiList = lazy(() => import('../pages/admin/Transparansi/TransparansiList'))
const TambahTransparansi = lazy(() => import('../pages/admin/Transparansi/TambahTransparansi'))
const EditTransparansi = lazy(() => import('../pages/admin/Transparansi/EditTransparansi'))
const WisataList = lazy(() => import('../pages/admin/Wisata/WisataList'))
const TambahWisata = lazy(() => import('../pages/admin/Wisata/TambahWisata'))
const EditWisata = lazy(() => import('../pages/admin/Wisata/EditWisata'))
const VideoList = lazy(() => import('../pages/admin/Video/VideoList'))
const TambahVideo = lazy(() => import('../pages/admin/Video/TambahVideo'))
const EditVideo = lazy(() => import('../pages/admin/Video/EditVideo'))
const PengumumanList = lazy(() => import('../pages/admin/Pengumuman/PengumumanList'))
const TambahPengumuman = lazy(() => import('../pages/admin/Pengumuman/TambahPengumuman'))
const EditPengumuman = lazy(() => import('../pages/admin/Pengumuman/EditPengumuman'))
const SosialMediaList = lazy(() => import('../pages/admin/SosialMedia/SosialMediaList'))
const EditSosialMedia = lazy(() => import('../pages/admin/SosialMedia/EditSosialMedia'))
const PengaturanList = lazy(() => import('../pages/admin/Pengaturan/PengaturanList'))
const EditPengaturan = lazy(() => import('../pages/admin/Pengaturan/EditPengaturan'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-muted-foreground">Memuat halaman...</p>
    </div>
  </div>
)

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, init } = useAuthStore()

  // Initialize auth hanya saat ProtectedRoute mount
  useEffect(() => {
    if (BYPASS_AUTH) {
      useAuthStore.setState({ loading: false })
      return
    }
    init()
  }, [init])

  // Bypass authentication check jika BYPASS_AUTH aktif
  if (BYPASS_AUTH) {
    return children
  }

  // Tampilkan loading jika masih checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Memeriksa autentikasi...</p>
        </div>
      </div>
    )
  }

  // Redirect ke login jika tidak authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

// Permission Route wrapper
function PermissionRoute({ permission, children }) {
  return (
    <PermissionGuard permission={permission} redirectTo="/admin">
      {children}
    </PermissionGuard>
  )
}

export default function AdminRoutes() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          BYPASS_AUTH || isAuthenticated ? (
            <Navigate to="/admin" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <AdminLayout>
              <Routes>
                {/* Dashboard - Always accessible */}
                <Route path="/" element={<Dashboard />} />
                
                {/* Berita - Penulis */}
                <Route path="/berita" element={
                  <PermissionRoute permission={PAGE_CODES.BERITA}>
                    <BeritaList />
                  </PermissionRoute>
                } />
                <Route path="/berita/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.BERITA}>
                    <TambahBerita />
                  </PermissionRoute>
                } />
                <Route path="/berita/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.BERITA}>
                    <EditBerita />
                  </PermissionRoute>
                } />
                
                {/* Artikel - Penulis */}
                <Route path="/artikel" element={
                  <PermissionRoute permission={PAGE_CODES.ARTIKEL}>
                    <ArtikelList />
                  </PermissionRoute>
                } />
                <Route path="/artikel/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.ARTIKEL}>
                    <TambahArtikel />
                  </PermissionRoute>
                } />
                <Route path="/artikel/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.ARTIKEL}>
                    <EditArtikel />
                  </PermissionRoute>
                } />
                
                {/* Agenda - Penulis */}
                <Route path="/agenda" element={
                  <PermissionRoute permission={PAGE_CODES.AGENDA_KOTA}>
                    <AgendaList />
                  </PermissionRoute>
                } />
                <Route path="/agenda/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.AGENDA_KOTA}>
                    <TambahAgenda />
                  </PermissionRoute>
                } />
                <Route path="/agenda/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.AGENDA_KOTA}>
                    <EditAgenda />
                  </PermissionRoute>
                } />
                
                {/* Layanan - Admin SKPD */}
                <Route path="/layanan" element={
                  <PermissionRoute permission={PAGE_CODES.LAYANAN}>
                    <LayananList />
                  </PermissionRoute>
                } />
                <Route path="/layanan/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.LAYANAN}>
                    <TambahLayanan />
                  </PermissionRoute>
                } />
                <Route path="/layanan/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.LAYANAN}>
                    <EditLayanan />
                  </PermissionRoute>
                } />
                
                {/* Halaman - Admin SKPD */}
                <Route path="/halaman" element={
                  <PermissionRoute permission={PAGE_CODES.HALAMAN}>
                    <HalamanList />
                  </PermissionRoute>
                } />
                <Route path="/halaman/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.HALAMAN}>
                    <TambahHalaman />
                  </PermissionRoute>
                } />
                <Route path="/halaman/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.HALAMAN}>
                    <EditHalaman />
                  </PermissionRoute>
                } />
                
                {/* Perangkat Daerah - Admin SKPD */}
                <Route path="/perangkat-daerah" element={
                  <PermissionRoute permission={PAGE_CODES.PERANGKAT_DAERAH}>
                    <PerangkatDaerahList />
                  </PermissionRoute>
                } />
                <Route path="/perangkat-daerah/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.PERANGKAT_DAERAH}>
                    <TambahPerangkatDaerah />
                  </PermissionRoute>
                } />
                <Route path="/perangkat-daerah/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.PERANGKAT_DAERAH}>
                    <EditPerangkatDaerah />
                  </PermissionRoute>
                } />
                
                {/* Transparansi - Admin SKPD */}
                <Route path="/transparansi" element={
                  <PermissionRoute permission={PAGE_CODES.TRANSPARANSI}>
                    <TransparansiList />
                  </PermissionRoute>
                } />
                <Route path="/transparansi/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.TRANSPARANSI}>
                    <TambahTransparansi />
                  </PermissionRoute>
                } />
                <Route path="/transparansi/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.TRANSPARANSI}>
                    <EditTransparansi />
                  </PermissionRoute>
                } />
                
                {/* Pengguna - Superadmin & Admin SKPD */}
                <Route path="/pengguna" element={
                  <PermissionRoute permission={PAGE_CODES.MANAJEMEN_PENGGUNA}>
                    <AdminList />
                  </PermissionRoute>
                } />
                <Route path="/pengguna/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.MANAJEMEN_PENGGUNA}>
                    <TambahAdmin />
                  </PermissionRoute>
                } />
                <Route path="/pengguna/edit/:id" element={<EditAdmin />} />
                
                {/* Wisata - Penulis */}
                <Route path="/wisata" element={
                  <PermissionRoute permission={PAGE_CODES.WISATA}>
                    <WisataList />
                  </PermissionRoute>
                } />
                <Route path="/wisata/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.WISATA}>
                    <TambahWisata />
                  </PermissionRoute>
                } />
                <Route path="/wisata/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.WISATA}>
                    <EditWisata />
                  </PermissionRoute>
                } />
                
                {/* Video - Penulis */}
                <Route path="/video" element={
                  <PermissionRoute permission={PAGE_CODES.VIDEO}>
                    <VideoList />
                  </PermissionRoute>
                } />
                <Route path="/video/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.VIDEO}>
                    <TambahVideo />
                  </PermissionRoute>
                } />
                <Route path="/video/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.VIDEO}>
                    <EditVideo />
                  </PermissionRoute>
                } />
                
                {/* Pengumuman - Penulis */}
                <Route path="/pengumuman" element={
                  <PermissionRoute permission={PAGE_CODES.PENGUMUMAN}>
                    <PengumumanList />
                  </PermissionRoute>
                } />
                <Route path="/pengumuman/tambah" element={
                  <PermissionRoute permission={PAGE_CODES.PENGUMUMAN}>
                    <TambahPengumuman />
                  </PermissionRoute>
                } />
                <Route path="/pengumuman/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.PENGUMUMAN}>
                    <EditPengumuman />
                  </PermissionRoute>
                } />
                
                {/* Sosial Media - Penulis */}
                <Route path="/sosial-media" element={
                  <PermissionRoute permission={PAGE_CODES.SOSIAL_MEDIA}>
                    <SosialMediaList />
                  </PermissionRoute>
                } />
                <Route path="/sosial-media/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.SOSIAL_MEDIA}>
                    <EditSosialMedia />
                  </PermissionRoute>
                } />
                
                {/* Pengaturan - Admin SKPD */}
                <Route path="/pengaturan" element={
                  <PermissionRoute permission={PAGE_CODES.PENGATURAN}>
                    <PengaturanList />
                  </PermissionRoute>
                } />
                <Route path="/pengaturan/edit/:id" element={
                  <PermissionRoute permission={PAGE_CODES.PENGATURAN}>
                    <EditPengaturan />
                  </PermissionRoute>
                } />
                
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
              </AdminLayout>
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

