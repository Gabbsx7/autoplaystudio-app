-- Fix array parsing in mentions trigger
CREATE OR REPLACE FUNCTION handle_mentions_notify()
RETURNS TRIGGER AS $$
DECLARE
    mention_data jsonb;
    user_mentions jsonb;
    project_mentions jsonb;
    milestone_mentions jsonb;
    task_mentions jsonb;
    user_mention text;
    project_mention text;
    milestone_mention text;
    task_mention text;
    mentioned_user_id uuid;
    project_id uuid;
    milestone_id uuid;
    task_id uuid;
    client_id_param uuid;
    actor_uuid uuid;
BEGIN
    RAISE NOTICE 'Processing mentions for message ID: %, User: %, Channel: %', NEW.id, NEW.user_id, NEW.channel_id;
    
    -- Extract client_id from channel if it follows pattern chat:client-{uuid}
    IF NEW.channel_id LIKE 'chat:client-%' THEN
        client_id_param := REPLACE(NEW.channel_id, 'chat:client-', '')::uuid;
    ELSE
        -- For general chat or other channels, try to get first available client
        SELECT id INTO client_id_param FROM clients LIMIT 1;
    END IF;
    
    -- Convert user_id to UUID (assuming it's already a valid UUID string)
    BEGIN
        actor_uuid := NEW.user_id::uuid;
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'Invalid UUID format for user_id: %', NEW.user_id;
        RETURN NEW;
    END;
    
    -- Extract mentions from the message content
    mention_data := NEW.mentions;
    
    IF mention_data IS NULL THEN
        RETURN NEW;
    END IF;
    
    RAISE NOTICE 'Mentions found: %', mention_data;
    
    -- Process user mentions
    user_mentions := mention_data->'users';
    IF user_mentions IS NOT NULL AND jsonb_array_length(user_mentions) > 0 THEN
        RAISE NOTICE 'Processing user mentions: %', user_mentions;
        
        FOR user_mention IN SELECT jsonb_array_elements_text(user_mentions) LOOP
            -- Find user by name, prioritizing users in the same client
            SELECT u.id INTO mentioned_user_id
            FROM users u
            LEFT JOIN client_users cu ON u.id = cu.user_id AND cu.client_id = client_id_param
            WHERE LOWER(u.name) = LOWER(user_mention)
            ORDER BY (CASE WHEN cu.user_id IS NOT NULL THEN 1 ELSE 2 END)
            LIMIT 1;
            
            IF mentioned_user_id IS NOT NULL AND mentioned_user_id != actor_uuid THEN
                INSERT INTO notifications (recipient_id, actor_id, type, project_id, created_at, is_read)
                VALUES (mentioned_user_id, actor_uuid, 'mention', NULL, NOW(), false);
                RAISE NOTICE 'Created user mention notification for user: %', mentioned_user_id;
            END IF;
        END LOOP;
    END IF;
    
    -- Process project mentions
    project_mentions := mention_data->'projects';
    IF project_mentions IS NOT NULL AND jsonb_array_length(project_mentions) > 0 THEN
        RAISE NOTICE 'Processing project mentions: %', project_mentions;
        
        FOR project_mention IN SELECT jsonb_array_elements_text(project_mentions) LOOP
            SELECT p.id INTO project_id
            FROM projects p
            WHERE LOWER(p.name) = LOWER(project_mention)
            AND (client_id_param IS NULL OR p.client_id = client_id_param)
            LIMIT 1;
            
            IF project_id IS NOT NULL THEN
                -- Notify all project members
                INSERT INTO notifications (recipient_id, actor_id, type, project_id, created_at, is_read)
                SELECT DISTINCT pm.user_id, actor_uuid, 'mention', project_id, NOW(), false
                FROM project_members pm
                WHERE pm.project_id = project_id AND pm.user_id != actor_uuid;
                
                RAISE NOTICE 'Created project mention notifications for project: %', project_id;
            END IF;
        END LOOP;
    END IF;
    
    -- Process milestone mentions
    milestone_mentions := mention_data->'milestones';
    IF milestone_mentions IS NOT NULL AND jsonb_array_length(milestone_mentions) > 0 THEN
        RAISE NOTICE 'Processing milestone mentions: %', milestone_mentions;
        
        FOR milestone_mention IN SELECT jsonb_array_elements_text(milestone_mentions) LOOP
            SELECT m.id, m.project_id INTO milestone_id, project_id
            FROM milestones m
            JOIN projects p ON m.project_id = p.id
            WHERE LOWER(m.title) = LOWER(milestone_mention)
            AND (client_id_param IS NULL OR p.client_id = client_id_param)
            LIMIT 1;
            
            IF milestone_id IS NOT NULL AND project_id IS NOT NULL THEN
                -- Notify all project members for milestone mentions
                INSERT INTO notifications (recipient_id, actor_id, type, project_id, created_at, is_read)
                SELECT DISTINCT pm.user_id, actor_uuid, 'mention', project_id, NOW(), false
                FROM project_members pm
                WHERE pm.project_id = project_id AND pm.user_id != actor_uuid;
                
                RAISE NOTICE 'Created milestone mention notifications for milestone: %', milestone_id;
            END IF;
        END LOOP;
    END IF;
    
    -- Process task mentions
    task_mentions := mention_data->'tasks';
    IF task_mentions IS NOT NULL AND jsonb_array_length(task_mentions) > 0 THEN
        RAISE NOTICE 'Processing task mentions: %', task_mentions;
        
        FOR task_mention IN SELECT jsonb_array_elements_text(task_mentions) LOOP
            SELECT t.id, m.project_id INTO task_id, project_id
            FROM milestone_tasks t
            JOIN milestones m ON t.milestone_id = m.id
            JOIN projects p ON m.project_id = p.id
            WHERE LOWER(t.name) = LOWER(task_mention)
            AND (client_id_param IS NULL OR p.client_id = client_id_param)
            LIMIT 1;
            
            IF task_id IS NOT NULL AND project_id IS NOT NULL THEN
                -- Notify assigned user and project members
                INSERT INTO notifications (recipient_id, actor_id, type, project_id, created_at, is_read)
                SELECT DISTINCT 
                    CASE 
                        WHEN t.assigned_to IS NOT NULL THEN t.assigned_to
                        ELSE pm.user_id
                    END,
                    actor_uuid, 'mention', project_id, NOW(), false
                FROM milestone_tasks t
                LEFT JOIN project_members pm ON pm.project_id = project_id
                WHERE t.id = task_id 
                AND (t.assigned_to != actor_uuid OR pm.user_id != actor_uuid);
                
                RAISE NOTICE 'Created task mention notifications for task: %', task_id;
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN others THEN
    RAISE NOTICE 'Error in handle_mentions_notify: % - %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql; 