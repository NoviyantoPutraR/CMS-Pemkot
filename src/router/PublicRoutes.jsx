import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PublicLayout from '../layouts/PublicLayout'
import LightModeWrapper from '../components/shared/LightModeWrapper'
import Loading from '../components/shared/Loading'

// Lazy load public pages untuk code splitting
const Home = lazy(() => import('../pages/public/Home'))
const BeritaList = lazy(() => import('../pages/public/BeritaList'))
const BeritaDetail = lazy(() => import('../pages/public/BeritaDetail'))
const ArtikelList = lazy(() => import('../pages/public/ArtikelList'))
const ArtikelDetail = lazy(() => import('../pages/public/ArtikelDetail'))
const LayananList = lazy(() => import('../pages/public/LayananList'))
const LayananDetail = lazy(() => import('../pages/public/LayananDetail'))
const WisataList = lazy(() => import('../pages/public/WisataList'))
const WisataDetail = lazy(() => import('../pages/public/WisataDetail'))
const Tentang = lazy(() => import('../pages/public/Tentang'))
const VisiMisi = lazy(() => import('../pages/public/VisiMisi'))
const SosialMedia = lazy(() => import('../pages/public/SosialMedia'))
const AgendaList = lazy(() => import('../pages/public/AgendaList'))
const VideoList = lazy(() => import('../pages/public/VideoList'))
const PengumumanList = lazy(() => import('../pages/public/PengumumanList'))
const PerangkatDaerahList = lazy(() => import('../pages/public/PerangkatDaerahList'))
const TransparansiAnggaranList = lazy(() => import('../pages/public/TransparansiAnggaranList'))
const SearchResults = lazy(() => import('../pages/public/SearchResults'))

export default function PublicRoutes() {
  return (
    <LightModeWrapper>
      <PublicLayout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/berita" element={<BeritaList />} />
            <Route path="/berita/:slug" element={<BeritaDetail />} />
            <Route path="/artikel" element={<ArtikelList />} />
            <Route path="/artikel/:slug" element={<ArtikelDetail />} />
            <Route path="/layanan" element={<LayananList />} />
            <Route path="/layanan/:id" element={<LayananDetail />} />
            <Route path="/wisata" element={<WisataList />} />
            <Route path="/wisata/:slug" element={<WisataDetail />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/visi-misi" element={<VisiMisi />} />
            <Route path="/sosial-media" element={<SosialMedia />} />
            <Route path="/agenda" element={<AgendaList />} />
            <Route path="/video" element={<VideoList />} />
            <Route path="/pengumuman" element={<PengumumanList />} />
            <Route path="/perangkat-daerah" element={<PerangkatDaerahList />} />
            <Route path="/transparansi-anggaran" element={<TransparansiAnggaranList />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </Suspense>
      </PublicLayout>
    </LightModeWrapper>
  )
}

