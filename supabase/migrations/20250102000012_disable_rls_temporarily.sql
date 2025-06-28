-- Temporarily disable RLS for development/testing
-- WARNING: This should be removed or modified for production

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions for authenticated users
GRANT ALL ON users TO authenticated;
GRANT ALL ON client_users TO authenticated;
GRANT ALL ON clients TO authenticated;
GRANT ALL ON projects TO authenticated;
GRANT ALL ON roles TO authenticated;
GRANT ALL ON milestones TO authenticated;
GRANT ALL ON media TO authenticated;
GRANT ALL ON milestone_tasks TO authenticated; 