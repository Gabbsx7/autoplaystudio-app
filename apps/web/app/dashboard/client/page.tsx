// apps/web/app/dashboard/client/page.tsx - Layout corrigido
'use client'

import { useClientData } from '../../../hooks/use-client-data'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { RecentUpdateCard } from '@/components/dashboard/RecentUpdateCard'
import { FeaturedProjectBanner } from '@/components/dashboard/FeaturedProjectBanner'
import { SearchBar } from '@/components/dashboard/SearchBar'
import {
  Calendar,
  Users,
  Image,
  Video,
  File,
  Loader2,
  AlertCircle,
  Folder,
} from 'lucide-react'
import { TemplatesSection } from '@/components/dashboard/Templates'
import { useRouter } from 'next/navigation'
import { ProjectTemplate } from '@/components/dashboard/ProjectTemplate'

export default function ClientDashboardPage() {
  const {
    client,
    projects,
    assets,
    teamMembers,
    milestones,
    stats,
    loading,
    error,
    isStudioMember,
  } = useClientData()

  const router = useRouter()

  // MOCK: lista de templates
  const templates = [
    {
      id: '1',
      title: 'CGI Project TEMPLATE',
      description:
        'Currently in production: a CGI video for Footlocker/Footlocker/Footlocker featuring...',
      image:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '2',
      title: 'Animation Project TEMPLATE',
      description:
        'Currently in production: a CGI video for Footlocker/Footlocker/Footlocker featuring...',
      image:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '3',
      title: 'Branding Project TEMPLATE',
      description:
        'Currently in production: a CGI video for Footlocker/Footlocker/Footlocker featuring...',
      image:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '4',
      title: 'Other Project TEMPLATE',
      description:
        'Currently in production: a CGI video for Footlocker/Footlocker/Footlocker featuring...',
      image:
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    },
  ]

  const handleCreateTemplate = () => {
    router.push('/dashboard/client/project/new')
  }

  const handleSelectTemplate = (template: any) => {
    router.push(`/dashboard/client/project/${template.id}`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading client data...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <span>Error: {error}</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Client not found</h2>
            <p className="text-muted-foreground">
              Unable to find client data associated with your account.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Projeto em destaque (primeiro projeto ativo ou o mais recente)
  const featuredProject =
    projects.find(
      (p: any) => p.status === 'active' || p.status === 'in_progress'
    ) || projects[0]

  // Assets recentes (últimos 6)
  const recentAssets = assets.slice(0, 6)

  // Milestones próximos (próximos 5 dias)
  const upcomingMilestones = milestones
    .filter((m: any) => m.status === 'pending' && m.due_date)
    .filter((m: any) => {
      const dueDate = new Date(m.due_date!)
      const today = new Date()
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays <= 5
    })
    .sort(
      (a: any, b: any) =>
        new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
    )
    .slice(0, 5)

  if (!client) {
    // Dados de template para novos clientes
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Client not found</h2>
            <p className="text-muted-foreground">
              Unable to find client data associated with your account.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-2">
        {/* Indicador para Studio Members */}
        {isStudioMember && client && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">
                    {client.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-purple-900">
                    Studio View: {client.name} Dashboard
                  </h3>
                  <p className="text-xs text-purple-600">
                    You are viewing this client's dashboard as a studio member
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  window.location.href = '/dashboard/studio'
                }}
                className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-white border border-purple-300 rounded-md hover:bg-purple-50 transition-colors"
              >
                ← Back to Studio
              </button>
            </div>
          </div>
        )}

        {/* Campo de busca alinhado à esquerda */}
        <div className="py-4 pl-6 mb-2">
          <div className="w-full max-w-md">
            <SearchBar placeholder="Search projects, assets..." />
          </div>
        </div>

        {/* Grid horizontal dos 3 primeiros cards */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project: any) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.name}
                description={project.description}
                status={project.status}
                progress={project.progress || 0}
                dueDate={project.due_date}
                teamMembers={teamMembers.slice(0, 4).map((member: any) => ({
                  id: member.id,
                  name: member.name,
                  avatar: member.avatar_url || 'https://placehold.co/32x32',
                }))}
                milestones={milestones
                  .filter((m: any) => m.project_id === project.id)
                  .slice(0, 4)
                  .map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    status: m.status,
                  }))}
              />
            ))}
          </div>
        </div>
        <div className="h-8 md:h-12" />

        {/* Featured Project Banner */}
        {featuredProject && (
          <FeaturedProjectBanner
            project={{
              id: featuredProject.id,
              title: featuredProject.name,
              description: featuredProject.description,
              status: featuredProject.status,
              progress: featuredProject.progress || 0,
              dueDate: featuredProject.due_date,
              teamMembers: teamMembers.slice(0, 4).map((member: any) => ({
                id: member.id,
                name: member.name,
                avatar: member.avatar_url || 'https://placehold.co/32x32',
              })),
              image:
                'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
            }}
          />
        )}

        {/* Templates Section */}
        <TemplatesSection
          templates={templates}
          onCreateTemplate={handleCreateTemplate}
          onSelectTemplate={handleSelectTemplate}
        />

        {/* Project Templates (mock) */}
        <div className="w-full py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectTemplate
              title="Footlocker CGI production"
              description="Currently in production: a CGI video for Footlocker/Footlocker/Footlocker featuring..."
              image="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80"
              onClick={() => alert('View project 1')}
            />
            <ProjectTemplate
              title="Footlocker CGI production"
              description="Currently in production: a CGI video for Footlocker/Footlocker/Footlocker featuring..."
              image="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80"
              onClick={() => alert('View project 2')}
            />
          </div>
        </div>

        {/* Atualizações Recentes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Updates</h2>
          <div className="grid gap-4">
            {projects.slice(0, 2).map((project: any) => (
              <RecentUpdateCard
                key={project.id}
                id={project.id}
                type="comment"
                message={`Project "${project.name}" updated - Status: ${
                  project.status === 'active' ||
                  project.status === 'in_progress'
                    ? 'In Progress'
                    : project.status === 'completed'
                    ? 'Completed'
                    : project.status === 'paused'
                    ? 'Paused'
                    : project.status === 'cancelled'
                    ? 'Cancelled'
                    : project.status === 'draft'
                    ? 'Draft'
                    : 'Proposal'
                }`}
                project={project.name}
                time={new Date(
                  project.updated_at || project.created_at || Date.now()
                ).toLocaleDateString('en-US')}
                user="System"
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
