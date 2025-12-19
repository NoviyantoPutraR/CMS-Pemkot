// Utility untuk test koneksi ke Supabase
import { supabase } from '../services/supabase'

export async function testSupabaseConnection() {
  console.group('🧪 Testing Supabase Connection')
  
  try {
    // Test 1: Cek Supabase client
    console.log('Test 1: Supabase client initialized?', !!supabase)
    console.log('Test 1: Supabase URL:', supabase.supabaseUrl)
    console.log('Test 1: Supabase Key exists?', !!supabase.supabaseKey)
    
    // Test 2: Cek koneksi dengan ping sederhana
    console.log('Test 2: Testing connection...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('pengguna')
      .select('count')
      .limit(0)
    
    if (healthError) {
      console.error('❌ Test 2 failed:', healthError)
      console.error('Error code:', healthError.code)
      console.error('Error message:', healthError.message)
      console.error('Error hint:', healthError.hint)
    } else {
      console.log('✅ Test 2 passed: Connection successful')
    }
    
    // Test 3: Cek auth service
    console.log('Test 3: Testing auth service...')
    try {
      const { data: session, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error('❌ Test 3 failed:', sessionError)
      } else {
        console.log('✅ Test 3 passed: Auth service accessible')
        console.log('Current session:', session?.session ? 'Active' : 'None')
      }
    } catch (authError) {
      console.error('❌ Test 3 exception:', authError)
    }
    
    console.groupEnd()
    return { success: !healthError }
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    console.groupEnd()
    return { success: false, error }
  }
}

// Auto-run test jika di development
if (import.meta.env.DEV) {
  // Run test setelah 1 detik (setelah semua module loaded)
  setTimeout(() => {
    testSupabaseConnection()
  }, 1000)
}

