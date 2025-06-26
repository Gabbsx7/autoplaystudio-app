// apps/web/app/dashboard/client/page.tsx - Layout corrigido
'use client'

import React, { useState } from 'react'
import { RoleGuard } from '@/components/role-based/role-guard'
import SearchBar from '@/components/dashboard/SearchBar'
import ProjectCard from '@/components/dashboard/ProjectCard'

export default function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState('')

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
      <div className="w-full bg-stone-50">
        {/* Container seguindo exatamente o Figma */}
        <div className="px-6 py-8">
          {/* Search Bar Section - Posicionamento igual ao Figma */}
          <div className="mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for projects or assets"
            />
          </div>

          {/* Projects Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Your Projects
            </h2>

            {/* Grid de Projects - 3 colunas como no Figma */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  onClick={() => handleProjectClick(project.id)}
                />
              ))}
            </div>
          </section>

          {/* View Controls como no Figma */}
          <div className="flex justify-start items-center gap-4 mb-8">
            <button className="w-4 h-4 opacity-20 hover:opacity-80">
              <div className="w-[2.67px] h-[2.67px] left-[10.67px] top-[2.67px] absolute bg-neutral-800 rounded-full" />
            </button>

            <button className="w-4 h-4 opacity-80 hover:opacity-100">
              <div className="w-1 h-1 left-[2.67px] top-[2.67px] absolute rounded-[1px] outline outline-1 outline-offset-[-0.50px] outline-neutral-800" />
              <div className="w-1 h-1 left-[2.67px] top-[9.33px] absolute rounded-[1px] outline outline-1 outline-offset-[-0.50px] outline-neutral-800" />
              <div className="w-1 h-1 left-[9.33px] top-[9.33px] absolute rounded-[1px] outline outline-1 outline-offset-[-0.50px] outline-neutral-800" />
              <div className="w-1 h-1 left-[9.33px] top-[2.67px] absolute rounded-[1px] outline outline-1 outline-offset-[-0.50px] outline-neutral-800" />
            </button>

            <button className="w-4 h-4 opacity-20 hover:opacity-80">
              <div className="w-2.5 h-[3.33px] left-[2.67px] top-[3.33px] absolute rounded-[1px] outline outline-1 outline-offset-[-0.50px] outline-neutral-800" />
              <div className="w-2.5 h-[3.33px] left-[2.67px] top-[9.33px] absolute rounded-[1px] outline outline-1 outline-offset-[-0.50px] outline-neutral-800" />
            </button>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
