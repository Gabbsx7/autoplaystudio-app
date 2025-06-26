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

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Clients policies  
CREATE POLICY "Studio admin can view all clients" ON public.clients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.client_users cu
            JOIN public.roles r ON cu.role_id = r.id
            WHERE cu.user_id = auth.uid() 
            AND r.name IN ('studio_admin', 'studio_member')
        )
    );

CREATE POLICY "Client users can view their client" ON public.clients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.client_users cu
            WHERE cu.client_id = id AND cu.user_id = auth.uid()
        )
    );

-- Projects policies
CREATE POLICY "Users can view projects they're members of" ON public.projects
    FOR SELECT USING (
        -- Studio admin/member can see all projects
        EXISTS (
            SELECT 1 FROM public.client_users cu
            JOIN public.roles r ON cu.role_id = r.id
            WHERE cu.user_id = auth.uid() 
            AND r.name IN ('studio_admin', 'studio_member')
        )
        OR
        -- Client users can see their client's projects
        EXISTS (
            SELECT 1 FROM public.client_users cu
            WHERE cu.client_id = company_id AND cu.user_id = auth.uid()
        )
        OR
        -- Project members can see their projects
        EXISTS (
            SELECT 1 FROM public.project_members pm
            WHERE pm.project_id = id AND pm.user_id = auth.uid()
        )
    );

CREATE POLICY "Studio admin can create projects" ON public.projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.client_users cu
            JOIN public.roles r ON cu.role_id = r.id
            WHERE cu.user_id = auth.uid() 
            AND r.name IN ('studio_admin', 'studio_member')
        )
    );

CREATE POLICY "Studio admin can update projects" ON public.projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.client_users cu
            JOIN public.roles r ON cu.role_id = r.id
            WHERE cu.user_id = auth.uid() 
            AND r.name IN ('studio_admin', 'studio_member')
        )
    );

-- Milestones policies
CREATE POLICY "Users can view milestones of accessible projects" ON public.milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_id
            AND (
                -- Studio admin/member can see all
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    JOIN public.roles r ON cu.role_id = r.id
                    WHERE cu.user_id = auth.uid() 
                    AND r.name IN ('studio_admin', 'studio_member')
                )
                OR
                -- Client users can see their client's milestones
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    WHERE cu.client_id = p.company_id AND cu.user_id = auth.uid()
                )
                OR
                -- Project members can see milestones
                EXISTS (
                    SELECT 1 FROM public.project_members pm
                    WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
                )
            )
        )
    );

-- Tasks policies
CREATE POLICY "Users can view tasks they're assigned to or have access via project" ON public.milestone_tasks
    FOR SELECT USING (
        assigned_to = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.milestones m
            JOIN public.projects p ON m.project_id = p.id
            WHERE m.id = milestone_id
            AND (
                -- Studio admin/member can see all
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    JOIN public.roles r ON cu.role_id = r.id
                    WHERE cu.user_id = auth.uid() 
                    AND r.name IN ('studio_admin', 'studio_member')
                )
                OR
                -- Client users can see their client's tasks
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    WHERE cu.client_id = p.company_id AND cu.user_id = auth.uid()
                )
                OR
                -- Project members can see tasks
                EXISTS (
                    SELECT 1 FROM public.project_members pm
                    WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
                )
            )
        )
    );

-- Comments policies
CREATE POLICY "Users can view comments on accessible projects" ON public.project_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_id
            AND (
                -- Studio admin/member can see all
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    JOIN public.roles r ON cu.role_id = r.id
                    WHERE cu.user_id = auth.uid() 
                    AND r.name IN ('studio_admin', 'studio_member')
                )
                OR
                -- Client users can see their client's comments
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    WHERE cu.client_id = p.company_id AND cu.user_id = auth.uid()
                )
                OR
                -- Project members can see comments
                EXISTS (
                    SELECT 1 FROM public.project_members pm
                    WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can create comments on accessible projects" ON public.project_comments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_id
            AND (
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    JOIN public.roles r ON cu.role_id = r.id
                    WHERE cu.user_id = auth.uid() 
                    AND r.name IN ('studio_admin', 'studio_member')
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    WHERE cu.client_id = p.company_id AND cu.user_id = auth.uid()
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.project_members pm
                    WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
                )
            )
        )
        AND user_id = auth.uid()
    );

-- Messages policies (for chat)
CREATE POLICY "Users can view messages in channels they have access to" ON public.messages
    FOR SELECT USING (
        -- For now, allow viewing if user is authenticated
        -- TODO: Implement proper channel-based access control
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        user_id = auth.uid()::text
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (recipient_id = auth.uid());

-- Media policies
CREATE POLICY "Users can view media they have project access to" ON public.media
    FOR SELECT USING (
        user_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.milestones m
            JOIN public.projects p ON m.project_id = p.id
            WHERE m.id = milestone_id
            AND (
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    JOIN public.roles r ON cu.role_id = r.id
                    WHERE cu.user_id = auth.uid() 
                    AND r.name IN ('studio_admin', 'studio_member')
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    WHERE cu.client_id = p.company_id AND cu.user_id = auth.uid()
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.project_members pm
                    WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can upload media" ON public.media
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Documents policies
CREATE POLICY "Users can view documents of accessible projects" ON public.documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_id
            AND (
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    JOIN public.roles r ON cu.role_id = r.id
                    WHERE cu.user_id = auth.uid() 
                    AND r.name IN ('studio_admin', 'studio_member')
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    WHERE cu.client_id = p.company_id AND cu.user_id = auth.uid()
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.project_members pm
                    WHERE pm.project_id = p.id AND pm.user_id = auth.uid()
                )
            )
        )
    );

-- Project members policies
CREATE POLICY "Users can view project members of accessible projects" ON public.project_members
    FOR SELECT USING (
        user_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_id
            AND (
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    JOIN public.roles r ON cu.role_id = r.id
                    WHERE cu.user_id = auth.uid() 
                    AND r.name IN ('studio_admin', 'studio_member')
                )
                OR
                EXISTS (
                    SELECT 1 FROM public.client_users cu
                    WHERE cu.client_id = p.company_id AND cu.user_id = auth.uid()
                )
            )
        )
    );

-- Client users policies
CREATE POLICY "Users can view client users of their clients" ON public.client_users
    FOR SELECT USING (
        user_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.client_users cu
            WHERE cu.client_id = client_id 
            AND cu.user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.roles r 
                WHERE r.id = cu.role_id 
                AND r.name IN ('studio_admin', 'studio_member', 'client_admin')
            )
        )
    );

-- Functions for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid, client_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$BODY$$
DECLARE
    user_role text;
BEGIN
    SELECT r.name INTO user_role
    FROM public.client_users cu
    JOIN public.roles r ON cu.role_id = r.id
    WHERE cu.user_id = get_user_role.user_id
    AND (get_user_role.client_id IS NULL OR cu.client_id = get_user_role.client_id)
    LIMIT 1;
    
    RETURN COALESCE(user_role, 'guest');
END;
$$BODY$$;

-- Function to check if user has access to project
CREATE OR REPLACE FUNCTION public.user_has_project_access(user_id uuid, project_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$BODY$$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.projects p
        WHERE p.id = user_has_project_access.project_id
        AND (
            -- Studio admin/member can access all
            EXISTS (
                SELECT 1 FROM public.client_users cu
                JOIN public.roles r ON cu.role_id = r.id
                WHERE cu.user_id = user_has_project_access.user_id 
                AND r.name IN ('studio_admin', 'studio_member')
            )
            OR
            -- Client users can access their client's projects
            EXISTS (
                SELECT 1 FROM public.client_users cu
                WHERE cu.client_id = p.company_id 
                AND cu.user_id = user_has_project_access.user_id
            )
            OR
            -- Project members can access their projects
            EXISTS (
                SELECT 1 FROM public.project_members pm
                WHERE pm.project_id = p.id 
                AND pm.user_id = user_has_project_access.user_id
            )
        )
    );
END;
$$BODY$$;

-- Triggers for notifications
CREATE OR REPLACE FUNCTION public.handle_new_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$BODY$$
BEGIN
    -- Create notification for project members (except comment author)
    INSERT INTO public.notifications (recipient_id, actor_id, comment_id, project_id, type)
    SELECT DISTINCT pm.user_id, NEW.user_id, NEW.id, NEW.project_id, 'comment'
    FROM public.project_members pm
    WHERE pm.project_id = NEW.project_id 
    AND pm.user_id != NEW.user_id;
    
    RETURN NEW;
END;
$$BODY$$;

CREATE TRIGGER on_comment_created
    AFTER INSERT ON public.project_comments
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_comment();

-- Handle mentions in comments
CREATE OR REPLACE FUNCTION public.handle_comment_mentions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$BODY$$
DECLARE
    mentioned_user_id uuid;
    mention_pattern text;
BEGIN
    -- Extract @mentions from comment content
    -- This is a simplified version - you might want to use a more sophisticated approach
    mention_pattern := '@[a-zA-Z0-9._-]+';
    
    -- For now, we'll handle this in the application layer
    -- TODO: Implement proper mention extraction and notification creation
    
    RETURN NEW;
END;
$$BODY$$;

-- Database functions for API
CREATE OR REPLACE FUNCTION public.get_user_projects(user_id uuid)
RETURNS TABLE (
    id uuid,
    name text,
    description text,
    status text,
    created_at timestamptz,
    client_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$BODY$$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        p.created_at,
        c.name as client_name
    FROM public.projects p
    LEFT JOIN public.clients c ON p.company_id = c.id
    WHERE public.user_has_project_access(get_user_projects.user_id, p.id)
    ORDER BY p.created_at DESC;
END;
$$BODY$$;

-- Storage policies
INSERT INTO storage.buckets (id, name, public) VALUES ('project-media', 'project-media', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('client-logos', 'client-logos', true);

-- Storage policies for project media
CREATE POLICY "Users can upload project media" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'project-media' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view project media they have access to" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'project-media'
        AND (
            auth.uid()::text = (storage.foldername(name))[1]
            OR
            -- Add project-based access control here
            EXISTS (
                SELECT 1 FROM public.media m
                WHERE m.url LIKE '%' || name || '%'
                AND m.user_id = auth.uid()
            )
        )
    );

-- Storage policies for user avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'user-avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'user-avatars');

-- Storage policies for client logos
CREATE POLICY "Studio admin can upload client logos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'client-logos'
        AND EXISTS (
            SELECT 1 FROM public.client_users cu
            JOIN public.roles r ON cu.role_id = r.id
            WHERE cu.user_id = auth.uid() 
            AND r.name IN ('studio_admin', 'studio_member')
        )
    );

CREATE POLICY "Anyone can view client logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'client-logos');
