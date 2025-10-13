import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { batchId } = await req.json();

    // Verify batch belongs to user
    const { data: batch, error: batchError } = await supabaseClient
      .from('batches')
      .select('*')
      .eq('id', batchId)
      .eq('user_id', user.id)
      .single();

    if (batchError || !batch) {
      return new Response(
        JSON.stringify({ error: 'Batch not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get all letters in batch
    const { data: letters, error: lettersError } = await supabaseClient
      .from('letters')
      .select('file_url, filename')
      .eq('batch_id', batchId)
      .eq('user_id', user.id);

    if (lettersError || !letters || letters.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files found in batch' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // For now, return signed URLs for each file
    // In production, you'd generate a proper ZIP file
    const signedUrls = await Promise.all(
      letters.map(async (letter) => {
        const { data: signedUrlData } = await supabaseClient.storage
          .from('letters')
          .createSignedUrl(letter.file_url, 3600);
        
        return {
          filename: letter.filename,
          url: signedUrlData?.signedUrl,
        };
      })
    );

    return new Response(
      JSON.stringify({ 
        message: 'Download ready',
        files: signedUrls,
        // For now, return first file URL as zipUrl
        // In production, generate actual ZIP
        zipUrl: signedUrls[0]?.url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating ZIP:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
