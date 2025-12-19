import { supabase } from './supabase'

export const hakAksesService = {
  // Get all hak akses
  async getAll() {
    const { data, error } = await supabase
      .from('hak_akses')
      .select('*')
      .order('kategori', { ascending: true })
      .order('nama_halaman', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Get hak akses by kategori
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('hak_akses')
      .select('*')
      .eq('kategori', category)
      .order('nama_halaman', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Get hak akses yang available untuk role tertentu
  async getAvailableForRole(role) {
    let category = null
    
    if (role === 'superadmin') {
      category = 'admin_skpd_options'
    } else if (role === 'admin_skpd') {
      category = 'penulis_options'
    }
    
    if (!category) {
      return []
    }
    
    return await this.getByCategory(category)
  },

  // Get hak akses by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('hak_akses')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Get hak akses by kode halaman
  async getByCode(kodeHalaman) {
    const { data, error } = await supabase
      .from('hak_akses')
      .select('*')
      .eq('kode_halaman', kodeHalaman)
      .single()
    
    if (error) throw error
    return data
  },
}

