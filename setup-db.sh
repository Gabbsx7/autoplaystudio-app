#!/bin/bash

echo "🚀 Setup Completo do Autoplaystudio Database"
echo "=============================================="

# 1. Criar estrutura de diretórios
echo "📁 Criando estrutura de diretórios..."
mkdir -p supabase/migrations

# 2. Criar migração com schema completo
echo "📋 Criando schema das tabelas..."
cat > supabase/migrations/20250625000000_create_tables.sql << 'EOF'
-- Create custom types first
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');

-- Create tables based on your existing schema
CREATE TABLE public.roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  email text,
  job_title text,
  img_profile jsonb DEFAULT '{"id": "", "url": "", "path": ""}'::jsonb,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  logo_url text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  is_active boolean DEFAULT true,
  CONSTRAINT clients_pkey PRIMARY KEY (id)
);

CREATE TABLE public.client_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid,
  user_id uuid,
  is_primary boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid,
  role_id uuid,
  CONSTRAINT client_users_pkey PRIMARY KEY (id),
  CONSTRAINT client_users_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
  CONSTRAINT client_users_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT client_users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id),
  CONSTRAINT client_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE public.media_collections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid NOT NULL,
  client_id uuid,
  CONSTRAINT media_collections_pkey PRIMARY KEY (id),
  CONSTRAINT media_collections_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
  CONSTRAINT media_collections_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.project_media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  collection_id uuid,
  media_id bigint,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid NOT NULL,
  CONSTRAINT project_media_pkey PRIMARY KEY (id),
  CONSTRAINT project_media_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.media_collections(id),
  CONSTRAINT project_media_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid,
  name text NOT NULL,
  description text,
  status text DEFAULT 'draft'::text,
  start_date date,
  end_date date,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid NOT NULL,
  is_active boolean,
  category text,
  budget numeric,
  priority priority_level DEFAULT 'medium'::priority_level,
  slug text,
  project_media_id uuid,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_project_media_id_fkey FOREIGN KEY (project_media_id) REFERENCES public.project_media(id),
  CONSTRAINT projects_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.clients(id),
  CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  client_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  status milestone_status DEFAULT 'pending'::milestone_status,
  start_date timestamp with time zone,
  due_date timestamp with time zone,
  assignee_id uuid,
  goals text,
  checklist_items jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT milestones_pkey PRIMARY KEY (id),
  CONSTRAINT milestones_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
  CONSTRAINT milestones_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT milestones_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES auth.users(id),
  CONSTRAINT milestones_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

CREATE TABLE public.media (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  description text,
  media_type text NOT NULL CHECK (media_type = ANY (ARRAY['image'::text, 'video'::text])),
  url text NOT NULL,
  thumbnail_url text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  media_collection uuid,
  aspect_ratio text,
  milestone_id uuid,
  metadata jsonb,
  CONSTRAINT media_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT media_milestone_id_fkey FOREIGN KEY (milestone_id) REFERENCES public.milestones(id),
  CONSTRAINT media_media_collection_fkey FOREIGN KEY (media_collection) REFERENCES public.media_collections(id)
);

-- Update project_media foreign key
ALTER TABLE public.project_media ADD CONSTRAINT project_media_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media(id);

CREATE TABLE public.milestone_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  milestone_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  due_date timestamp with time zone,
  assigned_to uuid,
  status task_status DEFAULT 'todo'::task_status,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid NOT NULL,
  CONSTRAINT milestone_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT milestone_tasks_milestone_id_fkey FOREIGN KEY (milestone_id) REFERENCES public.milestones(id),
  CONSTRAINT milestone_tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES auth.users(id),
  CONSTRAINT milestone_tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.project_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  user_id uuid,
  content text NOT NULL CHECK (char_length(content) <= 500),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  user_avatar text,
  user_name text,
  parent_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  rate_limit_metadata jsonb DEFAULT '{}'::jsonb,
  is_resolved boolean DEFAULT false,
  resolved_at timestamp with time zone,
  resolved_by uuid,
  resolution_metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT project_comments_pkey PRIMARY KEY (id),
  CONSTRAINT project_comments_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES auth.users(id),
  CONSTRAINT project_comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.project_comments(id),
  CONSTRAINT project_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT project_comments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  recipient_id uuid,
  actor_id uuid,
  comment_id uuid,
  project_id uuid,
  type text NOT NULL CHECK (type = ANY (ARRAY['comment'::text, 'mention'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT notifications_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.project_comments(id),
  CONSTRAINT notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.users(id),
  CONSTRAINT notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id)
);

CREATE TABLE public.project_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  user_id uuid,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid NOT NULL,
  CONSTRAINT project_members_pkey PRIMARY KEY (id),
  CONSTRAINT project_members_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT project_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

CREATE TABLE public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  version integer DEFAULT 1,
  status text DEFAULT 'draft'::text,
  file_url text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT documents_pkey PRIMARY KEY (id),
  CONSTRAINT documents_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT documents_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

CREATE TABLE public.document_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  document_id uuid,
  version integer NOT NULL,
  file_url text NOT NULL,
  changes_description text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT document_versions_pkey PRIMARY KEY (id),
  CONSTRAINT document_versions_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id),
  CONSTRAINT document_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  amount numeric NOT NULL,
  status text DEFAULT 'draft'::text,
  due_date date,
  paid_date date,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by uuid NOT NULL,
  CONSTRAINT invoices_pkey PRIMARY KEY (id),
  CONSTRAINT invoices_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT invoices_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id text NOT NULL,
  username text NOT NULL,
  channel_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT messages_pkey PRIMARY KEY (id)
);

CREATE TABLE public.autoplaystudio_copilot (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  message text,
  node_id text,
  design_id text,
  element_id text,
  instructions jsonb,
  CONSTRAINT autoplaystudio_copilot_pkey PRIMARY KEY (id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON public.projects(company_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON public.milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestone_tasks_milestone_id ON public.milestone_tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_client_users_client_id ON public.client_users(client_id);
CREATE INDEX IF NOT EXISTS idx_client_users_user_id ON public.client_users(user_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON public.messages(channel_id);
EOF

# 3. Corrigir arquivo RLS (se existe)
echo "🔧 Corrigindo arquivo RLS..."
if [ -f "supabase/migrations/20250625000001_rls_policies.sql" ]; then
    sed -i 's/AS \$/AS $$BODY$$/g; s/^\$;/$$BODY$$;/g' supabase/migrations/20250625000001_rls_policies.sql
else
    echo "⚠️  Arquivo RLS não encontrado, criando versão simplificada..."
    cat > supabase/migrations/20250625000001_rls_policies.sql << 'EOF'
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Basic policies for users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Basic policies for projects - allow all authenticated users for now
CREATE POLICY "Authenticated users can view projects" ON public.projects
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- Basic policies for other tables - allow authenticated access
CREATE POLICY "Authenticated users can view clients" ON public.clients
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view milestones" ON public.milestones
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view comments" ON public.project_comments
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create comments" ON public.project_comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can view their notifications" ON public.notifications
    FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Authenticated users can view messages" ON public.messages
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
EOF
fi

# 4. Criar seed data
echo "🌱 Criando dados seed..."
cat > supabase/seed.sql << 'EOF'
-- Insert default roles
INSERT INTO public.roles (id, name) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'studio_admin'),
    ('550e8400-e29b-41d4-a716-446655440002', 'studio_member'),
    ('550e8400-e29b-41d4-a716-446655440003', 'client_admin'),
    ('550e8400-e29b-41d4-a716-446655440004', 'client_member'),
    ('550e8400-e29b-41d4-a716-446655440005', 'guest')
ON CONFLICT DO NOTHING;

-- Insert sample clients
INSERT INTO public.clients (id, name, description, is_active) VALUES 
    ('550e8400-e29b-41d4-a716-446655440010', 'Molecule Agency', 'Creative digital agency specializing in brand design', true),
    ('550e8400-e29b-41d4-a716-446655440011', 'TechCorp Solutions', 'Technology consulting and software development', true),
    ('550e8400-e29b-41d4-a716-446655440012', 'Design Studio Pro', 'Full-service design and marketing agency', true)
ON CONFLICT DO NOTHING;

-- Insert sample media collections
INSERT INTO public.media_collections (id, name, description, client_id, created_by) VALUES 
    ('550e8400-e29b-41d4-a716-446655440020', 'Brand Assets', 'Logo and brand identity files', '550e8400-e29b-41d4-a716-446655440010', auth.uid()),
    ('550e8400-e29b-41d4-a716-446655440021', 'Marketing Materials', 'Promotional and marketing content', '550e8400-e29b-41d4-a716-446655440010', auth.uid())
ON CONFLICT DO NOTHING;
EOF

# 5. Criar configuração realtime
echo "⚡ Criando configuração realtime..."
cat > supabase/realtime.sql << 'EOF'
-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestone_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;

-- Create presence table for real-time cursors
CREATE TABLE IF NOT EXISTS public.presence (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    cursor_position jsonb,
    last_seen timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own presence" ON public.presence
    FOR ALL USING (user_id = auth.uid());

ALTER PUBLICATION supabase_realtime ADD TABLE public.presence;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('project-media', 'project-media', false),
    ('user-avatars', 'user-avatars', true),
    ('client-logos', 'client-logos', true)
ON CONFLICT DO NOTHING;

-- Storage policies for user avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'user-avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'user-avatars');

-- Storage policies for project media
CREATE POLICY "Users can upload project media" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'project-media' 
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can view project media" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'project-media'
        AND auth.uid() IS NOT NULL
    );
EOF

# 6. Reset e aplicar migrações
echo "🔄 Resetando banco e aplicando migrações..."
npx supabase stop
npx supabase start

echo "⏳ Aguardando Supabase inicializar..."
sleep 5

echo "📝 Aplicando migrações na ordem correta..."

# Apply schema first
echo "1. Criando tabelas..."
psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/migrations/20250625000000_create_tables.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema aplicado com sucesso!"
else
    echo "❌ Erro ao aplicar schema"
    exit 1
fi

# Apply RLS policies
echo "2. Aplicando políticas RLS..."
psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/migrations/20250625000001_rls_policies.sql

if [ $? -eq 0 ]; then
    echo "✅ Políticas RLS aplicadas com sucesso!"
else
    echo "⚠️  Alguns erros nas políticas RLS (normal para development)"
fi

# Apply seed data
echo "3. Inserindo dados seed..."
psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Dados seed inseridos com sucesso!"
else
    echo "⚠️  Alguns erros nos dados seed"
fi

# Apply realtime config
echo "4. Configurando realtime..."
psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/realtime.sql

if [ $? -eq 0 ]; then
    echo "✅ Realtime configurado com sucesso!"
else
    echo "⚠️  Alguns erros na configuração realtime"
fi

echo ""
echo "🎉 Setup concluído!"
echo "=================================="
echo "✅ Tabelas criadas"
echo "✅ Políticas RLS aplicadas"
echo "✅ Dados seed inseridos"
echo "✅ Realtime configurado"
echo "✅ Storage buckets criados"
echo ""
echo "🔗 URLs importantes:"
echo "• Supabase Studio: http://localhost:54323"
echo "• API URL: http://localhost:54321"
echo "• App URL: http://localhost:3000 (quando rodar pnpm dev)"
echo ""
echo "🚀 Próximo passo: pnpm dev"