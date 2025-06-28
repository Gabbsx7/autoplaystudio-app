-- Insert test data for client dashboard

-- Ensure we have a test user (if not exists)
INSERT INTO users (id, name, email, avatar_url)
VALUES 
  ('d36de25e-5b96-4c79-9afb-b3400e5fe9fa', 'Test User', 'test@example.com', 'https://placehold.co/100x100')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url;

-- Insert test client
INSERT INTO clients (id, name, description)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Test Client', 'Test client for development')
ON CONFLICT (id) DO NOTHING;

-- Ensure roles exist
INSERT INTO roles (id, name, description)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', 'client_admin', 'Client Administrator'),
  ('550e8400-e29b-41d4-a716-446655440011', 'client_member', 'Client Member')
ON CONFLICT (name) DO NOTHING;

-- Associate user with client as admin
INSERT INTO client_users (user_id, client_id, role_id, is_primary)
VALUES 
  ('d36de25e-5b96-4c79-9afb-b3400e5fe9fa', 
   '550e8400-e29b-41d4-a716-446655440001',
   (SELECT id FROM roles WHERE name = 'client_admin' LIMIT 1),
   true)
ON CONFLICT DO NOTHING;

-- Insert test projects
INSERT INTO projects (id, name, description, client_id, status)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440002', 'Website Redesign', 'Complete redesign of company website', '550e8400-e29b-41d4-a716-446655440001', 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mobile App Development', 'iOS and Android app development', '550e8400-e29b-41d4-a716-446655440001', 'active'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Marketing Campaign', 'Q1 2024 marketing campaign', '550e8400-e29b-41d4-a716-446655440001', 'completed')
ON CONFLICT (id) DO NOTHING;

-- Insert test milestones
INSERT INTO milestones (id, title, description, project_id, status, due_date)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440005', 'Design Phase', 'Complete all design mockups', '550e8400-e29b-41d4-a716-446655440002', 'completed', NOW() + INTERVAL '7 days'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Development Phase', 'Implement core functionality', '550e8400-e29b-41d4-a716-446655440002', 'pending', NOW() + INTERVAL '30 days'),
  ('550e8400-e29b-41d4-a716-446655440007', 'MVP Release', 'Release first version', '550e8400-e29b-41d4-a716-446655440003', 'pending', NOW() + INTERVAL '60 days')
ON CONFLICT (id) DO NOTHING;

-- Insert test media/assets
INSERT INTO media (id, name, file_path, mime_type, project_id, client_id, uploaded_by)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440008', 'Homepage Mockup', '/assets/homepage-mockup.png', 'image/png', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'd36de25e-5b96-4c79-9afb-b3400e5fe9fa'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Logo Design', '/assets/logo.svg', 'image/svg+xml', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'd36de25e-5b96-4c79-9afb-b3400e5fe9fa'),
  ('550e8400-e29b-41d4-a716-446655440010', 'App Wireframes', '/assets/wireframes.pdf', 'application/pdf', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'd36de25e-5b96-4c79-9afb-b3400e5fe9fa')
ON CONFLICT (id) DO NOTHING;

-- Add more team members
INSERT INTO users (id, name, email, avatar_url)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440020', 'John Designer', 'john@example.com', 'https://placehold.co/100x100'),
  ('550e8400-e29b-41d4-a716-446655440021', 'Sarah Developer', 'sarah@example.com', 'https://placehold.co/100x100')
ON CONFLICT (id) DO NOTHING;

-- Associate team members with client
INSERT INTO client_users (user_id, client_id, role_id, is_primary)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440020', 
   '550e8400-e29b-41d4-a716-446655440001',
   (SELECT id FROM roles WHERE name = 'client_member' LIMIT 1),
   false),
  ('550e8400-e29b-41d4-a716-446655440021', 
   '550e8400-e29b-41d4-a716-446655440001',
   (SELECT id FROM roles WHERE name = 'client_member' LIMIT 1),
   false)
ON CONFLICT DO NOTHING; 