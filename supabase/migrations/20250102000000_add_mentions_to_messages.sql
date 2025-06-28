-- Adicionar coluna mentions à tabela messages (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'mentions') THEN
        ALTER TABLE public.messages ADD COLUMN mentions jsonb;
    END IF;
END $$;

-- Função para processar notificações de menções
CREATE OR REPLACE FUNCTION public.handle_mentions_notify()
RETURNS TRIGGER AS $$
DECLARE
  user_id text;
BEGIN
  IF NEW.mentions IS NOT NULL THEN
    -- Iterar sobre todos os usuários mencionados
    FOR user_id IN SELECT jsonb_array_elements_text(NEW.mentions->'users') LOOP
      -- Inserir notificação para cada usuário mencionado
      INSERT INTO public.notifications (recipient_id, actor_id, type, project_id)
      VALUES (user_id::uuid, NEW.user_id::uuid, 'mention', NULL);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar a função após inserir mensagem
DROP TRIGGER IF EXISTS trg_notify_mentions ON public.messages;
CREATE TRIGGER trg_notify_mentions
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_mentions_notify();

-- Adicionar política RLS para a nova coluna (se necessário)
-- A política já existe para mensagens, não precisamos de uma específica para mentions 