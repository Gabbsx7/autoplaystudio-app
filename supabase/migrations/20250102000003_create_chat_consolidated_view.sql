-- Criar view consolidada para chat que facilita as consultas por client
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
  LEFT JOIN public.projects p ON p.client_id = c.id
  LEFT JOIN public.milestones m ON m.project_id = p.id
  LEFT JOIN public.milestone_tasks mt ON mt.milestone_id = m.id
  WHERE c.is_active = true
  GROUP BY c.id, c.name
)
SELECT * FROM client_data;

-- Criar função helper para buscar menções por client
CREATE OR REPLACE FUNCTION public.get_mention_suggestions(
  client_id_param uuid,
  mention_type text,
  search_query text DEFAULT ''
)
RETURNS jsonb AS $$
DECLARE
  result jsonb := '[]'::jsonb;
BEGIN
  CASE mention_type
    WHEN 'users' THEN
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', user_data->>'id',
          'name', user_data->>'name',
          'type', 'user'
        )
      ) INTO result
      FROM chat_consolidated_view ccv,
           jsonb_array_elements(ccv.users) as user_data
      WHERE ccv.client_id = client_id_param
        AND (search_query = '' OR LOWER(user_data->>'name') LIKE LOWER('%' || search_query || '%'));
        
    WHEN 'projects' THEN  
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', project_data->>'id',
          'name', project_data->>'name', 
          'type', 'project'
        )
      ) INTO result
      FROM chat_consolidated_view ccv,
           jsonb_array_elements(ccv.projects) as project_data
      WHERE ccv.client_id = client_id_param
        AND (search_query = '' OR LOWER(project_data->>'name') LIKE LOWER('%' || search_query || '%'));
        
    WHEN 'milestones' THEN
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', milestone_data->>'id',
          'name', milestone_data->>'title',
          'type', 'milestone'
        )
      ) INTO result  
      FROM chat_consolidated_view ccv,
           jsonb_array_elements(ccv.milestones) as milestone_data
      WHERE ccv.client_id = client_id_param
        AND (search_query = '' OR LOWER(milestone_data->>'title') LIKE LOWER('%' || search_query || '%'));
        
    WHEN 'tasks' THEN
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', task_data->>'id', 
          'name', task_data->>'name',
          'type', 'task'
        )
      ) INTO result
      FROM chat_consolidated_view ccv,
           jsonb_array_elements(ccv.tasks) as task_data  
      WHERE ccv.client_id = client_id_param
        AND (search_query = '' OR LOWER(task_data->>'name') LIKE LOWER('%' || search_query || '%'));
  END CASE;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql; 