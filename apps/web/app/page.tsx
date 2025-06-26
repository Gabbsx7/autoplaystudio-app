// apps/web/app/dashboard/client/page.tsx - Responsivo
'use client'

import React, { useState } from 'react'
import { RoleGuard } from '@/components/role-based/role-guard'
import SearchBar from '@/components/dashboard/SearchBar'
import ProjectCard from '@/components/dashboard/ProjectCard'
import { Grid, List, MoreHorizontal } from 'lucide-react'

export default function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock data baseado no Figma
  const mockProjects = [
    {
      id: '1',
      title: 'Footlocker CGI production',
      description:
        'Currently in production a CGI video for FootlockerFootlockerFootlockerFootlocker featuring',
      status: 'in_progress' as const,
      teamMembers: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/18x18' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/18x18' },
        { id: '3', name: 'Bob Johnson', avatar: 'https://placehold.co/18x18' },
        { id: '4', name: 'Alice Brown', avatar: 'https://placehold.co/18x18' },
      ],
      milestones: [
        { id: '1', name: 'Milestone 1', status: 'completed' as const },
        { id: '2', name: 'Milestone 2', status: 'in_progress' as const },
        { id: '3', name: 'Milestone 3', status: 'pending' as const },
        { id: '4', name: 'Milestone 4', status: 'pending' as const },
      ],
    },
    {
      id: '2',
      title: 'Footlocker CGI production',
      description:
        'Currently in production a CGI video for FootlockerFootlockerFootlockerFootlocker featuring',
      status: 'draft' as const,
      teamMembers: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/18x18' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/18x18' },
        { id: '3', name: 'Bob Johnson', avatar: 'https://placehold.co/18x18' },
        { id: '4', name: 'Alice Brown', avatar: 'https://placehold.co/18x18' },
      ],
    },
    {
      id: '3',
      title: 'Footlocker CGI production',
      description:
        'Currently in production a CGI video for FootlockerFootlockerFootlockerFootlocker featuring',
      status: 'proposal' as const,
      teamMembers: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/18x18' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/18x18' },
        { id: '3', name: 'Bob Johnson', avatar: 'https://placehold.co/18x18' },
        { id: '4', name: 'Alice Brown', avatar: 'https://placehold.co/18x18' },
      ],
    },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    console.log('Searching for:', query)
  }

  const handleProjectClick = (projectId: string) => {
    console.log('Navigate to project:', projectId)
  }

  return (
    <RoleGuard allowedRoles={['client_admin', 'client_member', 'guest']}>
      <div className="w-full bg-stone-50 min-h-[calc(100vh-44px)]">
        {/* Container com padding responsivo */}
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Search Bar Section */}
          <div className="mb-6 lg:mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for projects or assets"
            />
          </div>

          {/* Projects Section */}
          <section className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
                Your Projects
              </h2>

              {/* View Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 p-1 rounded hover:bg-gray-100 transition-colors ${
                    viewMode === 'grid' ? 'opacity-80' : 'opacity-20'
                  }`}
                >
                  <Grid size={16} />
                </button>

                <button
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 p-1 rounded hover:bg-gray-100 transition-colors ${
                    viewMode === 'list' ? 'opacity-80' : 'opacity-20'
                  }`}
                >
                  <List size={16} />
                </button>

                <button className="w-8 h-8 p-1 rounded hover:bg-gray-100 transition-colors opacity-20">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            {/* Grid de Projects - Responsivo */}
            <div
              className={`
              ${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6'
                  : 'flex flex-col gap-4'
              }
            `}
            >
              {mockProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  onClick={() => handleProjectClick(project.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </RoleGuard>
  )
}
