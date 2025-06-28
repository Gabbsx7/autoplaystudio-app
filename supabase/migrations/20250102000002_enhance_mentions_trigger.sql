-- Melhorar função para processar notificações de menções
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
BEGIN
  IF NEW.mentions IS NOT NULL THEN
    -- Processar menções de usuários
    FOR mentioned_user_name IN SELECT jsonb_array_elements_text(NEW.mentions->'users') LOOP
      -- Buscar o user_id baseado no nome do usuário
      SELECT u.id INTO mentioned_user_id 
      FROM public.users u 
      WHERE LOWER(u.name) = LOWER(mentioned_user_name)
      LIMIT 1;
      
      -- Se encontrou o usuário, criar notificação
      IF mentioned_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
        VALUES (mentioned_user_id, NEW.user_id::uuid, 'mention', NULL);
      END IF;
    END LOOP;

    -- Processar menções de projetos
    IF NEW.mentions ? 'projects' THEN
      FOR mentioned_project_name IN SELECT jsonb_array_elements_text(NEW.mentions->'projects') LOOP
        SELECT p.id INTO project_id
        FROM public.projects p
        WHERE LOWER(p.name) = LOWER(mentioned_project_name)
        LIMIT 1;
        
        -- Notificar membros do projeto
        IF project_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          SELECT pm.user_id, NEW.user_id::uuid, 'mention', project_id
          FROM public.project_members pm
          WHERE pm.project_id = project_id
          AND pm.user_id != NEW.user_id::uuid;
        END IF;
      END LOOP;
    END IF;

    -- Processar menções de milestones  
    IF NEW.mentions ? 'milestones' THEN
      FOR mentioned_milestone_name IN SELECT jsonb_array_elements_text(NEW.mentions->'milestones') LOOP
        SELECT m.id, m.project_id INTO milestone_id, project_id
        FROM public.milestones m
        WHERE LOWER(m.title) = LOWER(mentioned_milestone_name)
        LIMIT 1;
        
        -- Notificar responsável do milestone e membros do projeto
        IF milestone_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          SELECT pm.user_id, NEW.user_id::uuid, 'mention', project_id
          FROM public.project_members pm
          WHERE pm.project_id = project_id
          AND pm.user_id != NEW.user_id::uuid;
        END IF;
      END LOOP;
    END IF;

    -- Processar menções de tasks
    IF NEW.mentions ? 'tasks' THEN
      FOR mentioned_task_name IN SELECT jsonb_array_elements_text(NEW.mentions->'tasks') LOOP
        SELECT mt.id, m.project_id INTO task_id, project_id
        FROM public.milestone_tasks mt
        JOIN public.milestones m ON m.id = mt.milestone_id
        WHERE LOWER(mt.name) = LOWER(mentioned_task_name)
        LIMIT 1;
        
        -- Notificar responsável da task e membros do projeto
        IF task_id IS NOT NULL THEN
          INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
          SELECT pm.user_id, NEW.user_id::uuid, 'mention', project_id
          FROM public.project_members pm
          WHERE pm.project_id = project_id
          AND pm.user_id != NEW.user_id::uuid;
        END IF;
      END LOOP;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 