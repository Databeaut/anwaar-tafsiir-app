import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  username: string;
  password: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, password }: RequestBody = await req.json();

    // Validate inputs
    if (!username || !password) {
      console.log('Admin login: Missing credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'Username and password required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedUsername = username.trim().substring(0, 50);
    const sanitizedPassword = password.substring(0, 100);

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Query admin by username only (case-insensitive, password check is separate)
    const { data: admin, error: queryError } = await supabase
      .from('admins')
      .select('id, username, password')
      .ilike('username', sanitizedUsername)
      .maybeSingle();

    if (queryError) {
      console.error('Database query error:', queryError);
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!admin) {
      console.log('Admin login: User not found:', sanitizedUsername);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, compare plaintext passwords (will be upgraded to bcrypt hashing)
    // TODO: Implement bcrypt password hashing in a future migration
    if (admin.password !== sanitizedPassword) {
      console.log('Admin login: Invalid password for:', sanitizedUsername);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a secure admin session token
    const sessionData = {
      adminId: admin.id,
      username: admin.username,
      validatedAt: Date.now(),
      expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
    };

    // For now, use base64 encoding (will be upgraded to HMAC signing with SESSION_SECRET_KEY)
    const sessionToken = btoa(JSON.stringify(sessionData));

    console.log('Admin login successful for:', sanitizedUsername);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionToken,
        username: admin.username
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
