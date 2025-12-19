import { create } from 'zustand'
import { authService } from '../services/authService'
import { BYPASS_AUTH } from '../utils/authConfig'

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  permissions: [],
  loading: true,
  isAuthenticated: false,

  // Initialize auth state
  async init() {
    // Skip init jika BYPASS_AUTH aktif
    if (BYPASS_AUTH) {
      set({ 
        user: null, 
        profile: null, 
        isAuthenticated: false, 
        loading: false 
      })
      return
    }

    try {
      set({ loading: true })
      
      const session = await authService.getSession()
      
      if (session?.user) {
        try {
          const profile = await authService.getUserProfile(session.user.id)
          
          if (profile) {
            // Load permissions
            const { penggunaService } = await import('../services/penggunaService')
            const permissionCodes = await penggunaService.getPermissionCodes(session.user.id)
            
            set({
              user: session.user,
              profile,
              permissions: permissionCodes || [],
              isAuthenticated: true,
              loading: false,
            })
            return
          }
        } catch (profileError) {
          if (import.meta.env.DEV) {
            console.warn('User profile not found or error:', profileError)
          }
        }
        
        // User ada di auth tapi tidak ada di pengguna atau error
        set({ 
          user: session.user, 
          profile: null, 
          permissions: [],
          isAuthenticated: false, 
          loading: false 
        })
      } else {
        set({ user: null, profile: null, permissions: [], isAuthenticated: false, loading: false })
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Auth init error:', error)
      }
      set({ user: null, profile: null, isAuthenticated: false, loading: false })
    } finally {
      set((state) => ({ ...state, loading: false }))
    }
  },

  // Sign in
  async signIn(email, password) {
    try {
      const data = await authService.signIn(email, password)
      const profile = await authService.getUserProfile(data.user.id)
      
      if (!profile) {
        return { 
          success: false, 
          error: 'Akun tidak terdaftar sebagai admin. Silakan hubungi administrator.' 
        }
      }
      
      // Load permissions
      const { penggunaService } = await import('../services/penggunaService')
      const permissionCodes = await penggunaService.getPermissionCodes(data.user.id)
      
      set({
        user: data.user,
        profile,
        permissions: permissionCodes || [],
        isAuthenticated: true,
        loading: false,
      })
      
      return { success: true }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Sign in error:', error)
      }
      set({ loading: false })
      return { 
        success: false, 
        error: error.message || 'Email atau password salah' 
      }
    }
  },

  // Sign out
  async signOut() {
    try {
      await authService.signOut()
      set({
        user: null,
        profile: null,
        permissions: [],
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  // Update user profile
  async updateProfile(updates) {
    try {
      const { user } = get()
      if (!user) throw new Error('User not authenticated')
      
      const profile = await authService.updateUserProfile(user.id, updates)
      set({ profile })
      return { success: true, data: profile }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Update profile error:', error)
      }
      return { success: false, error: error.message }
    }
  },

  // Check if user has specific permission
  hasPermission(pageCode) {
    const { permissions, profile } = get()
    
    // Superadmin hanya punya akses ke dashboard dan manajemen_pengguna
    if (profile?.peran === 'superadmin') {
      return pageCode === 'dashboard' || pageCode === 'manajemen_pengguna'
    }
    
    // Admin SKPD punya akses ke manajemen_pengguna untuk manage Penulis
    if (profile?.peran === 'admin_skpd' && pageCode === 'manajemen_pengguna') {
      return true
    }
    
    return permissions.includes(pageCode)
  },

  // Check if user can create specific role
  canCreateRole(targetRole) {
    const { profile } = get()
    if (!profile) return false
    
    if (profile.peran === 'superadmin') {
      return targetRole === 'admin_skpd'
    }
    if (profile.peran === 'admin_skpd') {
      return targetRole === 'penulis'
    }
    return false
  },

  // Refresh permissions
  async refreshPermissions() {
    try {
      const { user } = get()
      if (!user) return
      
      const { penggunaService } = await import('../services/penggunaService')
      const permissionCodes = await penggunaService.getPermissionCodes(user.id)
      
      set({ permissions: permissionCodes || [] })
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Refresh permissions error:', error)
      }
    }
  },
}))

export default useAuthStore

