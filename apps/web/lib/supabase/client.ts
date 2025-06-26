import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Verificar se as variáveis estão disponíveis
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

export const supabase = createClientComponentClient({
  supabaseUrl,
  supabaseKey,
})
