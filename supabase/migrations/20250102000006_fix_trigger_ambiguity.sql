-- Corrigir função para resolver ambiguidade de colunas
CREATE OR REPLACE FUNCTION public.handle_mentions_notify()
RETURNS TRIGGER AS $$
DECLARE
  mentioned_user_name text;
  mentioned_user_id uuid;
  mentioned_project_name text;
  mentioned_milestone_name text;
  mentioned_task_name text;
  found_project_id uuid;
  found_milestone_id uuid;
  found_task_id uuid;
  notification_count integer := 0;
  debug_info text := '';
BEGIN
  -- Log da função para debug
  debug_info := format('Processing mentions for message ID: %s, User: %s, Channel: %s', 
                      NEW.id, NEW.user_id, NEW.channel_id);
  RAISE NOTICE '%', debug_info;
  
  IF NEW.mentions IS NOT NULL THEN
    RAISE NOTICE 'Mentions found: %', NEW.mentions;
    
    -- Processar menções de usuários
    IF NEW.mentions ? 'users' THEN
      RAISE NOTICE 'Processing user mentions: %', NEW.mentions->'users';
      
      FOR mentioned_user_name IN SELECT jsonb_array_elements_text(NEW.mentions->'users') LOOP
        -- Buscar o user_id baseado no nome do usuário (busca mais flexível)
        SELECT u.id INTO mentioned_user_id 
        FROM public.users u 
        WHERE LOWER(TRIM(u.name)) = LOWER(TRIM(mentioned_user_name))
           OR LOWER(TRIM(u.email)) = LOWER(TRIM(mentioned_user_name))
        LIMIT 1;
        
        IF mentioned_user_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          VALUES (mentioned_user_id, NEW.user_id, 'mention', NULL);
          notification_count := notification_count + 1;
          RAISE NOTICE 'Created user mention notification for: % (ID: %)', mentioned_user_name, mentioned_user_id;
        ELSE
          RAISE NOTICE 'User not found for mention: %', mentioned_user_name;
        END IF;
      END LOOP;
    END IF;

    -- Processar menções de projetos
    IF NEW.mentions ? 'projects' THEN
      RAISE NOTICE 'Processing project mentions: %', NEW.mentions->'projects';
      
      FOR mentioned_project_name IN SELECT jsonb_array_elements_text(NEW.mentions->'projects') LOOP
        SELECT p.id INTO found_project_id
        FROM public.projects p
        WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(mentioned_project_name))
        LIMIT 1;
        
        -- Notificar membros do projeto (usando client_users pois não temos project_members)
        IF found_project_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          SELECT DISTINCT cu.user_id, NEW.user_id, 'mention', found_project_id
          FROM public.client_users cu
          JOIN public.projects p ON p.client_id = cu.client_id
          WHERE p.id = found_project_id
          AND cu.user_id != NEW.user_id;
          
          GET DIAGNOSTICS notification_count = ROW_COUNT;
          RAISE NOTICE 'Created % project mention notifications for: % (ID: %)', notification_count, mentioned_project_name, found_project_id;
        ELSE
          RAISE NOTICE 'Project not found for mention: %', mentioned_project_name;
        END IF;
      END LOOP;
    END IF;

    -- Processar menções de milestones  
    IF NEW.mentions ? 'milestones' THEN
      RAISE NOTICE 'Processing milestone mentions: %', NEW.mentions->'milestones';
      
      FOR mentioned_milestone_name IN SELECT jsonb_array_elements_text(NEW.mentions->'milestones') LOOP
        SELECT m.id, m.project_id INTO found_milestone_id, found_project_id
        FROM public.milestones m
        WHERE LOWER(TRIM(m.title)) = LOWER(TRIM(mentioned_milestone_name))
        LIMIT 1;
        
        -- Notificar membros do projeto do milestone (usando client_users)
        IF found_milestone_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          SELECT DISTINCT cu.user_id, NEW.user_id, 'mention', found_project_id
          FROM public.client_users cu
          JOIN public.projects p ON p.client_id = cu.client_id
          WHERE p.id = found_project_id
          AND cu.user_id != NEW.user_id;
          
          GET DIAGNOSTICS notification_count = ROW_COUNT;
          RAISE NOTICE 'Created % milestone mention notifications for: % (ID: %)', notification_count, mentioned_milestone_name, found_milestone_id;
        ELSE
          RAISE NOTICE 'Milestone not found for mention: %', mentioned_milestone_name;
        END IF;
      END LOOP;
    END IF;

    -- Processar menções de tasks
    IF NEW.mentions ? 'tasks' THEN
      RAISE NOTICE 'Processing task mentions: %', NEW.mentions->'tasks';
      
      FOR mentioned_task_name IN SELECT jsonb_array_elements_text(NEW.mentions->'tasks') LOOP
        SELECT mt.id, m.project_id INTO found_task_id, found_project_id
        FROM public.milestone_tasks mt
        JOIN public.milestones m ON m.id = mt.milestone_id
        WHERE LOWER(TRIM(mt.name)) = LOWER(TRIM(mentioned_task_name))
        LIMIT 1;
        
        -- Notificar responsável da task e membros do projeto (usando client_users)
        IF found_task_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          SELECT DISTINCT cu.user_id, NEW.user_id, 'mention', found_project_id
          FROM public.client_users cu
          JOIN public.projects p ON p.client_id = cu.client_id
          WHERE p.id = found_project_id
          AND cu.user_id != NEW.user_id;
          
          GET DIAGNOSTICS notification_count = ROW_COUNT;
          RAISE NOTICE 'Created % task mention notifications for: % (ID: %)', notification_count, mentioned_task_name, found_task_id;
        ELSE
          RAISE NOTICE 'Task not found for mention: %', mentioned_task_name;
        END IF;
      END LOOP;
    END IF;
  ELSE
    RAISE NOTICE 'No mentions found in message';
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in handle_mentions_notify: % - %', SQLERRM, SQLSTATE;
    RETURN NEW; -- Continue processing even if there's an error
END;
$$ LANGUAGE plpgsql;

-- Adicionar alguns membros aos projetos para teste
-- (Comentado porque estamos usando client_users em vez de project_members)
-- INSERT INTO public.project_members (project_id, user_id, created_by) 
-- SELECT 
--   p.id,
--   cu.user_id,
--   cu.user_id
-- FROM public.projects p
-- JOIN public.client_users cu ON cu.client_id = p.client_id
-- WHERE p.name = 'Marathon Amsterdam'
-- ON CONFLICT (project_id, user_id) DO NOTHING; 