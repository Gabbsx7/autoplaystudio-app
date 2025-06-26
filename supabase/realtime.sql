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
