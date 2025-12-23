import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import LightModeWrapper from '../components/shared/LightModeWrapper'
import Home from '../pages/public/Home'
import BeritaList from '../pages/public/BeritaList'
import BeritaDetail from '../pages/public/BeritaDetail'
import ArtikelList from '../pages/public/ArtikelList'
import ArtikelDetail from '../pages/public/ArtikelDetail'
import LayananList from '../pages/public/LayananList'
import LayananDetail from '../pages/public/LayananDetail'
import WisataList from '../pages/public/WisataList'
import Tentang from '../pages/public/Tentang'
import VisiMisi from '../pages/public/VisiMisi'
import SosialMedia from '../pages/public/SosialMedia'
import AgendaList from '../pages/public/AgendaList'
import VideoList from '../pages/public/VideoList'
import PengumumanList from '../pages/public/PengumumanList'
import PerangkatDaerahList from '../pages/public/PerangkatDaerahList'
import TransparansiAnggaranList from '../pages/public/TransparansiAnggaranList'

export default function PublicRoutes() {
  return (
    <LightModeWrapper>
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/berita" element={<BeritaList />} />
          <Route path="/berita/:slug" element={<BeritaDetail />} />
          <Route path="/artikel" element={<ArtikelList />} />
          <Route path="/artikel/:slug" element={<ArtikelDetail />} />
          <Route path="/layanan" element={<LayananList />} />
          <Route path="/layanan/:id" element={<LayananDetail />} />
          <Route path="/wisata" element={<WisataList />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/visi-misi" element={<VisiMisi />} />
          <Route path="/sosial-media" element={<SosialMedia />} />
          <Route path="/agenda" element={<AgendaList />} />
          <Route path="/video" element={<VideoList />} />
          <Route path="/pengumuman" element={<PengumumanList />} />
          <Route path="/perangkat-daerah" element={<PerangkatDaerahList />} />
          <Route path="/transparansi-anggaran" element={<TransparansiAnggaranList />} />
        </Routes>
      </PublicLayout>
    </LightModeWrapper>
  )
}

