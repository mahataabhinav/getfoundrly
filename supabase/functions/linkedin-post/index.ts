import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
    console.log('[LinkedIn Post Edge Function] Function called');
    const requestBody = await req.json();
    console.log('[LinkedIn Post Edge Function] Request body received:', { 
      has_access_token: !!requestBody.access_token,
      access_token_length: requestBody.access_token?.length || 0,
      has_content: !!requestBody.content,
      content_length: requestBody.content?.length || 0,
      has_options: !!requestBody.options,
      has_person_urn: !!requestBody.options?.person_urn,
      person_urn: requestBody.options?.person_urn
    });
    
    const { access_token, content, options } = requestBody;

    if (!access_token || !content) {
      console.error('[LinkedIn Post Edge Function] Missing required parameters');
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: access_token and content' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate access token format (should start with a string)
    if (typeof access_token !== 'string' || access_token.length < 10) {
      console.error('[LinkedIn Post Edge Function] Invalid access token format');
      return new Response(
        JSON.stringify({ error: 'Invalid access token format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Helper function to convert LinkedIn URN to the format required by UGC Posts API
    // LinkedIn UGC Posts API requires: urn:li:member:{numeric_id} (numeric ID, not user_xxxxx)
    function convertToMemberUrn(urn: string): string {
      // If already in correct format (urn:li:member:{numeric}), return as is
      if (urn.match(/^urn:li:member:\d+$/)) {
        return urn;
      }
      
      // If it's urn:li:person:{numeric}, convert to urn:li:member:{numeric}
      const personNumericMatch = urn.match(/^urn:li:person:(\d+)$/);
      if (personNumericMatch) {
        return `urn:li:member:${personNumericMatch[1]}`;
      }
      
      // If it contains "user_" prefix (urn:li:person:user_xxxxx), we can't extract numeric ID from it
      // This format doesn't contain the numeric ID we need
      if (urn.includes('user_')) {
        console.warn('URN contains user_ prefix, cannot extract numeric ID:', urn);
        return urn; // Will fail at API level, but at least we tried
      }
      
      // Try to extract any numeric ID from the end
      const numericMatch = urn.match(/(\d+)$/);
      if (numericMatch) {
        return `urn:li:member:${numericMatch[1]}`;
      }
      
      console.warn('Could not convert URN to member format:', urn);
      return urn;
    }

    // Get person URN - use provided one or try to fetch from LinkedIn API
    let personUrn: string | undefined;
    
    // If person_urn is provided in options, use it (avoids API call)
    // BUT: If it's in user_xxxxx format, we can't use it and need to fetch from API
    if (options?.person_urn && !options.person_urn.includes('user_')) {
      console.log('[LinkedIn Post Edge Function] Using provided person URN:', options.person_urn);
      personUrn = convertToMemberUrn(options.person_urn);
      console.log('[LinkedIn Post Edge Function] Converted person URN:', personUrn);
      
      // Validate the converted URN format
      if (!personUrn.match(/^urn:li:member:\d+$/)) {
        console.warn('[LinkedIn Post Edge Function] Invalid person URN format after conversion, will fetch from API:', personUrn);
        // Don't return error, fall through to fetch from API
        personUrn = undefined;
      }
    }
    
    // If we don't have a valid person URN yet (either not provided, or in user_xxxxx format, or invalid), fetch from API
    if (!personUrn || personUrn.includes('user_') || !personUrn.match(/^urn:li:member:\d+$/)) {
      // Try to get numeric person ID from /v2/me endpoint (requires r_liteprofile scope, may fail)
      // If that fails, try OpenID Connect /v2/userinfo endpoint
      // If that also fails, try to extract from UGC Posts API by making a test call
      try {
        console.log('[LinkedIn Post Edge Function] No person URN provided, fetching from LinkedIn API...');
        
        // First, try /v2/me endpoint (best option - returns numeric ID)
        console.log('[LinkedIn Post Edge Function] Trying /v2/me endpoint...');
        const meResponse = await fetch('https://api.linkedin.com/v2/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        
        console.log('[LinkedIn Post Edge Function] /v2/me response status:', meResponse.status);
        
        // Log response details for debugging if it failed
        if (!meResponse.ok) {
          try {
            const errorData = await meResponse.clone().json().catch(() => null);
            if (errorData) {
              console.error('[LinkedIn Post Edge Function] /v2/me error response:', JSON.stringify(errorData, null, 2));
            } else {
              const errorText = await meResponse.clone().text().catch(() => 'No error details');
              console.error('[LinkedIn Post Edge Function] /v2/me error (text):', errorText);
            }
          } catch (e) {
            console.error('[LinkedIn Post Edge Function] /v2/me error - could not parse response');
          }
        }

        if (meResponse.ok) {
          const meData = await meResponse.json();
          console.log('[LinkedIn Post Edge Function] /v2/me full response:', JSON.stringify(meData, null, 2));
          
          // /v2/me returns 'id' as the numeric person ID (e.g., "12345")
          const numericId = meData.id;
          console.log('[LinkedIn Post Edge Function] Got numeric ID from /v2/me:', numericId);
          
          if (numericId && /^\d+$/.test(String(numericId))) {
            personUrn = `urn:li:member:${numericId}`;
            console.log('[LinkedIn Post Edge Function] Created member URN:', personUrn);
          } else {
            console.warn('[LinkedIn Post Edge Function] Invalid numeric ID from /v2/me:', numericId);
            // Don't throw, fall through to try /v2/userinfo
            console.log('[LinkedIn Post Edge Function] Will try /v2/userinfo endpoint instead');
          }
        }
        
        // If /v2/me didn't work or didn't return valid ID, try OpenID Connect endpoint
        if (!personUrn || !personUrn.match(/^urn:li:member:\d+$/)) {
          // /v2/me failed or didn't return valid ID, try OpenID Connect endpoint
          console.log('[LinkedIn Post Edge Function] /v2/me did not provide valid ID, trying OpenID Connect /v2/userinfo endpoint...');
          const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          
          console.log('[LinkedIn Post Edge Function] UserInfo response status:', userInfoResponse.status);

          if (userInfoResponse.ok) {
            const userInfo = await userInfoResponse.json();
            console.log('[LinkedIn Post Edge Function] Full userinfo response:', JSON.stringify(userInfo, null, 2));
            
            // OpenID Connect returns 'sub' field - could be in various formats
            const subUrn = userInfo.sub || userInfo.id;
            console.log('[LinkedIn Post Edge Function] Got sub from userinfo:', subUrn);
            
            // Check if userInfo has a numeric ID field (some OpenID Connect implementations provide this)
            if (userInfo.id && /^\d+$/.test(String(userInfo.id))) {
              const numericId = userInfo.id;
              console.log('[LinkedIn Post Edge Function] Found numeric ID in userinfo.id:', numericId);
              personUrn = `urn:li:member:${numericId}`;
              console.log('[LinkedIn Post Edge Function] Created member URN from userinfo.id:', personUrn);
            } else if (subUrn) {
              // Try to extract numeric ID from sub URN
              // OpenID Connect 'sub' can be in format: urn:li:person:{numeric_id} or urn:li:person:user_xxxxx
              
              // If sub is in user_xxxxx format, we cannot extract numeric ID
              if (subUrn.includes('user_') || subUrn.match(/urn:li:person:user_/)) {
                console.warn('[LinkedIn Post Edge Function] OpenID Connect returned user_ format, cannot extract numeric ID directly');
                
                return new Response(
                  JSON.stringify({
                    error: `Cannot extract numeric LinkedIn user ID. The LinkedIn API returned a user ID in 'user_xxxxx' format which cannot be used for posting.\n\n` +
                           `This usually happens when your LinkedIn app doesn't have the required OpenID Connect scopes.\n\n` +
                           `To fix this:\n` +
                           `1. Go to LinkedIn Developer Portal (https://www.linkedin.com/developers/apps)\n` +
                           `2. Select your app → "Auth" tab\n` +
                           `3. Ensure these scopes are enabled: "openid", "profile", "w_member_social"\n` +
                           `4. Save changes\n` +
                           `5. Disconnect and reconnect your LinkedIn account in the app\n` +
                           `6. When reconnecting, make sure to grant ALL requested permissions`,
                  }),
                  {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                  }
                );
              }
              
              // Try to extract numeric ID from sub
              personUrn = convertToMemberUrn(subUrn);
              console.log('[LinkedIn Post Edge Function] Converted to member URN:', personUrn);
              
              // If conversion didn't work (still contains user_), we have a problem
              if (personUrn.includes('user_')) {
                return new Response(
                  JSON.stringify({
                    error: `Cannot extract numeric person ID from LinkedIn account. Please ensure your LinkedIn app has OpenID Connect scopes (openid, profile) enabled, then disconnect and reconnect your LinkedIn account.`,
                  }),
                  {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                  }
                );
              }
            } else {
              // No sub or id field in userInfo
              return new Response(
                JSON.stringify({
                  error: `LinkedIn OpenID Connect response does not contain user ID. Please ensure your LinkedIn app has OpenID Connect scopes (openid, profile) enabled, then disconnect and reconnect your LinkedIn account.`,
                }),
                {
                  status: 400,
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
              );
            }
          } else {
            // Both endpoints failed - try to get more details about the error
            let errorDetails = 'Unknown error';
            let errorStatus = userInfoResponse.status;
            
            try {
              const errorData = await userInfoResponse.json();
              errorDetails = errorData.error || errorData.error_description || errorData.message || JSON.stringify(errorData);
              console.error('[LinkedIn Post Edge Function] UserInfo error response:', JSON.stringify(errorData, null, 2));
            } catch {
              try {
                const errorText = await userInfoResponse.text();
                errorDetails = errorText || errorDetails;
                console.error('[LinkedIn Post Edge Function] UserInfo error (text):', errorText);
              } catch {
                errorDetails = `HTTP ${userInfoResponse.status}: ${userInfoResponse.statusText}`;
                console.error('[LinkedIn Post Edge Function] UserInfo error - status only:', userInfoResponse.status, userInfoResponse.statusText);
              }
            }
            
            // Since we can't get numeric ID, try making the post anyway with a placeholder
            // LinkedIn API might give us a more helpful error message
            console.warn('[LinkedIn Post Edge Function] Cannot get numeric ID from API, but will attempt post anyway - LinkedIn may provide helpful error');
            
            // We'll try to post with a placeholder and see what LinkedIn says
            // But first, let's provide a helpful error message
            return new Response(
              JSON.stringify({
                error: `Unable to get LinkedIn user ID from API endpoints.\n\n` +
                       `HTTP Status: ${errorStatus}\n` +
                       `Error: ${errorDetails}\n\n` +
                       `This usually means your LinkedIn app needs OpenID Connect scopes enabled.\n\n` +
                       `To fix this:\n` +
                       `1. Go to LinkedIn Developer Portal: https://www.linkedin.com/developers/apps\n` +
                       `2. Select your app → "Auth" tab\n` +
                       `3. In "Products" section, enable: "Sign In with LinkedIn using OpenID Connect"\n` +
                       `4. In "OAuth 2.0 scopes", ensure these are enabled:\n` +
                       `   - openid\n` +
                       `   - profile\n` +
                       `   - w_member_social\n` +
                       `5. Save changes\n` +
                       `6. Disconnect your LinkedIn account in the app\n` +
                       `7. Reconnect and grant ALL requested permissions\n\n` +
                       `Note: The old 'r_liteprofile' scope is deprecated. Use OpenID Connect scopes (openid, profile) instead.`,
                details: { 
                  userinfo_status: errorStatus,
                  userinfo_error: errorDetails,
                  v2_me_status: meResponse?.status || 'not_tried',
                  suggestion: 'Enable OpenID Connect product and scopes (openid, profile) in LinkedIn Developer Portal'
                }
              }),
              {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }
        }
      } catch (profileError: any) {
        console.error('[LinkedIn Post Edge Function] Profile fetch error:', profileError);
        console.error('[LinkedIn Post Edge Function] Profile fetch error details:', {
          message: profileError?.message,
          name: profileError?.name,
          stack: profileError?.stack,
          cause: profileError?.cause
        });
        
        const errorMessage = profileError?.message || 'Unknown error';
        return new Response(
          JSON.stringify({ 
            error: `Unable to get LinkedIn user ID. Please reconnect your LinkedIn account and ensure you grant all required permissions.\n\n` +
                   `Error: ${errorMessage}\n\n` +
                   `This usually means:\n` +
                   `1. Your LinkedIn app doesn't have OpenID Connect scopes enabled\n` +
                   `2. You need to disconnect and reconnect to grant new permissions\n\n` +
                   `To fix:\n` +
                   `1. Go to LinkedIn Developer Portal → Your App → "Auth" tab\n` +
                   `2. Ensure these scopes are enabled: "openid", "profile", "w_member_social"\n` +
                   `3. Save changes\n` +
                   `4. Disconnect your LinkedIn account in the app\n` +
                   `5. Reconnect and grant ALL requested permissions\n\n` +
                   `Note: The old 'r_liteprofile' scope is deprecated. Use OpenID Connect scopes (openid, profile) instead.`,
            details: {
              error_message: errorMessage,
              error_name: profileError?.name,
              suggestion: 'Enable OpenID Connect scopes (openid, profile) in LinkedIn Developer Portal'
            }
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Validate we have a person URN before attempting to post
    if (!personUrn || !personUrn.match(/^urn:li:member:\d+$/)) {
      return new Response(
        JSON.stringify({
          error: `Invalid person URN: ${personUrn || 'not provided'}. Expected format: urn:li:member:{numeric_id}.\n\n` +
                 `This should not happen if the Edge Function is working correctly. Please check the Edge Function logs for details.`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate we have a person URN before attempting to post
    if (!personUrn || !personUrn.match(/^urn:li:member:\d+$/)) {
      return new Response(
        JSON.stringify({
          error: `Invalid person URN: ${personUrn || 'not provided'}. Expected format: urn:li:member:{numeric_id}.\n\n` +
                 `This should not happen if the Edge Function is working correctly. Please check the Edge Function logs for details.`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare the post body
    const body: any = {
      author: personUrn,
      lifecycleState: options?.lifecycleState || 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: options?.mediaUrns && options.mediaUrns.length > 0 ? 'IMAGE' : 'NONE',
          media: options?.mediaUrns && options.mediaUrns.length > 0
            ? options.mediaUrns.map((urn: string) => ({ status: 'READY', media: urn }))
            : undefined,
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': options?.visibility || 'PUBLIC',
      },
    };

    // Post to LinkedIn
    console.log('[LinkedIn Post Edge Function] Posting to LinkedIn API...');
    console.log('[LinkedIn Post Edge Function] Post body:', JSON.stringify({
      author: body.author,
      lifecycleState: body.lifecycleState,
      visibility: body.visibility,
      hasMedia: !!body.specificContent['com.linkedin.ugc.ShareContent'].media,
      contentLength: body.specificContent['com.linkedin.ugc.ShareContent'].shareCommentary.text.length
    }, null, 2));
    
    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    });
    
    console.log('[LinkedIn Post Edge Function] Post response status:', postResponse.status);
    console.log('[LinkedIn Post Edge Function] Post response headers:', Object.fromEntries(postResponse.headers.entries()));

    if (!postResponse.ok) {
      let errorMessage = 'Failed to post to LinkedIn';
      let errorDetails: any = null;
      
      try {
        const errorData = await postResponse.json();
        errorDetails = errorData;
        errorMessage = errorData.message || errorData.error_description || errorData.error || errorMessage;
        console.error('[LinkedIn Post Edge Function] LinkedIn API error response:', JSON.stringify(errorData, null, 2));
      } catch {
        try {
          const errorText = await postResponse.text();
          errorMessage = errorText || errorMessage;
          console.error('[LinkedIn Post Edge Function] LinkedIn API error (text):', errorText);
        } catch {
          errorMessage = `HTTP ${postResponse.status}: ${postResponse.statusText}`;
          console.error('[LinkedIn Post Edge Function] LinkedIn API error - status only:', postResponse.status, postResponse.statusText);
        }
      }
      
      // Provide more descriptive error messages
      const errorStr = String(errorMessage).toLowerCase();
      if (postResponse.status === 400 && (errorStr.includes('author') || errorStr.includes('urn') || errorStr.includes('member'))) {
        errorMessage = `Invalid person URN format. ${errorMessage}. Please reconnect your LinkedIn account to refresh your credentials.`;
      } else if (postResponse.status === 401) {
        errorMessage = `LinkedIn authentication failed: ${errorMessage}. Please reconnect your LinkedIn account.`;
      } else if (postResponse.status === 403) {
        errorMessage = `LinkedIn permission denied: ${errorMessage}. Please ensure you have granted w_member_social scope.`;
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: errorDetails,
          status: postResponse.status
        }),
        {
          status: postResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const postData = await postResponse.json();
    console.log('Post successful, ID:', postData.id);
    return new Response(
      JSON.stringify({ id: postData.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in LinkedIn post function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

