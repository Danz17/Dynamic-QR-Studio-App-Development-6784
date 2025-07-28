import { createClient } from '@supabase/supabase-js'

// These will be replaced with actual values during deployment
const SUPABASE_URL = 'https://<PROJECT-ID>.supabase.co'
const SUPABASE_ANON_KEY = '<ANON_KEY>'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  console.warn('Supabase credentials not configured. Using mock data.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase;