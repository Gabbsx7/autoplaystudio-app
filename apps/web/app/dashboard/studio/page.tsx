'use client'

import React, { useState } from 'react'
import { RoleGuard } from '@/components/role-based/role-guard'
import AssetNavigator from '@/components/studioDashboard/AssetNavigator'
import FolderFlow from '@/components/studioDashboard/FolderFlow'
import TemplateCard from '@/components/studioDashboard/TemplateCard'
import ProjectCard from '@/components/studioDashboard/ProjectCard'
import FolderCard from '@/components/studioDashboard/FolderCard'
import MemberCard from '@/components/studioDashboard/MemberCard'
import TeamCard from '@/components/studioDashboard/TeamCard'
import ClientCard from '@/components/studioDashboard/ClientCard'
import IntegrationsPanel from '@/components/studioDashboard/IntegrationsPanel'

export default function StudioDashboard() {
  // Mock data baseado no Figma
  const mockProjects = [
    {
      id: '1',
      name: 'Footlocker CGI Production',
      client: 'Footlocker',
      status: 'active' as const,
      assetsCount: 47,
      milestonesCount: 8,
      dueDate: '2024-02-15',
      teamMembers: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/32x32' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/32x32' },
        { id: '3', name: 'Bob Johnson', avatar: 'https://placehold.co/32x32' },
      ],
    },
    {
      id: '2',
      name: 'Nike Brand Campaign',
      client: 'Nike',
      status: 'active' as const,
      assetsCount: 23,
      milestonesCount: 5,
      dueDate: '2024-03-01',
      teamMembers: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/32x32' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/32x32' },
      ],
    },
    {
      id: '3',
      name: 'Adidas Product Launch',
      client: 'Adidas',
      status: 'pending' as const,
      assetsCount: 12,
      milestonesCount: 3,
      dueDate: '2024-04-15',
      teamMembers: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/32x32' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/32x32' },
        { id: '3', name: 'Bob Johnson', avatar: 'https://placehold.co/32x32' },
      ],
    },
  ]

  const mockFolders = [
    {
      id: '1',
      name: 'Assets',
      description: 'All project assets and resources',
      assetsCount: 156,
      subfoldersCount: 8,
      assetTypes: { images: 89, videos: 45, documents: 22 },
    },
    {
      id: '2',
      name: 'Templates',
      description: 'Reusable project templates',
      assetsCount: 23,
      subfoldersCount: 4,
      assetTypes: { images: 15, videos: 8 },
    },
    {
      id: '3',
      name: 'Documents',
      description: 'Project documentation and contracts',
      assetsCount: 67,
      subfoldersCount: 12,
      assetTypes: { documents: 67 },
    },
  ]

  const mockMembers = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Creative Director',
      client: 'Footlocker',
      avatar: 'https://placehold.co/32x32',
      isFTE: true,
      email: 'john@autoplaystudio.com',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: '3D Artist',
      client: 'Nike',
      avatar: 'https://placehold.co/32x32',
      isFTE: true,
      email: 'jane@autoplaystudio.com',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      role: 'Motion Designer',
      client: 'Adidas',
      avatar: 'https://placehold.co/32x32',
      isFTE: false,
      email: 'bob@autoplaystudio.com',
    },
  ]

  const mockClients = [
    {
      id: '1',
      name: 'Footlocker',
      description: 'Global athletic footwear retailer',
      projectsCount: 3,
      membersCount: 8,
      lastActive: '2 hours ago',
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Nike',
      description: 'Leading sports brand',
      projectsCount: 2,
      membersCount: 5,
      lastActive: '1 day ago',
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Adidas',
      description: 'German sportswear manufacturer',
      projectsCount: 1,
      membersCount: 3,
      lastActive: '3 days ago',
      status: 'pending' as const,
    },
  ]

  const handleProjectClick = (projectId: string) => {
    console.log('Navigate to project:', projectId)
  }

  const handleClientClick = (clientId: string) => {
    console.log('Navigate to client dashboard:', clientId)
  }

  const handleNewProject = () => {
    console.log('Create new project')
  }

  return (
    <RoleGuard allowedRoles={['studio_admin', 'studio_member']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Studio Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage projects, clients, and team members
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Asset Navigator */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <AssetNavigator className="h-[calc(100vh-200px)]" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Project Templates */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Project Templates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <TemplateCard
                  title="CGI Project"
                  description="3D modeling and rendering projects with advanced visual effects"
                  gradient="from-blue-900/80 to-blue-600"
                  onClick={handleNewProject}
                />
                <TemplateCard
                  title="Animation Project"
                  description="Motion graphics and animation sequences for brand campaigns"
                  gradient="from-purple-900/80 to-purple-600"
                  onClick={handleNewProject}
                />
                <TemplateCard
                  title="Branding Project"
                  description="Complete brand identity and visual design systems"
                  gradient="from-green-900/80 to-green-600"
                  onClick={handleNewProject}
                />
                <TemplateCard
                  title="Other Project"
                  description="Custom project templates for specialized requirements"
                  gradient="from-orange-900/80 to-orange-600"
                  onClick={handleNewProject}
                />
              </div>
            </section>

            {/* Active Projects */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Active Projects
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    {...project}
                    onClick={() => handleProjectClick(project.id)}
                  />
                ))}
              </div>
            </section>

            {/* Folder Management */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Folder Management
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {mockFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    {...folder}
                    onExpand={() => console.log('Expand folder:', folder.id)}
                  />
                ))}
              </div>
            </section>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Team Members */}
              <section>
                <TeamCard members={mockMembers} />
              </section>

              {/* Clients */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Clients
                </h2>
                <div className="space-y-4">
                  {mockClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      {...client}
                      onClick={() => handleClientClick(client.id)}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Integrations Panel */}
            <section>
              <IntegrationsPanel />
            </section>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
