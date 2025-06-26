'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtime<T = any>(
  table: string,
  filter?: string,
  initialData: T[] = []
) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(true)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    let realtimeChannel: RealtimeChannel

    const setupRealtime = async () => {
      // Initial data fetch
      let query = supabase.from(table).select('*')
      
      if (filter) {
        // Parse filter string - format: "column=eq.value"
        const [column, condition] = filter.split('=')
        const [operator, value] = condition.split('.')
        query = query.filter(column, operator as any, value)
      }

      const { data: initialData, error } = await query
      
      if (!error && initialData) {
        setData(initialData)
      }
      setLoading(false)

      // Setup realtime subscription
      realtimeChannel = supabase
        .channel(`realtime-${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: filter,
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setData(current => [...current, payload.new as T])
            } else if (payload.eventType === 'UPDATE') {
              setData(current =>
                current.map(item =>
                  (item as any).id === payload.new.id ? payload.new as T : item
                )
              )
            } else if (payload.eventType === 'DELETE') {
              setData(current =>
                current.filter(item => (item as any).id !== payload.old.id)
              )
            }
          }
        )
        .subscribe()

      setChannel(realtimeChannel)
    }

    setupRealtime()

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
      }
    }
  }, [table, filter])

  return { data, loading, channel }
}
