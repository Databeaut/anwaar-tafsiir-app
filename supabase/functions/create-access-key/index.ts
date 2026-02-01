import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  studentName: string;
  adminUsername: string;
  adminPassword: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentName, adminUsername, adminPassword }: RequestBody = await req.json();

    // Validate admin credentials server-side
    if (adminUsername !== 'Zaki' || adminPassword !== 'coder2389') {
      console.log('Admin auth failed: Invalid credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'Access Denied' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate student name
    if (!studentName || studentName.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Student name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique access code
    const accessCode = 'ANW-' + Math.floor(1000 + Math.random() * 9000);

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert the new access key
    const { data, error } = await supabase
      .from('access_keys')
      .insert({
        student_name: studentName.trim(),
        access_code: accessCode,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create access key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Access key created successfully:', accessCode);

    return new Response(
      JSON.stringify({ 
        success: true, 
        accessCode,
        studentName: studentName.trim(),
        createdAt: data.created_at
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
