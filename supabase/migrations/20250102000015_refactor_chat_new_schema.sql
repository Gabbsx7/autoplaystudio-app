-- Drop and recreate chat_consolidated_view with new studio/client schema
DROP VIEW IF EXISTS chat_consolidated_view;

-- Create consolidated view for chat autocomplete suggestions with new schema
CREATE VIEW chat_consolidated_view AS
-- Client users (for their own client context)
SELECT 
    u.id,
    u.name,
    u.email,
    u.avatar_url,
    'user' as entity_type,
    c.id as client_id,
    c.name as client_name,
    'client' as user_type
FROM users u
INNER JOIN client_users cu ON u.id = cu.user_id
INNER JOIN clients c ON cu.client_id = c.id
WHERE u.name IS NOT NULL

UNION ALL

-- Studio members (appear for ALL clients - they have macro vision)
SELECT 
    u.id,
    u.name,
    u.email,
    u.avatar_url,
    'user' as entity_type,
    c.id as client_id,
    c.name as client_name,
    'studio' as user_type
FROM users u
INNER JOIN studio_members sm ON u.id = sm.user_id
CROSS JOIN clients c  -- Studio members appear for all clients
WHERE u.name IS NOT NULL

UNION ALL

-- Projects (per client)
SELECT 
    p.id,
    p.name,
    p.description as email,
    NULL as avatar_url,
    'project' as entity_type,
    p.client_id,
    c.name as client_name,
    'project' as user_type
FROM projects p
INNER JOIN clients c ON p.client_id = c.id
WHERE p.name IS NOT NULL

UNION ALL

-- Milestones (per client)
SELECT 
    m.id,
    m.title as name,
    m.description as email,
    NULL as avatar_url,
    'milestone' as entity_type,
    p.client_id,
    c.name as client_name,
    'milestone' as user_type
FROM milestones m
INNER JOIN projects p ON m.project_id = p.id
INNER JOIN clients c ON p.client_id = c.id
WHERE m.title IS NOT NULL

UNION ALL

-- Tasks (per client)
SELECT 
    t.id,
    t.name,
    t.description as email,
    NULL as avatar_url,
    'task' as entity_type,
    p.client_id,
    c.name as client_name,
    'task' as user_type
FROM milestone_tasks t
INNER JOIN milestones m ON t.milestone_id = m.id
INNER JOIN projects p ON m.project_id = p.id
INNER JOIN clients c ON p.client_id = c.id
WHERE t.name IS NOT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_consolidated_client_id ON chat_consolidated_view (client_id);
CREATE INDEX IF NOT EXISTS idx_chat_consolidated_entity_type ON chat_consolidated_view (entity_type);
CREATE INDEX IF NOT EXISTS idx_chat_consolidated_user_type ON chat_consolidated_view (user_type);
CREATE INDEX IF NOT EXISTS idx_chat_consolidated_name ON chat_consolidated_view (name);

-- Grant permissions
GRANT SELECT ON chat_consolidated_view TO authenticated; 