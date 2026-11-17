import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Dynamic, foolproof CORS headers reflecting caller origin and requested headers
function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || req.headers.get('Origin') || '*';
  const requestHeaders =
    req.headers.get('access-control-request-headers') ||
    'authorization, x-client-info, apikey, content-type, Authorization, X-Client-Info, ApiKey, Content-Type, *';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': requestHeaders,
    'Access-Control-Max-Age': '86400',
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // 1. Handle CORS Preflight Request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // 2. Strict HTTP Method Validation (Reject GET, PUT, DELETE with 405)
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed. Please use POST.` }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Allow': 'POST, OPTIONS',
        },
      }
    );
  }

  try {
    // 3. Strict Authentication Header Check
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing Authorization header. Please log in.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Strict Server Configuration Check: Never fall back to anon key for admin lookups
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: 'Server Configuration Error: SUPABASE_URL or SUPABASE_ANON_KEY is missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          error: 'Server Configuration Error: SUPABASE_SERVICE_ROLE_KEY is not configured in Edge Function Secrets',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify calling user's JWT token
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired session token. Please log into the Admin portal.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify Admin Authorization in admin_users table using elevated Service Role client
    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: adminRecord, error: adminError } = await serviceClient
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (adminError) {
      return new Response(
        JSON.stringify({ error: `Database error verifying admin privileges: ${adminError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!adminRecord) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin privileges required. Your account is not listed in admin_users.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Strict Request Body Validation
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, categoryName, keyFeatures } = body || {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Product name is required and must be a non-empty string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Retrieve Gemini API Key from Supabase Edge Function Secrets
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'GEMINI_API_KEY is not configured in Supabase Secrets. Please add it in Project Settings -> Edge Functions -> Secrets.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `
You are a World-Class eCommerce Copywriter and SEO Specialist for "Multi Gadgets", a premium electronics and smart accessories store in Pakistan.
Generate persuasive, high-converting product copy and Google search-optimized metadata for this gadget:

PRODUCT NAME: "${name.trim()}"
CATEGORY: "${(categoryName && typeof categoryName === 'string') ? categoryName.trim() : 'Smart Gadgets'}"
ADDITIONAL HIGHLIGHTS: "${(keyFeatures && typeof keyFeatures === 'string') ? keyFeatures.trim() : 'None provided'}"

Strict Guidelines:
1. "description": 2-3 engaging, well-formatted paragraphs. Emphasize real-world user benefits (build quality, battery, performance, convenience). Include 3-4 bullet points highlighting standout specs.
2. "meta_title": Under 60 characters. Must include product name and brand "Multi Gadgets". Optimized for Google Search CTR.
3. "meta_description": Under 155 characters. Compelling call to action, mentioning features and Cash on Delivery in Pakistan.
4. "features": Array of 4-5 concise technical bullets (e.g., "1.96-inch HD AMOLED Display", "Up to 10-Day Battery Life").
5. "suggested_variants": Comma-separated list of popular realistic gadget colors/options (e.g., "Titanium Black, Space Gray, Alpine Orange").
6. "optimized_title": A polished, clean commercial product title.

You MUST respond strictly with a valid JSON object matching this schema without any markdown formatting or backticks:
{
  "optimized_title": "string",
  "description": "string",
  "meta_title": "string",
  "meta_description": "string",
  "features": ["string", "string", "string", "string"],
  "suggested_variants": "string"
}
`;

    // 6. Secure Server-to-Server request to Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errorMsg = (errData as { error?: { message?: string } })?.error?.message || response.statusText;
      throw new Error(`Gemini API Error: ${errorMsg}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Received empty response from Gemini AI');
    }

    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      throw new Error('Gemini AI returned malformed or unparseable JSON');
    }

    // 7. Defensive Schema Validation & Field Normalization
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Gemini AI returned invalid response format');
    }

    const optimized_title = typeof parsed.optimized_title === 'string' && parsed.optimized_title.trim()
      ? parsed.optimized_title.trim()
      : name.trim();

    const description = typeof parsed.description === 'string' && parsed.description.trim()
      ? parsed.description.trim()
      : '';

    const meta_title = typeof parsed.meta_title === 'string' && parsed.meta_title.trim()
      ? parsed.meta_title.trim()
      : `${name.trim()} | Multi Gadgets`;

    const meta_description = typeof parsed.meta_description === 'string' && parsed.meta_description.trim()
      ? parsed.meta_description.trim()
      : '';

    const rawFeatures = Array.isArray(parsed.features) ? parsed.features : [];
    const features: string[] = rawFeatures
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim());

    const suggested_variants = typeof parsed.suggested_variants === 'string' && parsed.suggested_variants.trim()
      ? parsed.suggested_variants.trim()
      : 'Black, Silver, Space Gray';

    // Verify all essential fields have content before returning
    if (!description || !meta_description || features.length === 0) {
      throw new Error('Gemini AI response was incomplete (missing description, meta_description, or features)');
    }

    const validatedPayload = {
      optimized_title,
      description,
      meta_title: meta_title.slice(0, 60),
      meta_description: meta_description.slice(0, 155),
      features,
      suggested_variants,
      isFallback: false,
      source: 'gemini_1.5_flash',
    };

    return new Response(JSON.stringify(validatedPayload), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
