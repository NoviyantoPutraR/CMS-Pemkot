import CardNav from './CardNav'
import { colors } from '../../utils/designTokens'

export default function Header() {
  // Menu items untuk CardNav (hanya 3 item pertama yang ditampilkan)
  const navItems = [
    {
      label: 'Mengenal Kota',
      bgColor: '#0052FF', // primary blue
      textColor: '#fff',
      links: [
        { label: 'Tentang Kota', href: '/tentang', ariaLabel: 'Tentang Kota' },
        { label: 'Visi Misi', href: '/visi-misi', ariaLabel: 'Visi Misi' },
        { label: 'Struktur Organisasi', href: '/struktur-organisasi', ariaLabel: 'Struktur Organisasi' },
        { label: 'Sejarah Kota', href: '/sejarah', ariaLabel: 'Sejarah Kota' },
      ],
    },
    {
      label: 'Layanan Publik',
      bgColor: '#FFD700', // secondary yellow
      textColor: '#333',
      links: [
        { label: 'Semua Layanan', href: '/layanan', ariaLabel: 'Semua Layanan Publik' },
        { label: 'Layanan Online', href: '/layanan?type=online', ariaLabel: 'Layanan Online' },
        { label: 'Layanan Offline', href: '/layanan?type=offline', ariaLabel: 'Layanan Offline' },
      ],
    },
    {
      label: 'Informasi Publik',
      bgColor: '#333333', // dark gray
      textColor: '#fff',
      links: [
        { label: 'Berita', href: '/berita', ariaLabel: 'Berita Terkini' },
        { label: 'Artikel', href: '/artikel', ariaLabel: 'Artikel' },
        { label: 'Agenda Kota', href: '/agenda', ariaLabel: 'Agenda Kota' },
        { label: 'Pengumuman', href: '/pengumuman', ariaLabel: 'Pengumuman' },
      ],
    },
  ]

  return (
    <header className="relative w-full bg-white" style={{ minHeight: '120px', paddingTop: '20px' }}>
      <CardNav
        logo={null} // Menggunakan text logo
        logoAlt="Logo Kota"
        items={navItems}
        baseColor="#fff"
        menuColor={colors.primary.blue.main}
        buttonBgColor={colors.primary.blue.main}
        buttonTextColor="#fff"
        buttonText="Sosial Media"
        buttonHref="/sosial-media"
        ease="power3.out"
      />
    </header>
  )
}
