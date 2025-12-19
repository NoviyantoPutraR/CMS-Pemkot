// Utility untuk test koneksi network ke Supabase
export async function testNetworkConnection() {
  const SUPABASE_URL = 'https://hhzmoiypplyrjpydgnkb.supabase.co'
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhoem1vaXlwcGx5cmpweWRnbmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDU2NjcsImV4cCI6MjA4MDkyMTY2N30.b9Y60sf2ic820f-jb2ofrV_b8Th4iHSCXDGYSTC--dY'
  
  console.group('🌐 Network Connection Test')
  
  // Test 1: Basic connectivity
  try {
    console.log('Test 1: Testing basic connectivity to Supabase...')
    const startTime = Date.now()
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      signal: AbortSignal.timeout(5000), // 5 detik timeout
    })
    const duration = Date.now() - startTime
    console.log(`✅ Test 1 passed: Connected in ${duration}ms`)
    console.log('Response status:', response.status)
  } catch (error) {
    console.error('❌ Test 1 failed:', error)
    console.error('Error type:', error.name)
    console.error('Error message:', error.message)
  }
  
  // Test 2: Auth endpoint
  try {
    console.log('Test 2: Testing Auth endpoint...')
    const startTime = Date.now()
    const response = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
      },
      signal: AbortSignal.timeout(5000),
    })
    const duration = Date.now() - startTime
    console.log(`✅ Test 2 passed: Auth endpoint accessible in ${duration}ms`)
    console.log('Response status:', response.status)
    const text = await response.text()
    console.log('Response:', text)
  } catch (error) {
    console.error('❌ Test 2 failed:', error)
    console.error('Error type:', error.name)
    console.error('Error message:', error.message)
  }
  
  // Test 3: Direct login test (DISABLED - causes 400 error if credentials don't exist)
  // Commented out to avoid error in console
  /*
  try {
    console.log('Test 3: Testing direct login API call...')
    const startTime = Date.now()
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'sahabatadmin',
      }),
      signal: AbortSignal.timeout(10000), // 10 detik
    })
    const duration = Date.now() - startTime
    console.log(`✅ Test 3 passed: Login API call completed in ${duration}ms`)
    console.log('Response status:', response.status)
    const data = await response.json()
    if (response.ok) {
      console.log('✅ Login successful via direct API')
    } else {
      console.error('❌ Login failed:', data)
    }
  } catch (error) {
    console.error('❌ Test 3 failed:', error)
    console.error('Error type:', error.name)
    console.error('Error message:', error.message)
    if (error.name === 'TimeoutError') {
      console.error('⚠️ Request timeout - kemungkinan network issue atau Supabase service down')
    }
  }
  */
  
  console.groupEnd()
}

// Auto-run di development
if (import.meta.env.DEV) {
  setTimeout(() => {
    testNetworkConnection()
  }, 2000)
}

