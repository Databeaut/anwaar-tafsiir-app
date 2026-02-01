import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SurahDetails {
  nameMeaning: string;
  revelationType: string;
  revelationContext: string;
  mainTheme: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { surahName } = await req.json();

    if (!surahName) {
      return new Response(
        JSON.stringify({ error: 'Surah name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert Quranic scholar fluent in Somali. 

Task: I will give you a Surah Name. Provide detailed information about this Surah.

Output: Return a JSON object with specific details IN SOMALI LANGUAGE ONLY.

JSON Structure:
{
  "nameMeaning": "Explain the name's meaning in Somali. For example, for Al-Fatiha: 'Al-Faatixa waxay ka timid erayga Carabiga ah 'Fataxa' oo macnaheedu yahay furitaan. Waxaa loo yaqaan Furitaanka Kitaabka sababtoo ah waa Suuradda ugu horeysa ee Quraanka.'",
  "revelationType": "Makki ama Madani (with a brief 1-sentence explanation why in Somali)",
  "revelationContext": "Explain the Asbāb al-Nuzūl in Somali (Why/When it was revealed). If no specific context exists, explain the general historical period.",
  "mainTheme": "The core theological or social theme of the Surah in Somali."
}

CRITICAL RULES:
1. ALL text MUST be in Somali language
2. Be academic, respectful, and informative
3. Keep each field concise but meaningful (2-4 sentences max)
4. Return ONLY valid JSON, no markdown formatting`;

    const userPrompt = `Provide detailed information about Surah: ${surahName}`;

    console.log('Fetching Surah details for:', surahName);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response');
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response (remove any markdown if present)
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let details: SurahDetails;
    try {
      details = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', cleanedContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!details.nameMeaning || !details.revelationType || !details.revelationContext || !details.mainTheme) {
      console.error('Incomplete response from AI:', details);
      return new Response(
        JSON.stringify({ error: 'Incomplete response from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully fetched Surah details for:', surahName);

    return new Response(
      JSON.stringify(details),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
