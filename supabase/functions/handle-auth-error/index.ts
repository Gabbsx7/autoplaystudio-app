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
    const { error, error_description, error_code } = await req.json();
    // Handle different error types
    let redirectUrl = new URL('https://your-app-url.com/auth-error');
    redirectUrl.searchParams.set('error', error);
    redirectUrl.searchParams.set('message', error_description);
    redirectUrl.searchParams.set('code', error_code);
    // Specific handling for OTP expired error
    if (error_code === 'otp_expired') {
      redirectUrl = new URL('https://your-app-url.com/reset-password');
      redirectUrl.searchParams.set('expired', 'true');
    }
    return new Response(JSON.stringify({
      redirect: redirectUrl.toString(),
      error: error_description,
      error_code: error_code
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to process auth error'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
