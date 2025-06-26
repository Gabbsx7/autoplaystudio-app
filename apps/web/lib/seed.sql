-- Seed data for development
-- Insert default roles
INSERT INTO public.roles (id, name) VALUES 
    (gen_random_uuid(), 'studio_admin'),
    (gen_random_uuid(), 'studio_member'),
    (gen_random_uuid(), 'client_admin'),
    (gen_random_uuid(), 'client_member'),
    (gen_random_uuid(), 'guest')
ON CONFLICT DO NOTHING;

-- Insert sample client
INSERT INTO public.clients (id, name, description, is_active) VALUES 
    (gen_random_uuid(), 'Molecule Agency', 'Creative digital agency', true),
    (gen_random_uuid(), 'TechCorp', 'Technology consulting firm', true)
ON CONFLICT DO NOTHING;
