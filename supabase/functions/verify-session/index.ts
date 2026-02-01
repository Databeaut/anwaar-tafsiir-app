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
    const { sessionToken } = await req.json()

    if (!sessionToken || typeof sessionToken !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Session token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Decode and validate the session token
    try {
      const decoded = JSON.parse(atob(sessionToken))
      
      // Check expiration
      if (!decoded.expiresAt || decoded.expiresAt < Date.now()) {
        return new Response(
          JSON.stringify({ valid: false, error: 'Session expired' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify the key still exists and is active
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      const { data, error } = await supabase
        .from('access_keys')
        .select('id, is_active')
        .eq('id', decoded.keyId)
        .eq('is_active', true)
        .maybeSingle()

      if (error || !data) {
        return new Response(
          JSON.stringify({ valid: false, error: 'Access revoked' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ 
          valid: true, 
          studentName: decoded.studentName,
          keyId: decoded.keyId
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid session token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ valid: false, error: 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
