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
    const { notification_type, recipients, data } = await req.json();
    // Validate required fields
    if (!notification_type || !recipients || !data) {
      throw new Error('Missing required fields: notification_type, recipients, data');
    }
    // Create notification payload
    const notification = {
      type: notification_type,
      recipients,
      data,
      timestamp: new Date().toISOString()
    };
    // Here you would typically integrate with your notification service
    // For now, we'll just return the notification object
    return new Response(JSON.stringify({
      success: true,
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
