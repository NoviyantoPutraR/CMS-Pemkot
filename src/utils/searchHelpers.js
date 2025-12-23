// Levenshtein distance algorithm untuk spell correction
export function levenshteinDistance(str1, str2) {
  const m = str1.length
  const n = str2.length
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        )
      }
    }
  }

  return dp[m][n]
}

// Dictionary kata umum Bahasa Indonesia untuk spell correction
const commonWords = [
  'berita', 'artikel', 'layanan', 'pemerintah', 'provinsi', 'kota',
  'informasi', 'pelayanan', 'publik', 'anggaran', 'transparansi',
  'pengumuman', 'agenda', 'wisata', 'video', 'tentang', 'visi', 'misi',
  'jawa', 'timur', 'malang', 'surabaya', 'data', 'laporan', 'dokumen'
]

// Synonym dictionary
export const synonymDict = {
  'berita': ['informasi', 'kabar', 'warta', 'news'],
  'artikel': ['tulisan', 'artikel', 'pengetahuan'],
  'layanan': ['pelayanan', 'servis', 'jasa', 'service'],
  'pemerintah': ['pemkot', 'pemprov', 'pemerintahan'],
  'informasi': ['berita', 'kabar', 'data', 'info'],
  'pelayanan': ['layanan', 'servis', 'jasa'],
  'anggaran': ['budget', 'biaya', 'dana'],
  'transparansi': ['keterbukaan', 'transparansi'],
  'pengumuman': ['pemberitahuan', 'announcement'],
  'agenda': ['jadwal', 'rencana', 'program'],
  'wisata': ['pariwisata', 'tour', 'destinasi'],
  'video': ['video', 'rekaman'],
  'tentang': ['profil', 'sejarah', 'about'],
  'visi': ['cita-cita', 'tujuan', 'vision'],
  'misi': ['tugas', 'mission']
}

// Spell correction dengan Levenshtein distance
export function correctSpelling(query) {
  const words = query.toLowerCase().split(/\s+/)
  const corrected = []
  const suggestions = []

  for (const word of words) {
    // Skip jika kata terlalu pendek
    if (word.length < 3) {
      corrected.push(word)
      continue
    }

    // Cari kata terdekat dalam dictionary
    let minDistance = Infinity
    let closestWord = word

    for (const dictWord of commonWords) {
      const distance = levenshteinDistance(word, dictWord)
      const maxLen = Math.max(word.length, dictWord.length)
      const similarity = 1 - (distance / maxLen)

      // Jika similarity > 70%, gunakan sebagai koreksi
      if (similarity > 0.7 && distance < minDistance) {
        minDistance = distance
        closestWord = dictWord
      }
    }

    if (closestWord !== word && minDistance < Infinity) {
      corrected.push(closestWord)
      suggestions.push({ original: word, corrected: closestWord })
    } else {
      corrected.push(word)
    }
  }

  return {
    corrected: corrected.join(' '),
    hasCorrection: suggestions.length > 0,
    suggestions
  }
}

// Expand query dengan synonyms
export function expandSynonyms(query) {
  const words = query.toLowerCase().split(/\s+/)
  const expandedTerms = new Set()

  for (const word of words) {
    expandedTerms.add(word)
    
    // Tambahkan synonym jika ada
    if (synonymDict[word]) {
      synonymDict[word].forEach(syn => expandedTerms.add(syn))
    }
    
    // Cari reverse lookup (jika word adalah synonym dari kata lain)
    for (const [key, synonyms] of Object.entries(synonymDict)) {
      if (synonyms.includes(word)) {
        expandedTerms.add(key)
      }
    }
  }

  return Array.from(expandedTerms)
}

// Normalize query untuk search (lowercase, trim, remove extra spaces)
export function normalizeQuery(query) {
  return query.toLowerCase().trim().replace(/\s+/g, ' ')
}

