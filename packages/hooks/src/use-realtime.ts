import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { RealtimeChannel } from '@supabase/supabase-js'

export const useRealtimeChannel = (
  channel: string,
  onPayload: (payload: any) => void
) => {
  useEffect(() => {
    const supabase = createClientComponentClient()
    const ch: RealtimeChannel = supabase
      .channel(channel)
      .on('broadcast', { event: 'message' }, ({ payload }) => onPayload(payload))
    
    ch.subscribe()
    
    return () => {
      supabase.removeChannel(ch)
    }
  }, [channel, onPayload])
}