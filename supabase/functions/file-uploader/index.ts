const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const { supabase } = req.locals;
    // Ensure request is multipart/form-data
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      throw new Error('Request must be multipart/form-data');
    }
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || '';
    if (!file) {
      throw new Error('No file provided');
    }
    // Generate unique filename
    const timestamp = new Date().getTime();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const fileName = `${timestamp}-${originalName}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from('uploads').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    if (error) {
      throw error;
    }
    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(filePath);
    return new Response(JSON.stringify({
      success: true,
      filePath,
      publicUrl,
      fileName,
      originalName,
      extension
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
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
