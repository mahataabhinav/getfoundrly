import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { code, redirect_uri } = await req.json();

    if (!code || !redirect_uri) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: code and redirect_uri' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get environment variables
    const LINKEDIN_CLIENT_ID = Deno.env.get('LINKEDIN_CLIENT_ID');
    const LINKEDIN_CLIENT_SECRET = Deno.env.get('LINKEDIN_CLIENT_SECRET');

    if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: 'LinkedIn OAuth credentials not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Normalize redirect URI (remove trailing slashes, ensure consistency)
    const normalizeRedirectUri = (uri: string): string => {
      if (!uri) return uri;
      return uri.trim().replace(/\/$/, '');
    };
    
    const normalizedRedirectUri = normalizeRedirectUri(redirect_uri);
    
    // Mask client ID for logging (first 4 and last 4 characters)
    const maskClientId = (clientId: string): string => {
      if (!clientId || clientId.length < 9) return '***';
      return `${clientId.substring(0, 4)}...${clientId.substring(clientId.length - 4)}`;
    };
    
    // Log redirect URI for debugging with enhanced details
    console.log('[LinkedIn OAuth Edge Function] Token exchange request:', {
      has_code: !!code,
      code_length: code?.length || 0,
      code_preview: code ? `${code.substring(0, 10)}...${code.substring(code.length - 4)}` : 'none',
      redirect_uri_original: redirect_uri,
      redirect_uri_normalized: normalizedRedirectUri,
      redirect_uri_match: redirect_uri === normalizedRedirectUri,
      redirect_uri_length: redirect_uri?.length || 0,
      client_id: LINKEDIN_CLIENT_ID ? maskClientId(LINKEDIN_CLIENT_ID) : 'not_set',
      client_id_length: LINKEDIN_CLIENT_ID?.length || 0,
      client_id_set: !!LINKEDIN_CLIENT_ID,
      client_secret_set: !!LINKEDIN_CLIENT_SECRET,
    });
    
    // Log what will be sent to LinkedIn API
    const tokenExchangeBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: normalizedRedirectUri,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    });
    
    console.log('[LinkedIn OAuth Edge Function] Token exchange body (masked):', {
      grant_type: 'authorization_code',
      code: code ? `${code.substring(0, 10)}...${code.substring(code.length - 4)}` : 'none',
      redirect_uri: normalizedRedirectUri,
      client_id: LINKEDIN_CLIENT_ID ? maskClientId(LINKEDIN_CLIENT_ID) : 'not_set',
      client_secret: LINKEDIN_CLIENT_SECRET ? '***masked***' : 'not_set',
    });

    // Exchange code for token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: normalizedRedirectUri,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      let errorData: any;
      try {
        errorData = await tokenResponse.json();
      } catch {
        errorData = { error: 'Unknown error' };
      }
      
      const errorMessage = errorData.error_description || errorData.error || 'Failed to exchange code for token';
      
      // Log detailed error information
      console.error('[LinkedIn OAuth Edge Function] Token exchange failed:', {
        status: tokenResponse.status,
        status_text: tokenResponse.statusText,
        error: errorMessage,
        error_data: errorData,
        redirect_uri_used: normalizedRedirectUri,
        redirect_uri_original: redirect_uri,
        client_id_used: LINKEDIN_CLIENT_ID ? maskClientId(LINKEDIN_CLIENT_ID) : 'not_set',
        code_length: code?.length || 0,
        code_preview: code ? `${code.substring(0, 10)}...${code.substring(code.length - 4)}` : 'none',
        full_error_response: JSON.stringify(errorData, null, 2),
      });
      
      // Provide more detailed error message
      let detailedError = errorMessage;
      if (errorMessage.includes('redirect') || errorMessage.includes('redirect_uri')) {
        detailedError = `Redirect URI mismatch. The redirect_uri used in token exchange must exactly match the one used in authorization.\n\n` +
                       `Redirect URI used: ${normalizedRedirectUri}\n\n` +
                       `Please ensure:\n` +
                       `1. The redirect_uri in your authorization URL matches this exactly\n` +
                       `2. This redirect_uri is registered in LinkedIn Developer Portal\n` +
                       `3. There are no trailing slashes or encoding differences\n\n` +
                       `Original error: ${errorMessage}`;
      } else if (errorMessage.includes('expired') || errorMessage.includes('authorization code')) {
        detailedError = `Authorization code expired or invalid. Authorization codes expire quickly (usually within minutes).\n\n` +
                       `Please try connecting again. The code may have expired if:\n` +
                       `- You took too long to complete the LinkedIn login\n` +
                       `- You navigated away and came back\n` +
                       `- There was a delay in the OAuth flow\n\n` +
                       `Original error: ${errorMessage}`;
      } else if (errorMessage.includes('appid') || errorMessage.includes('client_id')) {
        detailedError = `Client ID mismatch. The client_id used must match the one registered in LinkedIn Developer Portal.\n\n` +
                       `Please verify:\n` +
                       `1. LINKEDIN_CLIENT_ID in Supabase secrets matches your LinkedIn app\n` +
                       `2. The client_id in the authorization URL matches the one in token exchange\n\n` +
                       `Original error: ${errorMessage}`;
      }
      
      return new Response(
        JSON.stringify({
          error: detailedError,
          original_error: errorMessage,
          redirect_uri_used: normalizedRedirectUri,
        }),
        {
          status: tokenResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const tokenData = await tokenResponse.json();

    // Optionally fetch profile info
    let profile = null;
    try {
      const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (profileResponse.ok) {
        profile = await profileResponse.json();
      }
    } catch (profileError) {
      console.warn('Could not fetch LinkedIn profile:', profileError);
      // Continue without profile - not critical
    }

    return new Response(
      JSON.stringify({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        refresh_token_expires_in: tokenData.refresh_token_expires_in,
        profile,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in LinkedIn OAuth function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

