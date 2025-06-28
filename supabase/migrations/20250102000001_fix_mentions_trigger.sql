-- Corrigir função para processar notificações de menções
CREATE OR REPLACE FUNCTION public.handle_mentions_notify()
RETURNS TRIGGER AS $$
DECLARE
  mentioned_user_name text;
  mentioned_user_id uuid;
BEGIN
  IF NEW.mentions IS NOT NULL THEN
    -- Iterar sobre todos os usuários mencionados por nome
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
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 