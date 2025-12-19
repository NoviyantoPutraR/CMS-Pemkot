import { supabase } from './supabase'

export const authService = {
  // Sign in dengan email dan password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        throw error
      }
      
      return data
    } catch (err) {
      // Cek apakah ini network error
      if (err.message?.includes('Failed to fetch') || 
          err.message?.includes('NetworkError')) {
        throw new Error('Tidak bisa terhubung ke server. Pastikan koneksi internet Anda aktif.')
      }
      
      throw err
    }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('pengguna')
      .select('*')
      .eq('id', userId)
      .single()
    
    // Jika tidak ditemukan (PGRST116), return null instead of throwing
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found - return null
        return null
      }
      throw error
    }
    return data
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('pengguna')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

