import { useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRealtimeChannel } from './use-realtime'

export const useChat = (channelName: string) => {
  const [messages, setMessages] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useRealtimeChannel(channelName, (payload) => {
    setMessages(prev => [...prev, payload])
  })

  const sendMessage = useCallback(async (message: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    await supabase
      .channel(channelName)
      .send({
        type: 'broadcast',
        event: 'message',
        payload: {
          id: Date.now().toString(),
          text: message,
          user_id: user.id,
          created_at: new Date().toISOString()
        }
      })
  }, [channelName, supabase])

  return { messages, sendMessage }
}