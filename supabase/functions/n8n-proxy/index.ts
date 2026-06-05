import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Authenticate user
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const authHeader = req.headers.get('Authorization')
    
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // 2. Parse payload
    const { action, payload } = await req.json()

    // 3. Map action to secure webhook URL
    let webhookUrl = ''
    if (action === 'linkedin-post') {
      webhookUrl = Deno.env.get('N8N_LINKEDIN_WEBHOOK_URL') || 'https://foundrly.app.n8n.cloud/webhook-test/linkedin-post'
    } else if (action === 'linkedin-analytics') {
      webhookUrl = Deno.env.get('N8N_LINKEDIN_ANALYTICS_WEBHOOK_URL') || 'https://amahata96.app.n8n.cloud/webhook/linkedin-analytics'
    } else if (action === 'instagram-post') {
      webhookUrl = Deno.env.get('N8N_INSTAGRAM_WEBHOOK_URL') || 'https://foundrly.app.n8n.cloud/webhook-test/instagram-post'
    } else if (action === 'http-test') {
      webhookUrl = Deno.env.get('N8N_HTTP_WEBHOOK_URL') || 'https://amahata.app.n8n.cloud/webhook-test/http'
    } else {
      throw new Error('Invalid webhook action')
    }

    // 4. Forward the request to n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { text: await response.text() };
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('Error in n8n-proxy function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal Server Error', 
        success: false 
      }),
      { 
        status: error.message?.includes('Unauthorized') ? 401 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
