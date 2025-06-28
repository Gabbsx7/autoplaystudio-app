'use client'

import React, { useState } from 'react'
import { Grid, List, Filter, Search } from 'lucide-react'
import MemberCard from './MemberCard'

interface TeamMember {
  id: string
  name: string
  role: string
  client?: string
  avatar: string
  isFTE?: boolean
  email?: string
}

interface TeamCardProps {
  members: TeamMember[]
  className?: string
}

type ViewMode = 'grid' | 'list'

export default function TeamCard({ members, className }: TeamCardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [clientFilter, setClientFilter] = useState('all')

  // Get unique roles and clients for filters
  const roles = Array.from(new Set(members.map((m) => m.role)))
  const clients = Array.from(
    new Set(members.map((m) => m.client).filter(Boolean))
  )

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.client?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    const matchesClient =
      clientFilter === 'all' || member.client === clientFilter

    return matchesSearch && matchesRole && matchesClient
  })

  return (
    <div
      className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 ${
        className || ''
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Clients</option>
              {clients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid/List */}
      <div className="p-6">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No members found matching your criteria.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                {...member}
                className={viewMode === 'list' ? 'w-full' : ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
