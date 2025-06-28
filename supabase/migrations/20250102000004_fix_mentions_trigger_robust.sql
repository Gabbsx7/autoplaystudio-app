-- Primeiro, corrigir o tipo da coluna user_id na tabela messages
-- Ela deveria ser uuid, não text
-- Precisa remover a policy antes de alterar o tipo
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;
ALTER TABLE public.messages ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
-- Recriar a policy
CREATE POLICY "Users can insert messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Criar função melhorada para processar notificações de menções
CREATE OR REPLACE FUNCTION public.handle_mentions_notify()
RETURNS TRIGGER AS $$
DECLARE
  mentioned_user_name text;
  mentioned_user_id uuid;
  mentioned_project_name text;
  mentioned_milestone_name text;
  mentioned_task_name text;
  project_id uuid;
  milestone_id uuid;
  task_id uuid;
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
        SELECT p.id INTO project_id
        FROM public.projects p
        WHERE LOWER(TRIM(p.name)) = LOWER(TRIM(mentioned_project_name))
        LIMIT 1;
        
        -- Notificar membros do projeto
        IF project_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          SELECT DISTINCT pm.user_id, NEW.user_id, 'mention', project_id
          FROM public.project_members pm
          WHERE pm.project_id = project_id
          AND pm.user_id != NEW.user_id;
          
          GET DIAGNOSTICS notification_count = ROW_COUNT;
          RAISE NOTICE 'Created % project mention notifications for: % (ID: %)', notification_count, mentioned_project_name, project_id;
        ELSE
          RAISE NOTICE 'Project not found for mention: %', mentioned_project_name;
        END IF;
      END LOOP;
    END IF;

    -- Processar menções de milestones  
    IF NEW.mentions ? 'milestones' THEN
      RAISE NOTICE 'Processing milestone mentions: %', NEW.mentions->'milestones';
      
      FOR mentioned_milestone_name IN SELECT jsonb_array_elements_text(NEW.mentions->'milestones') LOOP
        SELECT m.id, m.project_id INTO milestone_id, project_id
        FROM public.milestones m
        WHERE LOWER(TRIM(m.title)) = LOWER(TRIM(mentioned_milestone_name))
        LIMIT 1;
        
        -- Notificar membros do projeto do milestone
        IF milestone_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          SELECT DISTINCT pm.user_id, NEW.user_id, 'mention', project_id
          FROM public.project_members pm
          WHERE pm.project_id = project_id
          AND pm.user_id != NEW.user_id;
          
          GET DIAGNOSTICS notification_count = ROW_COUNT;
          RAISE NOTICE 'Created % milestone mention notifications for: % (ID: %)', notification_count, mentioned_milestone_name, milestone_id;
        ELSE
          RAISE NOTICE 'Milestone not found for mention: %', mentioned_milestone_name;
        END IF;
      END LOOP;
    END IF;

    -- Processar menções de tasks
    IF NEW.mentions ? 'tasks' THEN
      RAISE NOTICE 'Processing task mentions: %', NEW.mentions->'tasks';
      
      FOR mentioned_task_name IN SELECT jsonb_array_elements_text(NEW.mentions->'tasks') LOOP
        SELECT mt.id, m.project_id INTO task_id, project_id
        FROM public.milestone_tasks mt
        JOIN public.milestones m ON m.id = mt.milestone_id
        WHERE LOWER(TRIM(mt.name)) = LOWER(TRIM(mentioned_task_name))
        LIMIT 1;
        
        -- Notificar responsável da task e membros do projeto
        IF task_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          SELECT DISTINCT pm.user_id, NEW.user_id, 'mention', project_id
          FROM public.project_members pm
          WHERE pm.project_id = project_id
          AND pm.user_id != NEW.user_id;
          
          GET DIAGNOSTICS notification_count = ROW_COUNT;
          RAISE NOTICE 'Created % task mention notifications for: % (ID: %)', notification_count, mentioned_task_name, task_id;
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