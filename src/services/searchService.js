import { beritaService } from './beritaService'
import { artikelService } from './artikelService'
import { layananService } from './layananService'
import { normalizeQuery, expandSynonyms, correctSpelling } from '../utils/searchHelpers'

export const searchService = {
  // Search di semua sumber (berita, artikel, layanan)
  async searchAll(query, options = {}) {
    const {
      limit = 10,
      page = 1
    } = options

    if (!query || !query.trim()) {
      return {
        berita: [],
        artikel: [],
        layanan: [],
        total: 0
      }
    }

    const normalizedQuery = normalizeQuery(query)
    
    // Expand dengan synonyms untuk better matching
    const expandedTerms = expandSynonyms(normalizedQuery)
    const searchQuery = expandedTerms.join(' ')

    try {
      // Parallel search di semua sumber
      const [beritaResult, artikelResult, layananResult] = await Promise.all([
        beritaService.getAll({
          page,
          limit: Math.ceil(limit / 3),
          search: normalizedQuery,
          publishedOnly: true,
          sortBy: 'terbaru'
        }).catch(() => ({ data: [], totalPages: 0, total: 0 })),
        
        artikelService.getAll({
          page,
          limit: Math.ceil(limit / 3),
          search: normalizedQuery,
          publishedOnly: true,
          sortBy: 'terbaru'
        }).catch(() => ({ data: [], totalPages: 0, total: 0 })),
        
        layananService.getAll({
          page,
          limit: Math.ceil(limit / 3),
          search: normalizedQuery,
          publishedOnly: true,
          sortBy: 'terbaru'
        }).catch(() => ({ data: [], totalPages: 0, total: 0 }))
      ])

      return {
        berita: beritaResult.data || [],
        artikel: artikelResult.data || [],
        layanan: layananResult.data || [],
        total: (beritaResult.data?.length || 0) + 
               (artikelResult.data?.length || 0) + 
               (layananResult.data?.length || 0),
        hasMore: (beritaResult.totalPages > page) || 
                 (artikelResult.totalPages > page) || 
                 (layananResult.totalPages > page)
      }
    } catch (error) {
      console.error('Error in searchAll:', error)
      return {
        berita: [],
        artikel: [],
        layanan: [],
        total: 0
      }
    }
  },

  // Get suggestions untuk autocomplete
  async getSuggestions(query, limit = 8) {
    if (!query || query.trim().length < 2) {
      return []
    }

    const normalizedQuery = normalizeQuery(query)

    try {
      // Fetch suggestions dari berita, artikel, layanan (judul saja)
      const [berita, artikel, layanan] = await Promise.all([
        beritaService.getAll({
          page: 1,
          limit: 5,
          search: normalizedQuery,
          publishedOnly: true,
          sortBy: 'terbaru'
        }).catch(() => ({ data: [] })),
        
        artikelService.getAll({
          page: 1,
          limit: 5,
          search: normalizedQuery,
          publishedOnly: true,
          sortBy: 'terbaru'
        }).catch(() => ({ data: [] })),
        
        layananService.getAll({
          page: 1,
          limit: 5,
          search: normalizedQuery,
          publishedOnly: true,
          sortBy: 'terbaru'
        }).catch(() => ({ data: [] }))
      ])

      const suggestions = []

      // Format suggestions dari berita
      berita.data?.slice(0, 3).forEach(item => {
        suggestions.push({
          text: item.judul,
          type: 'berita',
          url: `/berita/${item.slug}`,
          id: item.id
        })
      })

      // Format suggestions dari artikel
      artikel.data?.slice(0, 3).forEach(item => {
        suggestions.push({
          text: item.judul,
          type: 'artikel',
          url: `/artikel/${item.slug}`,
          id: item.id
        })
      })

      // Format suggestions dari layanan
      layanan.data?.slice(0, 2).forEach(item => {
        suggestions.push({
          text: item.judul,
          type: 'layanan',
          url: `/layanan/${item.slug || item.id}`,
          id: item.id
        })
      })

      return suggestions.slice(0, limit)
    } catch (error) {
      console.error('Error getting suggestions:', error)
      return []
    }
  },

  // Spell correction dengan helper function
  correctSpelling,

  // Expand synonyms dengan helper function
  expandSynonyms
}

