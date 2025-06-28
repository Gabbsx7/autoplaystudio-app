import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { projectId, message, type, recipients } = await req.json();
    // Validate input
    if (!projectId || !message || !type) {
      throw new Error('Missing required fields');
    }
    // Get project details
    const { data: project, error: projectError } = await supabase.from('projects').select('name, client_id').eq('id', projectId).single();
    if (projectError) throw projectError;
    // Create notification
    const { error: notificationError } = await supabase.from('notifications').insert(recipients.map((userId)=>({
        user_id: userId,
        project_id: projectId,
        title: `${type}: ${project.name}`,
        content: message,
        type: type
      })));
    if (notificationError) throw notificationError;
    return new Response(JSON.stringify({
      success: true,
      message: 'Notification sent successfully'
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
