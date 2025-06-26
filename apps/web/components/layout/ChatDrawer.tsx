'use client'

import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useRealtimeChannel } from '@/hooks'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
const ChatDrawer: React.FC<{ channel?: string }> = ({
  channel = 'public-chat',
}) => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([])
  useRealtimeChannel(channel, (payload) => setMessages((m) => [...m, payload]))
  return (
    <>
      <button
        className="p-2 rounded-full hover:bg-zinc-100"
        onClick={() => setOpen(true)}
      >
        <MessageCircle size={18} />
      </button>
      {open && (
        <div className="fixed right-0 top-0 z-40 w-80 h-full bg-white border-l shadow px-4 py-6 flex flex-col">
          <header className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Chat</h3>
            <button onClick={() => setOpen(false)}>✕</button>
          </header>
          <div className="flex-1 overflow-y-auto space-y-2 text-sm">
            {messages.map((m) => (
              <div key={m.id} className="p-2 bg-zinc-100 rounded">
                {m.text}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const i = (e.target as HTMLFormElement).elements.namedItem(
                'msg'
              ) as HTMLInputElement
              const text = i.value.trim()
              if (!text) return
              const supabase = createClientComponentClient()
              supabase.channel(channel).send({
                type: 'broadcast',
                event: 'message',
                payload: { id: Date.now().toString(), text },
              })
              i.value = ''
            }}
            className="pt-2"
          >
            <input
              name="msg"
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Type…"
            />
          </form>
        </div>
      )}
    </>
  )
}
export default ChatDrawer
