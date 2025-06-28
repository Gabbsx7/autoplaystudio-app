-- Inserir dados de teste completos para demonstração do sistema

-- 1. Inserir um cliente de teste
INSERT INTO public.clients (id, name, description, is_active) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Molecule Agency', 'Creative digital agency', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Inserir projetos para o cliente
INSERT INTO public.projects (id, name, description, status, client_id) VALUES 
    ('22222222-2222-2222-2222-222222222222', 'Marathon Amsterdam', 'Website redesign for Marathon Amsterdam', 'active', '11111111-1111-1111-1111-111111111111'),
    ('33333333-3333-3333-3333-333333333333', 'Brand Identity Project', 'Complete brand identity overhaul', 'active', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 3. Inserir milestones
INSERT INTO public.milestones (id, title, description, status, project_id) VALUES 
    ('44444444-4444-4444-4444-444444444444', 'First Milestone', 'Initial design concepts', 'in_progress', '22222222-2222-2222-2222-222222222222'),
    ('55555555-5555-5555-5555-555555555555', 'Design Review', 'Client review and feedback', 'pending', '22222222-2222-2222-2222-222222222222'),
    ('66666666-6666-6666-6666-666666666666', 'Brand Guidelines', 'Create comprehensive brand guidelines', 'in_progress', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- 4. Inserir tasks
INSERT INTO public.milestone_tasks (id, name, description, status, milestone_id) VALUES 
    ('77777777-7777-7777-7777-777777777777', 'TAsk', 'Create wireframes for homepage', 'in_progress', '44444444-4444-4444-4444-444444444444'),
    ('88888888-8888-8888-8888-888888888888', 'Logo Design', 'Design multiple logo concepts', 'pending', '44444444-4444-4444-4444-444444444444'),
    ('99999999-9999-9999-9999-999999999999', 'Color Palette', 'Define brand color palette', 'completed', '66666666-6666-6666-6666-666666666666')
ON CONFLICT (id) DO NOTHING;

-- 5. Função para criar usuário automaticamente na autenticação
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email)
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    email = NEW.email,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Inserir usuários de teste no auth.users primeiro
-- Isso simula o que aconteceria quando usuários se registram
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at, created_at, updated_at,
    raw_user_meta_data
) VALUES 
    ('00000000-0000-0000-0000-000000000000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'authenticated', 'authenticated', 'robert@molecule.com', '$2a$10$zqq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq', now(), now(), now(), now(), '{"name": "Robert Tammens"}'),
    ('00000000-0000-0000-0000-000000000000', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'authenticated', 'authenticated', 'john@molecule.com', '$2a$10$zqq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq', now(), now(), now(), now(), '{"name": "John Doe"}'),
    ('00000000-0000-0000-0000-000000000000', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'authenticated', 'authenticated', 'jane@molecule.com', '$2a$10$zqq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq3qvq', now(), now(), now(), now(), '{"name": "Jane Smith"}')
ON CONFLICT (id) DO NOTHING;

-- Agora inserir na tabela public.users (isso será automatico via trigger normalmente)
INSERT INTO public.users (id, name, email) VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Robert Tammens', 'robert@molecule.com'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'John Doe', 'john@molecule.com'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Jane Smith', 'jane@molecule.com')
ON CONFLICT (id) DO NOTHING;

-- 6. Associar usuários ao cliente com roles
INSERT INTO public.client_users (user_id, client_id, role_id) 
SELECT 
    u.id,
    '11111111-1111-1111-1111-111111111111',
    r.id
FROM public.users u
CROSS JOIN public.roles r
WHERE u.email IN ('robert@molecule.com', 'john@molecule.com', 'jane@molecule.com')
AND r.name = 'client_admin'
ON CONFLICT (user_id, client_id) DO NOTHING;

-- 7. Adicionar membros aos projetos
INSERT INTO public.project_members (project_id, user_id, role, created_by) 
SELECT 
    p.id,
    u.id,
    'member',
    u.id
FROM public.projects p
CROSS JOIN public.users u
WHERE p.name IN ('Marathon Amsterdam', 'Brand Identity Project')
AND u.email IN ('robert@molecule.com', 'john@molecule.com', 'jane@molecule.com')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- 8. Adicionar algumas tags de exemplo
INSERT INTO public.tags (id, name, color, client_id) VALUES 
    ('tag11111-1111-1111-1111-111111111111', 'Website', '#3B82F6', '11111111-1111-1111-1111-111111111111'),
    ('tag22222-2222-2222-2222-222222222222', 'Branding', '#10B981', '11111111-1111-1111-1111-111111111111'),
    ('tag33333-3333-3333-3333-333333333333', 'High Priority', '#EF4444', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 9. Associar tags aos projetos
INSERT INTO public.project_tags (project_id, tag_id) VALUES 
    ('22222222-2222-2222-2222-222222222222', 'tag11111-1111-1111-1111-111111111111'), -- Marathon Amsterdam + Website
    ('22222222-2222-2222-2222-222222222222', 'tag33333-3333-3333-3333-333333333333'), -- Marathon Amsterdam + High Priority
    ('33333333-3333-3333-3333-333333333333', 'tag22222-2222-2222-2222-222222222222')  -- Brand Identity + Branding
ON CONFLICT (project_id, tag_id) DO NOTHING;

-- 10. Adicionar alguns comentários de exemplo
INSERT INTO public.project_comments (id, project_id, user_id, content) VALUES 
    ('com11111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Great progress on the homepage design!'),
    ('com22222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Should we consider a different color scheme?'),
    ('com33333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'The brand guidelines are looking fantastic!')
ON CONFLICT (id) DO NOTHING;

-- 11. Adicionar algumas atividades de exemplo
INSERT INTO public.project_activities (project_id, user_id, activity_type, description, entity_type, entity_id) VALUES 
    ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'milestone_created', 'Created milestone "First Milestone"', 'milestone', '44444444-4444-4444-4444-444444444444'),
    ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'task_created', 'Created task "Logo Design"', 'task', '88888888-8888-8888-8888-888888888888'),
    ('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'task_completed', 'Completed task "Color Palette"', 'task', '99999999-9999-9999-9999-999999999999');

-- Mensagem de debug
DO $$
BEGIN
    RAISE NOTICE 'Dados de teste completos inseridos com sucesso!';
    RAISE NOTICE 'Cliente: Molecule Agency';
    RAISE NOTICE 'Projetos: Marathon Amsterdam, Brand Identity Project';
    RAISE NOTICE 'Usuários: Robert Tammens, John Doe, Jane Smith';
    RAISE NOTICE 'Tags: Website, Branding, High Priority';
    RAISE NOTICE 'Para testar o autocomplete, use: @Robert @John @Jane &Marathon &Brand #First #Design $TAsk $Logo $Color';
END $$; 