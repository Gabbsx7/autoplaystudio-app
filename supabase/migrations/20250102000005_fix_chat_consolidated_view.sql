-- Corrigir view consolidada para chat com coluna correta
DROP VIEW IF EXISTS public.chat_consolidated_view;

CREATE OR REPLACE VIEW public.chat_consolidated_view AS
WITH client_data AS (
  SELECT 
    c.id as client_id,
    c.name as client_name,
    
    -- Usuários do client
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'role', r.name
        )
      ) FILTER (WHERE u.id IS NOT NULL), 
      '[]'::jsonb
    ) as users,
    
    -- Projetos do client  
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', p.id,
          'name', p.name,
          'status', p.status
        )
      ) FILTER (WHERE p.id IS NOT NULL),
      '[]'::jsonb
    ) as projects,
    
    -- Milestones dos projetos do client
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', m.id,
          'title', m.title,
          'status', m.status,
          'project_id', m.project_id
        )
      ) FILTER (WHERE m.id IS NOT NULL),
      '[]'::jsonb
    ) as milestones,
    
    -- Tasks dos milestones
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', mt.id,
          'name', mt.name,
          'status', mt.status,
          'milestone_id', mt.milestone_id
        )
      ) FILTER (WHERE mt.id IS NOT NULL),
      '[]'::jsonb  
    ) as tasks
    
  FROM public.clients c
  LEFT JOIN public.client_users cu ON cu.client_id = c.id
  LEFT JOIN public.users u ON u.id = cu.user_id
  LEFT JOIN public.roles r ON r.id = cu.role_id
  LEFT JOIN public.projects p ON p.client_id = c.id  -- CORRIGIDO: client_id ao invés de company_id
  LEFT JOIN public.milestones m ON m.project_id = p.id
  LEFT JOIN public.milestone_tasks mt ON mt.milestone_id = m.id
  WHERE c.is_active = true
  GROUP BY c.id, c.name
)
SELECT * FROM client_data; 