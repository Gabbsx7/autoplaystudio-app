-- Criar tabelas que estavam faltando no sistema original

-- Tabela de comentários em projetos
CREATE TABLE IF NOT EXISTS public.project_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    parent_id uuid REFERENCES public.project_comments(id) ON DELETE CASCADE,
    is_resolved boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tabela de membros de projetos (para controle granular de acesso)
CREATE TABLE IF NOT EXISTS public.project_members (
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    permissions jsonb DEFAULT '{}',
    created_by uuid REFERENCES public.users(id),
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (project_id, user_id)
);

-- Tabela de atividades/logs do projeto
CREATE TABLE IF NOT EXISTS public.project_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    activity_type text NOT NULL,
    description text NOT NULL,
    entity_id uuid, -- ID da entidade relacionada (milestone, task, etc)
    entity_type text, -- tipo da entidade (milestone, task, etc)
    metadata jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Tabela de tags/categorias
CREATE TABLE IF NOT EXISTS public.tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    color text DEFAULT '#6B7280',
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Tabela de relação entre projetos e tags
CREATE TABLE IF NOT EXISTS public.project_tags (
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

-- Políticas RLS
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para project_comments
CREATE POLICY "Users can view comments from their client projects" ON public.project_comments
    FOR SELECT USING (
        project_id IN (
            SELECT p.id 
            FROM public.projects p
            JOIN public.client_users cu ON cu.client_id = p.client_id
            WHERE cu.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create comments on their client projects" ON public.project_comments
    FOR INSERT WITH CHECK (
        project_id IN (
            SELECT p.id 
            FROM public.projects p
            JOIN public.client_users cu ON cu.client_id = p.client_id
            WHERE cu.user_id = auth.uid()
        )
    );

-- Políticas de acesso para project_members
CREATE POLICY "Users can view project members from their clients" ON public.project_members
    FOR SELECT USING (
        project_id IN (
            SELECT p.id 
            FROM public.projects p
            JOIN public.client_users cu ON cu.client_id = p.client_id
            WHERE cu.user_id = auth.uid()
        )
    );

-- Políticas de acesso para project_activities
CREATE POLICY "Users can view activities from their client projects" ON public.project_activities
    FOR SELECT USING (
        project_id IN (
            SELECT p.id 
            FROM public.projects p
            JOIN public.client_users cu ON cu.client_id = p.client_id
            WHERE cu.user_id = auth.uid()
        )
    );

-- Políticas de acesso para tags
CREATE POLICY "Users can view tags from their clients" ON public.tags
    FOR SELECT USING (
        client_id IN (
            SELECT cu.client_id 
            FROM public.client_users cu 
            WHERE cu.user_id = auth.uid()
        )
    );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_user_id ON public.project_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_parent_id ON public.project_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_project_id ON public.project_activities(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_user_id ON public.project_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_client_id ON public.tags(client_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_project_id ON public.project_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_tag_id ON public.project_tags(tag_id); 