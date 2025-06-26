'use client'

import { useState } from 'react'
import { X, Mail, UserPlus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { usePermissions } from '@/components/role-based/permissions'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
}

const roleOptions = [
  {
    value: 'studio_admin',
    label: 'Studio Admin',
    description: 'Full access to all features',
  },
  {
    value: 'studio_member',
    label: 'Studio Member',
    description: 'Studio team member access',
  },
  {
    value: 'client_admin',
    label: 'Client Admin',
    description: 'Manage client projects and team',
  },
  {
    value: 'client_member',
    label: 'Client Member',
    description: 'Work on assigned projects',
  },
  {
    value: 'guest',
    label: 'Guest',
    description: 'Limited access to specific projects',
  },
]

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const { role: currentUserRole } = usePermissions()
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  // Filter roles based on current user's role
  const availableRoles = roleOptions.filter((option) => {
    if (currentUserRole === 'studio_admin') return true
    if (currentUserRole === 'client_admin') {
      return ['client_admin', 'client_member', 'guest'].includes(option.value)
    }
    return false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Usar magic link do Supabase para enviar convite
      const { error } = await supabase.auth.admin.inviteUserByEmail(
        formData.email,
        {
          data: {
            role: formData.role,
            invited_by: currentUserRole,
            message: formData.message,
          },
        }
      )

      if (error) throw error

      // Sucesso
      onClose()
      setFormData({ email: '', role: '', message: '' })
      // TODO: Mostrar toast de sucesso
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Invite Team Member
              </h2>
              <p className="text-sm text-gray-500">
                Send an invitation to join your team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a role</option>
              {availableRoles.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add a personal message to the invitation..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
