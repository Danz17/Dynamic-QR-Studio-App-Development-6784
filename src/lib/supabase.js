import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vwwtwrxrlyopqlbcstpx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3d3R3cnhybHlvcHFsYmNzdHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MzY4NzMsImV4cCI6MjA2OTIxMjg3M30._mI54cUnKJ-YJZy2H1Bmwklf1082i59IyyW-BJgYAEc'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  console.warn('Supabase credentials not configured. Using mock data.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase