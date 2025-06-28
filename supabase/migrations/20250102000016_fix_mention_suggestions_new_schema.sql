-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_mention_suggestions(uuid, text, text);

-- Create updated function with new studio/client schema
CREATE OR REPLACE FUNCTION get_mention_suggestions(
    user_id_param uuid,
    mention_type text,
    search_query text DEFAULT ''
)
RETURNS TABLE(id uuid, name text, type text) AS $$
DECLARE
    is_studio_member boolean := false;
    user_client_id uuid := null;
BEGIN
    -- Check if user is a studio member
    SELECT EXISTS(
        SELECT 1 FROM studio_members sm 
        WHERE sm.user_id = user_id_param
    ) INTO is_studio_member;
    
    -- If not studio member, get their client_id
    IF NOT is_studio_member THEN
        SELECT cu.client_id INTO user_client_id
        FROM client_users cu
        WHERE cu.user_id = user_id_param
        LIMIT 1;
        
        -- If user not found in either table, return empty
        IF user_client_id IS NULL THEN
            RETURN;
        END IF;
    END IF;
    
    -- User mentions
    IF mention_type = 'user' THEN
        IF is_studio_member THEN
            -- Studio members can see ALL users (studio + all clients)
            RETURN QUERY
            SELECT DISTINCT u.id, u.name, 'user'::text
            FROM users u
            WHERE u.name IS NOT NULL 
            AND u.id != user_id_param  -- Exclude self
            AND (search_query = '' OR LOWER(u.name) LIKE LOWER('%' || search_query || '%'))
            AND (
                EXISTS(SELECT 1 FROM studio_members sm WHERE sm.user_id = u.id) OR
                EXISTS(SELECT 1 FROM client_users cu WHERE cu.user_id = u.id)
            )
            ORDER BY u.name
            LIMIT 10;
        ELSE
            -- Client users can see their client members + ALL studio members
            RETURN QUERY
            SELECT DISTINCT u.id, u.name, 'user'::text
            FROM users u
            WHERE u.name IS NOT NULL 
            AND u.id != user_id_param  -- Exclude self
            AND (search_query = '' OR LOWER(u.name) LIKE LOWER('%' || search_query || '%'))
            AND (
                -- Same client members
                EXISTS(
                    SELECT 1 FROM client_users cu 
                    WHERE cu.user_id = u.id AND cu.client_id = user_client_id
                ) OR
                -- All studio members (they have macro vision)
                EXISTS(SELECT 1 FROM studio_members sm WHERE sm.user_id = u.id)
            )
            ORDER BY u.name
            LIMIT 10;
        END IF;
    END IF;
    
    -- Project mentions
    IF mention_type = 'project' THEN
        IF is_studio_member THEN
            -- Studio members can see all projects
            RETURN QUERY
            SELECT p.id, p.name, 'project'::text
            FROM projects p
            WHERE p.name IS NOT NULL
            AND (search_query = '' OR LOWER(p.name) LIKE LOWER('%' || search_query || '%'))
            ORDER BY p.name
            LIMIT 10;
        ELSE
            -- Client users can only see their client's projects
            RETURN QUERY
            SELECT p.id, p.name, 'project'::text
            FROM projects p
            WHERE p.name IS NOT NULL
            AND p.client_id = user_client_id
            AND (search_query = '' OR LOWER(p.name) LIKE LOWER('%' || search_query || '%'))
            ORDER BY p.name
            LIMIT 10;
        END IF;
    END IF;
    
    -- Milestone mentions
    IF mention_type = 'milestone' THEN
        IF is_studio_member THEN
            -- Studio members can see all milestones
            RETURN QUERY
            SELECT m.id, m.title, 'milestone'::text
            FROM milestones m
            JOIN projects p ON m.project_id = p.id
            WHERE m.title IS NOT NULL
            AND (search_query = '' OR LOWER(m.title) LIKE LOWER('%' || search_query || '%'))
            ORDER BY m.title
            LIMIT 10;
        ELSE
            -- Client users can only see their client's milestones
            RETURN QUERY
            SELECT m.id, m.title, 'milestone'::text
            FROM milestones m
            JOIN projects p ON m.project_id = p.id
            WHERE m.title IS NOT NULL
            AND p.client_id = user_client_id
            AND (search_query = '' OR LOWER(m.title) LIKE LOWER('%' || search_query || '%'))
            ORDER BY m.title
            LIMIT 10;
        END IF;
    END IF;
    
    -- Task mentions
    IF mention_type = 'task' THEN
        IF is_studio_member THEN
            -- Studio members can see all tasks
            RETURN QUERY
            SELECT t.id, t.name, 'task'::text
            FROM milestone_tasks t
            JOIN milestones m ON t.milestone_id = m.id
            JOIN projects p ON m.project_id = p.id
            WHERE t.name IS NOT NULL
            AND (search_query = '' OR LOWER(t.name) LIKE LOWER('%' || search_query || '%'))
            ORDER BY t.name
            LIMIT 10;
        ELSE
            -- Client users can only see their client's tasks
            RETURN QUERY
            SELECT t.id, t.name, 'task'::text
            FROM milestone_tasks t
            JOIN milestones m ON t.milestone_id = m.id
            JOIN projects p ON m.project_id = p.id
            WHERE t.name IS NOT NULL
            AND p.client_id = user_client_id
            AND (search_query = '' OR LOWER(t.name) LIKE LOWER('%' || search_query || '%'))
            ORDER BY t.name
            LIMIT 10;
        END IF;
    END IF;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 