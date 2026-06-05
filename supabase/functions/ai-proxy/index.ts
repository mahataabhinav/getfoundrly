import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // 2. Parse request payload
    const { provider, endpoint, payload } = await req.json()

    // 3. Handle OpenAI requests
    if (provider === 'openai') {
      const apiKey = Deno.env.get('OPENAI_API_KEY')
      if (!apiKey) throw new Error('OPENAI_API_KEY not configured on server')

      let url = ''
      if (endpoint === 'chat.completions') {
        url = 'https://api.openai.com/v1/chat/completions'
      } else if (endpoint === 'images.generate') {
        url = 'https://api.openai.com/v1/images/generations'
      } else {
        throw new Error('Invalid OpenAI endpoint')
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()
      
      // Pass along error status if applicable
      if (!response.ok) {
        return new Response(JSON.stringify({ error: data }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 4. Handle Gemini requests
    if (provider === 'gemini') {
      const apiKey = Deno.env.get('GEMINI_API_KEY')
      if (!apiKey) throw new Error('GEMINI_API_KEY not configured on server')

      if (endpoint === 'images.generate') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const data = await response.json()

        if (!response.ok) {
          return new Response(JSON.stringify({ error: data }), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } else {
        throw new Error('Invalid Gemini endpoint')
      }
    }

    throw new Error('Invalid provider specified')

  } catch (error: any) {
    console.error('Error in ai-proxy function:', error)
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
