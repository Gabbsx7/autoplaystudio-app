import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export const useSupabase = () => {
  const [supabase] = useState(() => createClientComponentClient())
  
  return supabase
}