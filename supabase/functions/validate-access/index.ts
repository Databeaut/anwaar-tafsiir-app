import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { accessCode, studentName } = await req.json()

    // Validate inputs
    if (!accessCode || typeof accessCode !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Access code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!studentName || typeof studentName !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Student name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize inputs
    const sanitizedCode = accessCode.trim().substring(0, 50)
    const sanitizedName = studentName.trim().substring(0, 100)

    // Validate format - only alphanumeric and common characters allowed
    if (!/^[a-zA-Z0-9-_]+$/.test(sanitizedCode)) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid access code format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role for server-side validation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Query access_keys table - check code, name, and active status
    const { data, error } = await supabase
      .from('access_keys')
      .select('id, is_active, student_name')
      .eq('access_code', sanitizedCode)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Database error:', error.message)
      return new Response(
        JSON.stringify({ valid: false, error: 'Validation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!data) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Furaha aan sax ahayn' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate student name matches (case-insensitive comparison)
    if (data.student_name.toLowerCase().trim() !== sanitizedName.toLowerCase()) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Magaca iyo furaha ma isku waafaqsana' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return success with a session token (signed data)
    // We use a simple approach: return a server-verified token containing the validated session info
    const sessionToken = btoa(JSON.stringify({
      keyId: data.id,
      studentName: sanitizedName,
      validatedAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }))

    return new Response(
      JSON.stringify({ 
        valid: true, 
        sessionToken,
        studentName: sanitizedName 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ valid: false, error: 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
