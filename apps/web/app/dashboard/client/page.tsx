// apps/web/app/dashboard/client/page.tsx - Layout corrigido
'use client'

import React, { useState } from 'react'
import { RoleGuard } from '@/components/role-based/role-guard'
import SearchBar from '@/components/dashboard/SearchBar'
import ProjectCard from '@/components/dashboard/ProjectCard'
import AssetGallery from '@/components/dashboard/AssetGallery'
import FeaturedProjectBanner from '@/components/dashboard/FeaturedProjectBanner'
import RecentUpdateCard from '@/components/dashboard/RecentUpdateCard'
import QuickStats from '@/components/dashboard/QuickStats'
import { Grid, List, MoreHorizontal, Filter, Plus } from 'lucide-react'
import ProjectTemplate from '@/components/dashboard/ProjectTemplate'

export default function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState<'projects' | 'assets'>('projects')

  // Mock data baseado no Figma
  const mockProjects = [
    {
      id: '1',
      title: 'Footlocker CGI production',
      description:
        'Currently in production a CGI video for Footlocker featuring advanced 3D modeling and animation sequences.',
      status: 'in_progress' as const,
      teamMembers: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/32x32' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/32x32' },
        { id: '3', name: 'Bob Johnson', avatar: 'https://placehold.co/32x32' },
        { id: '4', name: 'Alice Brown', avatar: 'https://placehold.co/32x32' },
      ],
      milestones: [
        { id: '1', name: 'Concept Design', status: 'completed' as const },
        { id: '2', name: '3D Modeling', status: 'in_progress' as const },
        { id: '3', name: 'Animation', status: 'pending' as const },
        { id: '4', name: 'Final Render', status: 'pending' as const },
      ],
      progress: 65,
      dueDate: '2024-02-15',
    },
    {
      id: '2',
      title: 'Nike Brand Campaign',
      description:
        'Complete brand refresh campaign including digital assets, social media content, and print materials.',
      status: 'draft' as const,
      teamMembers: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/32x32' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/32x32' },
      ],
      progress: 25,
      dueDate: '2024-03-01',
    },
    {
      id: '3',
      title: 'Adidas Product Launch',
      description:
        'Product launch campaign with focus on sustainability and innovation messaging.',
      status: 'proposal' as const,
      teamMembers: [
        { id: '1', name: 'John Doe', avatar: 'https://placehold.co/32x32' },
        { id: '2', name: 'Jane Smith', avatar: 'https://placehold.co/32x32' },
        { id: '3', name: 'Bob Johnson', avatar: 'https://placehold.co/32x32' },
      ],
      progress: 10,
      dueDate: '2024-04-15',
    },
  ]

  const mockAssets = [
    {
      id: '1',
      type: 'image' as const,
      src: 'https://placehold.co/400x300',
      thumbnail: 'https://placehold.co/200x150',
      alt: 'Footlocker CGI Scene 1',
      width: 400,
      height: 300,
    },
    {
      id: '2',
      type: 'video' as const,
      src: 'https://placehold.co/400x300',
      thumbnail: 'https://placehold.co/200x150',
      alt: 'Nike Campaign Video',
      width: 400,
      height: 300,
    },
    {
      id: '3',
      type: 'image' as const,
      src: 'https://placehold.co/400x300',
      thumbnail: 'https://placehold.co/200x150',
      alt: 'Adidas Product Shot',
      width: 400,
      height: 300,
    },
    {
      id: '4',
      type: 'image' as const,
      src: 'https://placehold.co/400x300',
      thumbnail: 'https://placehold.co/200x150',
      alt: 'Brand Guidelines',
      width: 400,
      height: 300,
    },
  ]

  const mockRecentUpdates = [
    {
      id: '1',
      type: 'comment' as const,
      message: 'New comment on Footlocker project',
      project: 'Footlocker CGI production',
      time: '2 hours ago',
      user: 'John Doe',
    },
    {
      id: '2',
      type: 'milestone' as const,
      message: 'Milestone completed: Concept Design',
      project: 'Footlocker CGI production',
      time: '4 hours ago',
      user: 'Jane Smith',
    },
    {
      id: '3',
      type: 'asset' as const,
      message: 'New asset uploaded',
      project: 'Nike Brand Campaign',
      time: '1 day ago',
      user: 'Bob Johnson',
    },
  ]

  const mockStats = {
    activeProjects: 3,
    completedProjects: 12,
    totalAssets: 47,
    pendingReviews: 5,
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    console.log('Searching for:', query)
  }

  const handleProjectClick = (projectId: string) => {
    console.log('Navigate to project:', projectId)
  }

  const handleNewProject = () => {
    console.log('Create new project')
  }

  return (
    <RoleGuard allowedRoles={['client_admin', 'client_member', 'guest']}>
      {/* SECTION 1 */}
      <section className="mb-12 w-full max-w-5xl mx-auto px-2 sm:px-4 md:px-8 flex flex-col items-center justify-center pt-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for projects or assets"
        />
      </section>

      {/* SECTION 3 - movida para cima */}
      <section className="mb-16 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {mockProjects.map((project, idx) => (
            <div key={project.id} className="flex">
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="mb-16 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
        <div className="mb-10">
          <div className="w-full">
            <FeaturedProjectBanner project={mockProjects[0]} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'CGI Project',
            'Animation Project',
            'Branding Project',
            'Other Project',
          ].map((title, idx) => (
            <div
              key={title}
              className="rounded-2xl shadow bg-gradient-to-b from-zinc-900/80 to-black p-0 flex flex-col justify-end items-start min-h-[260px] max-w-full hover:shadow-lg transition-shadow"
            >
              <ProjectTemplate
                title={title + ' TEMPLATE'}
                description="Currently in production a CGI video for FootlockerFootlockerFootlocker featuring"
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="mb-12 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl shadow p-6 flex flex-col items-start bg-white hover:shadow-md transition-shadow"
            >
              <span className="text-gray-800 font-semibold mb-1">
                Marathon Videos CGI production
              </span>
              <span className="text-gray-400 text-xs mb-1">4 Projects</span>
              <span className="text-gray-400 text-xs">24 Assets</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 */}
      <section className="mb-20 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Footlocker CGI production
          </h2>
          <p className="text-gray-500 mb-4">
            Currently in production a CGI video for
            FootlockerFootlockerFootlocker featuring
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow">
            VIEW PROJECT
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockAssets.slice(0, 4).map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl shadow p-4 flex items-center justify-center min-h-[160px] hover:shadow-md transition-shadow"
            >
              <img
                src={asset.thumbnail}
                alt={asset.alt}
                className="object-cover rounded max-h-40 w-full"
              />
            </div>
          ))}
        </div>
      </section>
    </RoleGuard>
  )
}
