import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function sanitizeFileName(fileName: string): string {
  // Keep alphanumeric characters, dots, and underscores
  // Replace spaces with underscores
  // Remove other special characters
  return fileName
    .replace(/[^a-zA-Z0-9._]/g, '_')
    .replace(/_{2,}/g, '_') // Replace multiple consecutive underscores with a single one
    .toLowerCase();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('fileType') as string
    const title = formData.get('title') as string
    const tibetanTitle = formData.get('tibetanTitle') as string

    if (!file) {
      throw new Error('No file uploaded')
    }

    console.log('Received file upload request:', {
      originalFileName: file.name,
      fileType,
      title,
      tibetanTitle
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sanitize the filename while preserving the extension
    const fileExt = file.name.split('.').pop()
    const baseFileName = file.name.slice(0, -(fileExt?.length ?? 0) - 1)
    const sanitizedFileName = `${sanitizeFileName(baseFileName)}.${fileExt}`
    const filePath = `${fileType}/${sanitizedFileName}`

    console.log('Uploading file to path:', filePath)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('admin_translations')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw new Error(`Failed to upload file: ${uploadError.message}`)
    }

    console.log('File uploaded successfully:', uploadData)

    // Update or create translation record
    const { data: translation, error: dbError } = await supabase
      .from('translations')
      .upsert({
        title: title.trim(),
        tibetan_title: tibetanTitle.trim(),
        [fileType === 'source' ? 'source_file_path' : 'translation_file_path']: filePath,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'title'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error(`Failed to update translation record: ${dbError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'File uploaded successfully',
        translation,
        filePath
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    )

  } catch (error) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred during upload'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    )
  }
})
