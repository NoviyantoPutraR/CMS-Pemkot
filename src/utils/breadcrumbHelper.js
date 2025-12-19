/**
 * Generate breadcrumb items dari route pathname
 * @param {string} pathname - Current pathname dari useLocation()
 * @param {boolean} isAdmin - Apakah ini route admin
 * @returns {Array} Array of { label, href, current? }
 */
export function generateBreadcrumbFromRoute(pathname, isAdmin = false) {
  const items = []
  const homeHref = isAdmin ? '/admin' : '/'
  
  // Skip untuk homepage
  if (pathname === '/' || pathname === '/admin') {
    return []
  }

  // Split pathname menjadi segments
  const segments = pathname.split('/').filter(Boolean)
  
  // Admin routes
  if (isAdmin) {
    // Skip 'admin' segment
    const adminSegments = segments.slice(1)
    
    if (adminSegments.length === 0) {
      return []
    }

    // Mapping untuk admin routes
    const routeLabels = {
      berita: 'Berita',
      artikel: 'Artikel',
      agenda: 'Agenda',
      layanan: 'Layanan',
      halaman: 'Halaman',
      'perangkat-daerah': 'Perangkat Daerah',
      transparansi: 'Transparansi',
      pengguna: 'Pengguna',
      wisata: 'Wisata',
      video: 'Video',
      pengumuman: 'Pengumuman',
      'sosial-media': 'Sosial Media',
      pengaturan: 'Pengaturan',
    }

    // Action labels
    const actionLabels = {
      tambah: 'Tambah',
      edit: 'Edit',
    }

    let currentPath = '/admin'
    
    for (let index = 0; index < adminSegments.length; index++) {
      const segment = adminSegments[index]
      const isLast = index === adminSegments.length - 1
      const nextSegment = adminSegments[index + 1]
      
      // Check jika ini adalah action (tambah/edit)
      if (actionLabels[segment]) {
        const prevSegment = adminSegments[index - 1]
        const entityLabel = routeLabels[prevSegment] || prevSegment
        currentPath += `/${segment}`
        
        // Jika ada segment berikutnya (ID), ini adalah edit dengan ID
        const hasId = nextSegment && !routeLabels[nextSegment] && !actionLabels[nextSegment]
        
        if (hasId) {
          // Skip ID segment, set current pada action
          items.push({
            label: `${actionLabels[segment]} ${entityLabel}`,
            href: currentPath,
            current: true,
          })
          // Skip ID segment
          index++
        } else {
          items.push({
            label: `${actionLabels[segment]} ${entityLabel}`,
            href: currentPath,
            current: isLast,
          })
        }
      }
      // Regular segment
      else {
        currentPath += `/${segment}`
        const label = routeLabels[segment] || segment
        items.push({
          label: label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g, ' '),
          href: currentPath,
          current: isLast,
        })
      }
    }
  }
  // Public routes
  else {
    const routeLabels = {
      berita: 'Berita',
      artikel: 'Artikel',
      layanan: 'Layanan',
      tentang: 'Tentang',
      'sosial-media': 'Sosial Media',
    }

    let currentPath = ''
    
    for (let index = 0; index < segments.length; index++) {
      const segment = segments[index]
      const isLast = index === segments.length - 1
      const prevSegment = segments[index - 1]
      currentPath += `/${segment}`
      
      // Check jika ini adalah detail page (ada segment setelah entity)
      if (prevSegment === 'berita') {
        items.push({
          label: 'Detail Berita',
          href: currentPath,
          current: isLast,
        })
        break // Stop setelah detail, tidak perlu menambahkan lagi
      } else if (prevSegment === 'artikel') {
        items.push({
          label: 'Detail Artikel',
          href: currentPath,
          current: isLast,
        })
        break // Stop setelah detail, tidak perlu menambahkan lagi
      } else if (prevSegment === 'layanan') {
        items.push({
          label: 'Detail Layanan',
          href: currentPath,
          current: isLast,
        })
        break // Stop setelah detail, tidak perlu menambahkan lagi
      } else {
        const label = routeLabels[segment] || segment
        items.push({
          label: label.charAt(0).toUpperCase() + label.slice(1).replace(/-/g, ' '),
          href: currentPath,
          current: isLast,
        })
      }
    }
  }

  return items
}

