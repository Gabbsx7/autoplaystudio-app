import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { comment_id, project_id, resolved, resolved_by, resolved_by_role, content, user_name } = await req.json();
    // Here you would typically:
    // 1. Format the notification message
    const message = resolved ? `Comment by ${user_name} was marked as resolved by ${resolved_by} (${resolved_by_role})` : `Comment by ${user_name} was unmarked as resolved by ${resolved_by} (${resolved_by_role})`;
    // 2. Get project members to notify
    const { data: projectMembers, error: membersError } = await supabase.from('project_members').select('user_id').eq('project_id', project_id);
    if (membersError) {
      throw new Error(`Error fetching project members: ${membersError.message}`);
    }
    // 3. Send notifications (implement your preferred notification method)
    const notification = {
      type: 'comment_resolution',
      message,
      comment_id,
      project_id,
      resolved,
      resolved_by,
      timestamp: new Date().toISOString()
    };
    return new Response(JSON.stringify({
      success: true,
      message: 'Notification sent',
      notification
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
