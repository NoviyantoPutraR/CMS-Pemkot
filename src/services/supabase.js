import { createClient } from '@supabase/supabase-js'

// Baca dari import.meta.env (Vite environment variables)
const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const envServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
// Di production, environment variables HARUS diset, tidak ada fallback
if (!envUrl || !envKey) {
  const isProduction = import.meta.env.PROD
  
  const errorMsg = `
❌ Missing Supabase environment variables!

Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}
- VITE_SUPABASE_URL=${envUrl ? '✓ Set' : '✗ Missing'}
- VITE_SUPABASE_ANON_KEY=${envKey ? '✓ Set' : '✗ Missing'}

${isProduction 
  ? `⚠️ PRODUCTION MODE: Environment variables must be set in Vercel Dashboard!
  
  Setup steps:
  1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
  2. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
  3. Redeploy the application`
  : `Development setup:
  1. Copy .env.example to .env in the root directory
  2. Fill in your Supabase credentials
  3. Restart the dev server
  4. Clear Vite cache if needed: Remove node_modules/.vite folder`}
  `
  
  console.error(errorMsg)
  throw new Error('Missing Supabase environment variables. Check console for details.')
}

// Trim whitespace
const cleanUrl = envUrl.trim()
const cleanKey = envKey.trim()

// Validate format
if (!cleanUrl.startsWith('https://')) {
  throw new Error('VITE_SUPABASE_URL must be a valid HTTPS URL')
}

if (cleanKey.length < 100) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY seems invalid (too short)')
}

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

