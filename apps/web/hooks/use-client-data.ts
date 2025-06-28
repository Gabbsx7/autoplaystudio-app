'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'

interface ClientData {
  id: string
  name: string
  description?: string
  logo?: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'in_progress' | 'draft' | 'proposal' | 'completed'
  client_id: string
  created_at: string
  updated_at: string
  due_date?: string
  progress?: number
}

interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  url: string
  thumbnail_url?: string
  project_id: string
  created_at: string
  size?: number
  width?: number
  height?: number
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar_url?: string
  is_primary: boolean
  client_id: string
}

interface Milestone {
  id: string
  name: string
  description?: string
  status: 'completed' | 'in_progress' | 'pending'
  project_id: string
  due_date?: string
  created_at: string
}

interface ClientDashboardData {
  client: ClientData | null
  projects: Project[]
  assets: Asset[]
  teamMembers: TeamMember[]
  milestones: Milestone[]
  stats: {
    activeProjects: number
    completedProjects: number
    totalAssets: number
    pendingReviews: number
  }
  loading: boolean
  error: string | null
}

interface ClientUserData {
  client_id: string
  clients: {
    id: string
    name: string
    description?: string
    logo_url?: string
  }
}

interface TeamMemberData {
  id: string
  users: {
    id: string
    name?: string
    email: string
    img_profile?: any
  }
  roles: {
    name: string
  }
  is_primary: boolean
}

export function useClientData(): ClientDashboardData {
  const { user } = useAuth()
  const [data, setData] = useState<ClientDashboardData>({
    client: null,
    projects: [],
    assets: [],
    teamMembers: [],
    milestones: [],
    stats: {
      activeProjects: 0,
      completedProjects: 0,
      totalAssets: 0,
      pendingReviews: 0,
    },
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!user) {
      setData((prev) => ({ ...prev, loading: false }))
      return
    }

    async function fetchClientData() {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }))

        // 1. Buscar dados do cliente do usuário atual
        const { data: clientUserData, error: clientUserError } = await supabase
          .from('client_users')
          .select(
            `
            client_id,
            clients (
              id,
              name,
              description,
              logo_url
            )
          `
          )
          .eq('user_id', user.id)
          .single()

        if (clientUserError || !clientUserData) {
          throw new Error(
            clientUserError?.message ||
              'Usuário não está associado a nenhum cliente'
          )
        }

        const clientId = clientUserData.client_id
        const client: ClientData = {
          id: clientUserData.clients.id,
          name: clientUserData.clients.name,
          description: clientUserData.clients.description,
          logo: clientUserData.clients.logo_url,
        }

        // 2. Tentar usar a view para buscar dados do dashboard
        const { data: dashboardData, error: dashboardError } = await supabase
          .from('client_dashboard_view')
          .select('*')
          .eq('client_id', clientId)
          .single()

        if (dashboardError) {
          console.warn(
            'Erro ao usar view, usando consultas individuais:',
            dashboardError
          )
          // Fallback para consultas individuais se a view não estiver disponível
          await fetchDataWithIndividualQueries(clientId, client)
          return
        }

        // 3. Processar dados da view
        if (dashboardData) {
          const {
            projects = [],
            assets = [],
            team_members = [],
            milestones = [],
            stats = {},
          } = dashboardData

          // Transformar dados dos membros da equipe
          const transformedTeamMembers: TeamMember[] = team_members.map(
            (tm: any) => ({
              id: tm.user_id,
              name: tm.user_name || 'Sem nome',
              email: tm.user_email,
              role: tm.role_name,
              avatar_url: tm.avatar_url,
              is_primary: tm.is_primary,
              client_id: clientId,
            })
          )

          setData({
            client,
            projects: projects || [],
            assets: assets || [],
            teamMembers: transformedTeamMembers,
            milestones: milestones || [],
            stats: {
              activeProjects: stats.active_projects || 0,
              completedProjects: stats.completed_projects || 0,
              totalAssets: stats.total_assets || 0,
              pendingReviews: stats.pending_reviews || 0,
            },
            loading: false,
            error: null,
          })
        } else {
          // Fallback para consultas individuais
          await fetchDataWithIndividualQueries(clientId, client)
        }
      } catch (error) {
        console.error('Erro ao buscar dados do cliente:', error)
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }))
      }
    }

    async function fetchDataWithIndividualQueries(
      clientId: string,
      client: ClientData
    ) {
      try {
        // 2. Buscar projetos do cliente
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('company_id', clientId)
          .order('created_at', { ascending: false })

        if (projectsError) {
          throw new Error(`Erro ao buscar projetos: ${projectsError.message}`)
        }

        // 3. Buscar assets dos projetos do cliente
        const projectIds = projects?.map((p: any) => p.id) || []

        // Buscar media através de milestones dos projetos
        const { data: milestones, error: milestonesError } = await supabase
          .from('milestones')
          .select('id')
          .in('project_id', projectIds)

        if (milestonesError) {
          throw new Error(
            `Erro ao buscar milestones: ${milestonesError.message}`
          )
        }

        const milestoneIds = milestones?.map((m: any) => m.id) || []

        // Buscar media através de milestones
        const { data: assets, error: assetsError } = await supabase
          .from('media')
          .select('*')
          .in('milestone_id', milestoneIds)
          .order('created_at', { ascending: false })

        if (assetsError) {
          throw new Error(`Erro ao buscar assets: ${assetsError.message}`)
        }

        // 4. Buscar membros da equipe do cliente - CORRIGIDO para usar img_profile
        const { data: teamMembers, error: teamError } = await supabase
          .from('client_users')
          .select(
            `
            id,
            users!inner (
              id,
              name,
              email,
              img_profile
            ),
            roles!inner (
              name
            ),
            is_primary
          `
          )
          .eq('client_id', clientId)

        if (teamError) {
          throw new Error(
            `Erro ao buscar membros da equipe: ${teamError.message}`
          )
        }

        // 5. Buscar milestones completos dos projetos
        const { data: fullMilestones, error: fullMilestonesError } =
          await supabase
            .from('milestones')
            .select('*')
            .in('project_id', projectIds)
            .order('created_at', { ascending: false })

        if (fullMilestonesError) {
          throw new Error(
            `Erro ao buscar milestones: ${fullMilestonesError.message}`
          )
        }

        // 6. Calcular estatísticas
        const activeProjects =
          projects?.filter((p: any) => p.status === 'in_progress').length || 0
        const completedProjects =
          projects?.filter((p: any) => p.status === 'completed').length || 0
        const totalAssets = assets?.length || 0
        const pendingReviews =
          projects?.filter((p: any) => p.status === 'draft').length || 0

        // 7. Transformar dados dos membros da equipe - CORRIGIDO para usar img_profile
        const transformedTeamMembers: TeamMember[] =
          (teamMembers as any[])?.map((tm) => ({
            id: tm.users.id,
            name: tm.users.name || 'Sem nome',
            email: tm.users.email,
            role: tm.roles.name,
            avatar_url: tm.users.img_profile?.url, // Usar img_profile.url
            is_primary: tm.is_primary,
            client_id: clientId,
          })) || []

        setData({
          client,
          projects: projects || [],
          assets: assets || [],
          teamMembers: transformedTeamMembers,
          milestones: fullMilestones || [],
          stats: {
            activeProjects,
            completedProjects,
            totalAssets,
            pendingReviews,
          },
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error('Erro ao buscar dados com consultas individuais:', error)
        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        }))
      }
    }

    // Usar Promise.resolve para evitar o erro React #31
    Promise.resolve().then(() => fetchClientData())
  }, [user])

  return data
}
