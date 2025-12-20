import { supabase, supabaseAdmin } from './supabase'

// Helper untuk timeout query
async function withTimeout(promise, timeoutMs = 2000) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
  })
  return Promise.race([promise, timeout])
}

export const penggunaService = {
  // Get count pengguna (untuk dashboard stats)
  async getCount() {
    const queryFn = async () => {
      const { count, error } = await supabase
        .from('pengguna')
        .select('id', { count: 'planned', head: true })
      
      if (error) throw error
      return count || 0
    }

    // Timeout pendek (2 detik), tidak ada retry - jika gagal return 0
    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      // Jika gagal, return 0 untuk tidak block UI
      console.warn('Failed to get pengguna count:', error)
      return 0
    }
  },

  // Get all pengguna (with creator info)
  async getAll() {
    // Load all users
    const { data, error } = await supabase
      .from('pengguna')
      .select('*')
      .order('dibuat_pada', { ascending: false })
    
    if (error) throw error
    
    // Get unique creator IDs
    const creatorIds = [...new Set((data || []).map(u => u.dibuat_oleh).filter(Boolean))]
    
    // Load all creators in one query
    const creators = creatorIds.length > 0 ? await supabase
      .from('pengguna')
      .select('id, email, nama_lengkap, peran')
      .in('id', creatorIds)
      .then(({ data: creatorsData, error: creatorsError }) => {
        if (creatorsError) {
          console.warn('Error loading creators:', creatorsError)
          return []
        }
        return creatorsData || []
      }) : []
    
    // Create map for quick lookup
    const creatorsMap = new Map(creators.map(c => [c.id, c]))
    
    // Attach creator info to users
    const dataWithCreator = (data || []).map(user => ({
      ...user,
      creator_info: user.dibuat_oleh && creatorsMap.has(user.dibuat_oleh) ? {
        id: creatorsMap.get(user.dibuat_oleh).id,
        email: creatorsMap.get(user.dibuat_oleh).email,
        nama_lengkap: creatorsMap.get(user.dibuat_oleh).nama_lengkap,
        peran: creatorsMap.get(user.dibuat_oleh).peran,
      } : null
    }))
    
    return dataWithCreator
  },

  // Get pengguna by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('pengguna')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create pengguna (create user di Supabase Auth terlebih dahulu)
  async create(adminData) {
    // Validate admin client tersedia
    if (!supabaseAdmin) {
      throw new Error(
        'Service Role Key tidak tersedia. ' +
        'Tambahkan VITE_SUPABASE_SERVICE_ROLE_KEY ke file .env untuk enable create user.'
      )
    }
    
    // Create user di Supabase Auth menggunakan admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      email_confirm: true,
    })
    
    if (authError) throw authError

    // Create user profile dengan dibuat_oleh
    const { data, error } = await supabase
      .from('pengguna')
      .insert({
        id: authData.user.id,
        email: adminData.email,
        peran: adminData.peran || 'admin',
        nama_lengkap: adminData.nama_lengkap,
        aktif: adminData.aktif !== undefined ? adminData.aktif : true,
        dibuat_oleh: adminData.dibuat_oleh || null,  // Set dibuat_oleh dari adminData
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating pengguna profile:', error)
      throw error
    }
    
    return data
  },

  // Update pengguna
  async update(id, adminData) {
    // Tambahkan diperbarui_pada secara manual untuk avoid trigger issues
    const updateData = {
      ...adminData,
      diperbarui_pada: new Date().toISOString(),
    }
    
    const { data, error } = await supabase
      .from('pengguna')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update password (via Supabase Auth Admin API)
  async updatePassword(userId, newPassword) {
    if (!supabaseAdmin) {
      throw new Error('Service Role Key tidak tersedia untuk update password')
    }
    
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    )
    
    if (error) throw error
    return data
  },

  // Delete pengguna
  async delete(id) {
    if (!supabaseAdmin) {
      throw new Error('Service Role Key tidak tersedia untuk delete user')
    }
    
    // Delete dari Supabase Auth (akan cascade ke pengguna karena ON DELETE CASCADE)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
    
    if (error) throw error
  },

  // Get permissions for user
  async getPermissions(userId) {
    const { data, error } = await supabase
      .from('pengguna_hak_akses')
      .select(`
        id,
        hak_akses_id,
        hak_akses:hak_akses_id (
          id,
          kode_halaman,
          nama_halaman,
          deskripsi,
          kategori
        )
      `)
      .eq('pengguna_id', userId)
    
    if (error) throw error
    return data || []
  },

  // Get permission codes only (array of strings)
  async getPermissionCodes(userId) {
    const permissions = await this.getPermissions(userId)
    return permissions.map(p => p.hak_akses?.kode_halaman).filter(Boolean)
  },

  // Assign permissions to user (replace all existing)
  async assignPermissions(userId, permissionIds) {
    // First, delete all existing permissions
    const { error: deleteError } = await supabase
      .from('pengguna_hak_akses')
      .delete()
      .eq('pengguna_id', userId)
    
    if (deleteError) throw deleteError

    // Then insert new permissions
    if (permissionIds && permissionIds.length > 0) {
      const inserts = permissionIds.map(hakAksesId => ({
        pengguna_id: userId,
        hak_akses_id: hakAksesId,
      }))

      const { error: insertError } = await supabase
        .from('pengguna_hak_akses')
        .insert(inserts)
      
      if (insertError) throw insertError
    }
  },

  // Remove specific permissions from user
  async removePermissions(userId, permissionIds) {
    const { error } = await supabase
      .from('pengguna_hak_akses')
      .delete()
      .eq('pengguna_id', userId)
      .in('hak_akses_id', permissionIds)
    
    if (error) throw error
  },

  // Get users created by a specific user (with creator info)
  async getCreatedUsers(creatorId) {
    // Load users created by creatorId
    const { data, error } = await supabase
      .from('pengguna')
      .select('*')
      .eq('dibuat_oleh', creatorId)
      .eq('peran', 'penulis')  // Explicitly filter only penulis
      .order('dibuat_pada', { ascending: false })
    
    if (error) {
      console.error('Error in getCreatedUsers:', error)
      throw error
    }
    
    // Load creator info separately (the creator is the Admin SKPD/Superadmin who created these users)
    // Since we're loading users created BY creatorId, the creator for all these users is the same (creatorId)
    const { data: creator, error: creatorError } = await supabase
      .from('pengguna')
      .select('id, email, nama_lengkap, peran')
      .eq('id', creatorId)
      .single()
    
    if (creatorError) {
      console.warn('Error loading creator info:', creatorError)
    }
    
    // Attach creator info to all users
    const dataWithCreator = (data || []).map(user => ({
      ...user,
      creator_info: creator ? {
        id: creator.id,
        email: creator.email,
        nama_lengkap: creator.nama_lengkap,
        peran: creator.peran,
      } : null
    }))
    
    return dataWithCreator
  },

  // Get admin stats (total and nonaktif count)
  async getAdminStats() {
    const queryFn = async () => {
      const [totalResult, nonaktifResult] = await Promise.all([
        supabase.from('pengguna').select('id', { count: 'exact', head: true }),
        supabase.from('pengguna').select('id', { count: 'exact', head: true }).eq('aktif', false),
      ])

      return {
        total: totalResult.count || 0,
        nonaktif: nonaktifResult.count || 0,
      }
    }

    try {
      return await withTimeout(queryFn(), 2000)
    } catch (error) {
      console.warn('Failed to get admin stats:', error)
      return { total: 0, nonaktif: 0 }
    }
  },
}

