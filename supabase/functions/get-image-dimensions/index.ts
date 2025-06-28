import imageSize from 'npm:image-size@1.1.1';
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
    const { fileUrl } = await req.json();
    if (!fileUrl) {
      throw new Error('fileUrl is required');
    }
    // Download the file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }
    const buffer = await response.arrayBuffer();
    try {
      const dimensions = imageSize(new Uint8Array(buffer));
      return new Response(JSON.stringify({
        width: dimensions.width,
        height: dimensions.height,
        type: dimensions.type
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      });
    } catch (error) {
      throw new Error('Could not get image dimensions: ' + error.message);
    }
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
