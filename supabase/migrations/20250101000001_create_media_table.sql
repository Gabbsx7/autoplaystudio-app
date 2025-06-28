-- Criar tabela media que estava faltando
CREATE TABLE IF NOT EXISTS public.media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    file_path text NOT NULL,
    file_size bigint,
    mime_type text,
    width integer,
    height integer,
    alt_text text,
    description text,
    uploaded_by uuid REFERENCES public.users(id),
    client_id uuid REFERENCES public.clients(id),
    project_id uuid REFERENCES public.projects(id),
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Política RLS para media
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de acesso para media
CREATE POLICY "Users can view media from their clients" ON public.media
    FOR SELECT USING (
        client_id IN (
            SELECT cu.client_id 
            FROM public.client_users cu 
            WHERE cu.user_id = auth.uid()
        )
        OR is_public = true
    );

CREATE POLICY "Users can upload media" ON public.media
    FOR INSERT WITH CHECK (
        client_id IN (
            SELECT cu.client_id 
            FROM public.client_users cu 
            WHERE cu.user_id = auth.uid()
        )
    );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_media_client_id ON public.media(client_id);
CREATE INDEX IF NOT EXISTS idx_media_project_id ON public.media(project_id);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON public.media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON public.media(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at); 