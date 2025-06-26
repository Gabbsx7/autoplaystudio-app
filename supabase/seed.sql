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
