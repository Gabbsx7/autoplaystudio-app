import React, { useState } from 'react'
import { UploadButton, NotificationsButton, TasksButton } from '../common'
import ChatDrawer from './ChatDrawer'
import InviteMemberModal from './InviteMemberModal'
const TopNav: React.FC = () => {
  const [inviteOpen, setInviteOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-12 px-4 bg-white border-b">
      <div className="flex items-center gap-2 text-xs font-medium">
        Molecule
      </div>
      <div className="flex items-center gap-2">
        <UploadButton onSelect={() => {}} multiple />
        <TasksButton />
        <NotificationsButton />
        <ChatDrawer />
        <button
          onClick={() => setInviteOpen(true)}
          className="px-3 py-1 text-xs text-white bg-black rounded-2xl"
        >
          SHARE
        </button>
      </div>
      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </header>
  )
}
export default TopNav
