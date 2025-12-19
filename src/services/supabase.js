import { createClient } from '@supabase/supabase-js'

// Read environment variables dengan fallback untuk development
// Fallback values untuk membantu jika .env tidak terbaca
const FALLBACK_URL = 'https://hhzmoiypplyrjpydgnkb.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoem1vaXlwcGx5cmpweWRnbmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDU2NjcsImV4cCI6MjA4MDkyMTY2N30.b9Y60sf2ic820f-jb2ofrV_b8Th4iHSCXDGYSTC--dY'

// Baca dari import.meta.env (Vite environment variables)
const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const envServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Gunakan env vars jika ada, jika tidak gunakan fallback untuk development
const supabaseUrl = envUrl || (import.meta.env.DEV ? FALLBACK_URL : null)
const supabaseAnonKey = envKey || (import.meta.env.DEV ? FALLBACK_KEY : null)

// Debug logging (development only)
if (import.meta.env.DEV) {
  const usingFallback = !envUrl || !envKey
  
  if (usingFallback) {
    console.warn('⚠️ Using Supabase fallback values. Check .env file.')
  }
}

// Validate - harus ada URL dan Key (baik dari .env atau fallback)
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `
❌ Missing Supabase environment variables!

Please check your .env file in the root directory:
- VITE_SUPABASE_URL=${envUrl ? '✓ Set' : '✗ Missing'}
- VITE_SUPABASE_ANON_KEY=${envKey ? '✓ Set' : '✗ Missing'}

Make sure:
1. File .env exists in the root directory (same level as package.json)
2. Variables start with VITE_
3. No spaces around the = sign
4. Restart the dev server after creating/updating .env file
5. Clear Vite cache: Remove node_modules/.vite folder
  `
  console.error(errorMsg)
  throw new Error('Missing Supabase environment variables. Check console for details.')
}

// Trim whitespace if any
const cleanUrl = supabaseUrl.trim()
const cleanKey = supabaseAnonKey.trim()

if (!cleanUrl || !cleanKey) {
  throw new Error('Supabase environment variables are empty after trimming whitespace.')
}

// Create Supabase client (untuk operasi normal)
export const supabase = createClient(cleanUrl, cleanKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disabled untuk performa (enable jika ada email confirmation)
    flowType: 'pkce',
    storageKey: 'sb-auth-token', // Default storage key
  },
  global: {
    headers: {
      'x-client-info': 'sicms@1.0.0',
    },
  },
  db: {
    schema: 'public',
  },
})

// ============================================
// ADMIN CLIENT - UNTUK OPERASI ADMIN SAJA
// ============================================
// ⚠️ WARNING: Service Role Key memiliki akses penuh ke database!
// Hanya gunakan untuk operasi admin yang aman (create user, dll)
// Jangan expose di public-facing apps!
// ============================================
let supabaseAdmin = null

if (envServiceRoleKey) {
  supabaseAdmin = createClient(cleanUrl, envServiceRoleKey.trim(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      storageKey: 'sb-admin-auth-token', // Different storage key to avoid conflicts
    },
    global: {
      headers: {
        'x-client-info': 'sicms-admin@1.0.0',
      },
    },
  })
  
  if (import.meta.env.DEV) {
    console.log('✅ Admin client initialized (Service Role Key detected)')
  }
} else {
  if (import.meta.env.DEV) {
    console.warn('⚠️ Service Role Key not found. Admin operations (create user) will not work.')
    console.warn('Add VITE_SUPABASE_SERVICE_ROLE_KEY to .env file')
  }
}

export { supabaseAdmin }

