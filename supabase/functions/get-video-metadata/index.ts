const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
// Utility to read a fixed-length string from a DataView
function readString(data, offset, length) {
  let str = "";
  for(let i = 0; i < length; i++){
    str += String.fromCharCode(data.getUint8(offset + i));
  }
  return str;
}
/**
 * Walk through the MP4 boxes to find a tkhd box and extract dimensions.
 * The width and height in tkhd are stored as 16.16 fixed-point numbers.
 */ function findTkhdDimensions(buffer) {
  const data = new DataView(buffer);
  const totalLength = buffer.byteLength;
  let offset = 0;
  while(offset < totalLength){
    // Ensure we have at least 8 bytes available (box size + type)
    if (offset + 8 > totalLength) break;
    const boxSize = data.getUint32(offset);
    const type = readString(data, offset + 4, 4);
    if (type === "tkhd") {
      const version = data.getUint8(offset + 8);
      if (version === 0) {
        // Version 0 tkhd box should be at least 92 bytes long.
        if (offset + 92 > totalLength) break;
        const widthFixed = data.getUint32(offset + 84);
        const heightFixed = data.getUint32(offset + 88);
        const width = widthFixed >>> 16;
        const height = heightFixed >>> 16;
        if (width && height) return {
          width,
          height
        };
      } else if (version === 1) {
        // Version 1 tkhd box typically is 104 bytes or longer.
        if (offset + 104 > totalLength) break;
        const widthFixed = data.getUint32(offset + 96);
        const heightFixed = data.getUint32(offset + 100);
        const width = widthFixed >>> 16;
        const height = heightFixed >>> 16;
        if (width && height) return {
          width,
          height
        };
      }
    }
    if (boxSize <= 0) break;
    offset += boxSize;
  }
  return null;
}
Deno.serve(async (req)=>{
  // Handle pre-flight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  try {
    // Expect a JSON payload with a "fileUrl" key pointing to an MP4 video
    const { fileUrl } = await req.json();
    if (!fileUrl) {
      throw new Error("fileUrl is required");
    }
    // Download the video file as an ArrayBuffer
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch video file");
    }
    const buffer = await response.arrayBuffer();
    // Parse the MP4 file to extract video dimensions from the tkhd box
    const dimensions = findTkhdDimensions(buffer);
    if (!dimensions) {
      throw new Error("Could not extract video dimensions");
    }
    // Compute the aspect ratio percentage (height / width * 100)
    dimensions.aspectRatioPercentage = dimensions.height / dimensions.width * 100;
    return new Response(JSON.stringify(dimensions), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 400
    });
  }
});
