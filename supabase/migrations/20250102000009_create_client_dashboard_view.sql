-- Drop existing view if exists
DROP VIEW IF EXISTS client_dashboard_view;

-- Create client dashboard view
CREATE VIEW client_dashboard_view AS
WITH client_projects AS (
  SELECT 
    p.id,
    p.name,
    p.description,
    p.status,
    p.client_id,
    p.created_at,
    p.updated_at,
    -- Calcular progresso baseado em milestones
    COALESCE(
      ROUND(
        (COUNT(DISTINCT CASE WHEN m.status = 'completed' THEN m.id END)::numeric / 
         NULLIF(COUNT(DISTINCT m.id), 0)) * 100
      ),
      0
    ) as progress
  FROM projects p
  LEFT JOIN milestones m ON m.project_id = p.id
  GROUP BY p.id, p.name, p.description, p.status, p.client_id, p.created_at, p.updated_at
),
client_assets AS (
  SELECT 
    media.id,
    media.name,
    CASE 
      WHEN media.mime_type LIKE 'image/%' THEN 'image'
      WHEN media.mime_type LIKE 'video/%' THEN 'video'
      ELSE 'document'
    END as type,
    media.file_path as url,
    media.file_path as thumbnail_url, -- Você pode melhorar isso depois
    p.id as project_id,
    p.client_id,
    media.created_at,
    media.file_size as size,
    media.width,
    media.height
  FROM media
  INNER JOIN projects p ON media.project_id = p.id
  WHERE media.project_id IS NOT NULL
),
client_team_members AS (
  SELECT 
    cu.client_id,
    u.id as user_id,
    u.name as user_name,
    u.email as user_email,
    u.avatar_url,
    r.name as role_name,
    COALESCE(cu.is_primary, false) as is_primary
  FROM client_users cu
  INNER JOIN users u ON cu.user_id = u.id
  LEFT JOIN roles r ON cu.role_id = r.id
),
client_milestones AS (
  SELECT 
    m.id,
    m.title as name,
    m.description,
    m.status,
    m.project_id,
    m.due_date,
    m.created_at,
    p.client_id
  FROM milestones m
  INNER JOIN projects p ON m.project_id = p.id
),
client_stats AS (
  SELECT 
    c.id as client_id,
    COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_projects,
    COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as completed_projects,
    COUNT(DISTINCT a.id) as total_assets,
    COUNT(DISTINCT CASE WHEN p.status = 'paused' THEN p.id END) as pending_reviews
  FROM clients c
  LEFT JOIN projects p ON p.client_id = c.id
  LEFT JOIN client_assets a ON a.client_id = c.id
  GROUP BY c.id
)
SELECT 
  c.id as client_id,
  c.name as client_name,
  c.description as client_description,
  -- Projects como JSON array
  COALESCE(
    json_agg(DISTINCT 
      CASE WHEN cp.id IS NOT NULL THEN
        jsonb_build_object(
          'id', cp.id,
          'name', cp.name,
          'description', cp.description,
          'status', cp.status,
          'client_id', cp.client_id,
          'created_at', cp.created_at,
          'updated_at', cp.updated_at,
          'progress', cp.progress
        )
      ELSE NULL END
    ) FILTER (WHERE cp.id IS NOT NULL),
    '[]'::json
  ) as projects,
  -- Assets como JSON array
  COALESCE(
    json_agg(DISTINCT 
      CASE WHEN ca.id IS NOT NULL THEN
        jsonb_build_object(
          'id', ca.id,
          'name', ca.name,
          'type', ca.type,
          'url', ca.url,
          'thumbnail_url', ca.thumbnail_url,
          'project_id', ca.project_id,
          'created_at', ca.created_at,
          'size', ca.size,
          'width', ca.width,
          'height', ca.height
        )
      ELSE NULL END
    ) FILTER (WHERE ca.id IS NOT NULL),
    '[]'::json
  ) as assets,
  -- Team members como JSON array
  COALESCE(
    json_agg(DISTINCT 
      CASE WHEN ctm.user_id IS NOT NULL THEN
        jsonb_build_object(
          'user_id', ctm.user_id,
          'user_name', ctm.user_name,
          'user_email', ctm.user_email,
          'avatar_url', ctm.avatar_url,
          'role_name', ctm.role_name,
          'is_primary', ctm.is_primary
        )
      ELSE NULL END
    ) FILTER (WHERE ctm.user_id IS NOT NULL),
    '[]'::json
  ) as team_members,
  -- Milestones como JSON array
  COALESCE(
    json_agg(DISTINCT 
      CASE WHEN cm.id IS NOT NULL THEN
        jsonb_build_object(
          'id', cm.id,
          'name', cm.name,
          'description', cm.description,
          'status', cm.status,
          'project_id', cm.project_id,
          'due_date', cm.due_date,
          'created_at', cm.created_at
        )
      ELSE NULL END
    ) FILTER (WHERE cm.id IS NOT NULL),
    '[]'::json
  ) as milestones,
  -- Stats como JSON object
  jsonb_build_object(
    'active_projects', COALESCE(cs.active_projects, 0),
    'completed_projects', COALESCE(cs.completed_projects, 0),
    'total_assets', COALESCE(cs.total_assets, 0),
    'pending_reviews', COALESCE(cs.pending_reviews, 0)
  ) as stats
FROM clients c
LEFT JOIN client_projects cp ON cp.client_id = c.id
LEFT JOIN client_assets ca ON ca.client_id = c.id
LEFT JOIN client_team_members ctm ON ctm.client_id = c.id
LEFT JOIN client_milestones cm ON cm.client_id = c.id
LEFT JOIN client_stats cs ON cs.client_id = c.id
GROUP BY c.id, c.name, c.description, cs.active_projects, cs.completed_projects, cs.total_assets, cs.pending_reviews;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_media_project_id ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_client_users_client_id ON client_users(client_id);

-- Grant permissions
GRANT SELECT ON client_dashboard_view TO authenticated;

-- Add RLS policies for the view
ALTER VIEW client_dashboard_view OWNER TO authenticated;

-- Add comment
COMMENT ON VIEW client_dashboard_view IS 'Consolidated view for client dashboard data including projects, assets, team members, milestones and statistics'; 