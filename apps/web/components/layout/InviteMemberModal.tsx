import React, { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
interface Props {
  open: boolean
  onClose: () => void
}
const InviteMemberModal: React.FC<Props> = ({ open, onClose }) => {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const send = async () => {
    setLoading(true)
    await supabase.functions.invoke('send-invite', { body: { email } })
    setLoading(false)
    onClose()
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow">
        <h2 className="mb-4 text-lg font-semibold">Invite member</h2>
        <input
          className="w-full px-3 py-2 mb-4 border rounded"
          placeholder="email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-3 py-2 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm text-white bg-black rounded disabled:opacity-50"
            disabled={loading || !email}
            onClick={send}
          >
            {loading ? 'Sending…' : 'Send invite'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default InviteMemberModal
