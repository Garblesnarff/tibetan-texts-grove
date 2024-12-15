import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const formData = await req.formData()
    
    // Log received data for debugging
    console.log('Received form data:', {
      file: formData.get('file')?.name,
      fileType: formData.get('fileType'),
      title: formData.get('title'),
      tibetanTitle: formData.get('tibetanTitle')
    })

    // Validate required fields
    const file = formData.get('file') as File
    const fileType = formData.get('fileType') as string
    const title = formData.get('title') as string
    const tibetanTitle = formData.get('tibetanTitle') as string

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Missing file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!fileType || !['source', 'translation'].includes(fileType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!title || !tibetanTitle) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: {
            title: !title ? 'Missing title' : undefined,
            tibetanTitle: !tibetanTitle ? 'Missing tibetan title' : undefined
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create or update translation record
    const { data: translation, error: dbError } = await supabase
      .from('translations')
      .upsert({
        title: title.trim(),
        tibetan_title: tibetanTitle.trim(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to create translation record', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop()
    const filePath = `${fileType}/${translation.id}-${fileType}.${fileExt}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('admin_translations')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Update translation record with file path
    const updateData = fileType === 'source' 
      ? { source_file_path: filePath }
      : { translation_file_path: filePath }

    const { error: updateError } = await supabase
      .from('translations')
      .update(updateData)
      .eq('id', translation.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update translation record', details: updateError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Upload successful',
        translation: translation
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})