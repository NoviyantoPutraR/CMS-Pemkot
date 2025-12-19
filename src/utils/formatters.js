// Format tanggal ke format Indonesia
export function formatDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  }
  
  return date.toLocaleDateString('id-ID', options)
}

// Format tanggal dengan waktu
export function formatDateTime(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }
  
  return date.toLocaleDateString('id-ID', options)
}

// Format tanggal relatif (misal: "2 hari yang lalu")
export function formatRelativeDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Baru saja'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} minggu yang lalu`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`
  }
  
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} tahun yang lalu`
}

// Generate slug dari string
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Truncate text
export function truncate(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Strip HTML tags
export function stripHtml(html) {
  if (!html) return ''
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

// Estimate reading time dari konten HTML (dalam menit)
// Asumsi: rata-rata 200 kata per menit untuk bahasa Indonesia
export function estimateReadingTime(htmlContent) {
  if (!htmlContent) return 1
  
  const text = stripHtml(htmlContent)
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))
  
  return readingTimeMinutes
}

// Format durasi video dari detik ke format MM:SS atau X menit
export function formatVideoDuration(seconds) {
  if (!seconds || seconds === 0) return ''
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  
  if (minutes > 0) {
    return `${minutes}:${String(secs).padStart(2, '0')}`
  }
  
  return `0:${String(secs).padStart(2, '0')}`
}

// Format jumlah views/penonton
export function formatVideoViews(views) {
  if (!views || views === 0) return '0 ditonton'
  
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M ditonton`
  }
  
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K ditonton`
  }
  
  return `${views} ditonton`
}

