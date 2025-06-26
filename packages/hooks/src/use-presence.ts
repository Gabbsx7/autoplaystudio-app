import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const usePresence = (channel: string) => {
  const [presence, setPresence] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const ch = supabase
      .channel(channel)
      .on('presence', { event: 'sync' }, () => {
        const newState = ch.presenceState()
        setPresence(Object.values(newState).flat())
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setPresence(prev => [...prev, ...newPresences])
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        setPresence(prev => prev.filter(p => !leftPresences.includes(p)))
      })

    ch.subscribe()

    return () => {
      supabase.removeChannel(ch)
    }
  }, [channel, supabase])

  return presence
}