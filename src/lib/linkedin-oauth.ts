/**
 * LinkedIn OAuth Integration
 * 
 * Functions for LinkedIn OAuth flow and token management
 */

import { supabase } from './supabase';

// Note: Token exchange is attempted via Supabase Edge Function first (more secure),
// then falls back to client-side if Edge Function is not deployed.
import {
  findOrCreateConnection,
  createLinkedInOAuthToken,
  getLinkedInOAuthTokenByConnection,
  updateLinkedInOAuthToken,
  getValidLinkedInToken,
} from './database';
import type { Connection, LinkedInOAuthToken } from '../types/database';

// LinkedIn OAuth Configuration
// 
// IMPORTANT: These are APP-LEVEL credentials (like "Login with Google" app credentials)
// - CLIENT_ID and CLIENT_SECRET are shared for the entire application
// - Each USER connects their own LinkedIn account via OAuth
// - User tokens are stored separately per user in linkedin_oauth_tokens table with user_id
// - RLS policies ensure users can only access their own tokens
//
// This is the standard OAuth pattern - similar to "Login with Google" where:
// - Google provides app credentials (same for all users)
// - Each user authenticates with their own Google account
// - Each user's tokens are stored separately
//
// These should be stored in environment variables
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '';
// Redirect URI: Use env var if set, otherwise construct from current origin
// IMPORTANT: This must match EXACTLY what's registered in LinkedIn Developer Portal
const LINKEDIN_REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI || `${window.location.origin}/auth/linkedin/callback`;
// LinkedIn OAuth Scopes
// - w_member_social: Required for posting content on behalf of user
// - openid, profile: OpenID Connect scopes to get user ID (replaces deprecated r_liteprofile)
// Note: w_member_social is essential for posting
// openid and profile are needed to get the numeric user ID required for posting
// r_liteprofile is deprecated as of August 2023, use OpenID Connect scopes instead
const LINKEDIN_SCOPES = ['w_member_social', 'openid', 'profile'];

/**
 * Normalize redirect URI to ensure consistency
 * - Remove trailing slashes
 * - Ensure proper encoding
 * - Return consistent format
 */
function normalizeRedirectUri(uri: string): string {
  if (!uri) return uri;

  // Remove trailing slash if present
  let normalized = uri.trim().replace(/\/$/, '');

  // Ensure it's a valid URL
  try {
    const url = new URL(normalized);
    // Reconstruct with normalized path (no trailing slash)
    normalized = `${url.protocol}//${url.host}${url.pathname}${url.search}${url.hash}`;

    // Fix for potentially malformed .env where other variables are appended
    if (normalized.includes('VITE_N8N_LINKEDIN_WEBHOOK_URL')) {
      const parts = normalized.split('VITE_N8N_LINKEDIN_WEBHOOK_URL');
      if (parts[0]) {
        normalized = parts[0];
        console.warn('Sanitized corrupted Redirect URI from .env');
      }
    }
  } catch (e) {
    // If not a valid URL, just return trimmed version
    console.warn('Redirect URI normalization warning:', e);
  }

  return normalized;
}

/**
 * Get the redirect URI being used (for debugging/configuration)
 */
export function getLinkedInRedirectUri(): string {
  return LINKEDIN_REDIRECT_URI;
}

/**
 * Generate LinkedIn OAuth authorization URL
 */
export function getLinkedInAuthUrl(state?: string): string {
  if (!LINKEDIN_CLIENT_ID) {
    throw new Error('LinkedIn Client ID is not configured. Please set VITE_LINKEDIN_CLIENT_ID in your environment variables.');
  }

  // Validate redirect URI
  if (!LINKEDIN_REDIRECT_URI) {
    throw new Error('LinkedIn Redirect URI is not configured. Please set VITE_LINKEDIN_REDIRECT_URI in your environment variables.');
  }

  // Validate redirect URI format
  try {
    const redirectUrl = new URL(LINKEDIN_REDIRECT_URI);
    if (!redirectUrl.protocol || !redirectUrl.host) {
      throw new Error('Invalid redirect URI format');
    }
  } catch (e) {
    throw new Error(`Invalid redirect URI format: ${LINKEDIN_REDIRECT_URI}. Please ensure it's a valid URL (e.g., http://localhost:5173/auth/linkedin/callback)`);
  }

  // Normalize redirect URI to ensure consistency
  const normalizedRedirectUri = normalizeRedirectUri(LINKEDIN_REDIRECT_URI);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: normalizedRedirectUri,
    scope: LINKEDIN_SCOPES.join(' '),
    state: state || generateState(),
  });

  // Generate the authorization URL
  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;

  // Parse the generated URL to extract the EXACT redirect_uri as LinkedIn sees it
  const urlObj = new URL(authorizationUrl);
  const redirectUriFromUrl = urlObj.searchParams.get('redirect_uri');

  // Store the EXACT redirect_uri as it appears in the authorization URL (URL-encoded)
  // This is what LinkedIn receives and expects back
  if (redirectUriFromUrl) {
    sessionStorage.setItem('linkedin_redirect_uri', redirectUriFromUrl);
  } else {
    // Fallback: store the normalized version
    sessionStorage.setItem('linkedin_redirect_uri', normalizedRedirectUri);
  }

  // Debug logging with complete information
  console.log('[LinkedIn Debug]', {
    event: 'oauth_authorization_url_generated',
    timestamp: new Date().toISOString(),
    redirect_uri_original: LINKEDIN_REDIRECT_URI,
    redirect_uri_normalized: normalizedRedirectUri,
    redirect_uri_in_url: redirectUriFromUrl || normalizedRedirectUri,
    redirect_uri_stored: redirectUriFromUrl || normalizedRedirectUri,
    client_id: maskId(LINKEDIN_CLIENT_ID),
    scopes: LINKEDIN_SCOPES,
    authorization_url: authorizationUrl, // Full URL for debugging
  });

  // Log the redirect URI being used (for debugging - remove in production)
  if (import.meta.env.DEV) {
    console.log('LinkedIn OAuth Redirect URI (original):', LINKEDIN_REDIRECT_URI);
    console.log('LinkedIn OAuth Redirect URI (normalized):', normalizedRedirectUri);
    console.log('LinkedIn OAuth Redirect URI (in URL):', redirectUriFromUrl);
    console.log('Current origin:', window.location.origin);
    console.log('Full Authorization URL:', authorizationUrl);
  }

  return authorizationUrl;
}

/**
 * Generate a random state for OAuth flow
 */
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Exchange authorization code for access token
 * Uses Supabase Edge Function to avoid CORS issues and keep client secret secure
 */
async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  refresh_token_expires_in?: number;
  profile?: any;
}> {
  // Retrieve the exact redirect URI used in authorization from sessionStorage
  // This is the EXACT redirect_uri as it appeared in the authorization URL (URL-decoded)
  const storedRedirectUri = sessionStorage.getItem('linkedin_redirect_uri');

  // Use the stored redirect URI if available, otherwise fall back to normalized current URI
  // The stored URI is already the decoded version from the authorization URL
  let redirectUriToUse: string;
  if (storedRedirectUri) {
    // The stored URI is already decoded (URLSearchParams.get() returns decoded value)
    // Just normalize it (remove trailing slashes) but don't re-encode
    redirectUriToUse = normalizeRedirectUri(storedRedirectUri);
  } else {
    // Fallback: normalize the current redirect URI
    redirectUriToUse = normalizeRedirectUri(LINKEDIN_REDIRECT_URI);
    console.warn('[LinkedIn Debug] No stored redirect_uri found in sessionStorage, using current normalized URI');
  }

  // Debug logging with detailed comparison
  const normalizedOriginal = normalizeRedirectUri(LINKEDIN_REDIRECT_URI);
  const exactMatch = redirectUriToUse === normalizedOriginal;

  console.log('[LinkedIn Debug]', {
    event: 'token_exchange_initiated',
    timestamp: new Date().toISOString(),
    redirect_uri_from_storage: !!storedRedirectUri,
    redirect_uri_stored_value: storedRedirectUri || 'not_found',
    redirect_uri_used: redirectUriToUse,
    redirect_uri_original: LINKEDIN_REDIRECT_URI,
    redirect_uri_normalized_original: normalizedOriginal,
    redirect_uri_exact_match: exactMatch,
    redirect_uri_will_be_encoded: true, // URLSearchParams will encode it
    note: exactMatch ? 'Redirect URIs match - should work' : 'Redirect URIs differ - may cause mismatch',
  });

  // Try using Supabase Edge Function first (preferred - more secure)
  try {
    const { data, error } = await supabase.functions.invoke('linkedin-oauth', {
      body: {
        code,
        redirect_uri: redirectUriToUse,
      },
    });

    if (error) {
      console.error('Edge Function error:', error);
      // If function doesn't exist, fall through to client-side
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        throw new Error('EDGE_FUNCTION_NOT_DEPLOYED');
      }
      throw error;
    }

    if (data?.error) {
      console.error('Edge Function returned error:', data.error);

      // Debug logging for error
      console.log('[LinkedIn Debug]', {
        event: 'token_exchange_failed',
        status: 'error',
        timestamp: new Date().toISOString(),
        redirect_uri_used: redirectUriToUse,
        error: data.error,
        error_type: data.error.includes('redirect') ? 'redirect_uri_mismatch' :
          data.error.includes('expired') ? 'code_expired' :
            data.error.includes('appid') ? 'client_id_mismatch' : 'unknown',
      });

      throw new Error(data.error);
    }

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      refresh_token_expires_in: data.refresh_token_expires_in,
      profile: data.profile || undefined,
    };
  } catch (edgeFunctionError: any) {
    // Check if Edge Function is not deployed
    if (edgeFunctionError?.message === 'EDGE_FUNCTION_NOT_DEPLOYED') {
      throw new Error(
        'LinkedIn OAuth Edge Function is not deployed. ' +
        'Please deploy the linkedin-oauth Edge Function in Supabase and set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET as secrets. ' +
        'See DEPLOY_LINKEDIN_OAUTH_FUNCTION.md for instructions.'
      );
    }

    // Fallback to client-side if Edge Function is not available
    console.warn('Edge Function not available, using client-side token exchange:', edgeFunctionError);

    const LINKEDIN_CLIENT_SECRET = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET;

    if (!LINKEDIN_CLIENT_SECRET) {
      throw new Error(
        'LinkedIn client secret not configured. ' +
        'Please set VITE_LINKEDIN_CLIENT_SECRET in your environment variables, ' +
        'or deploy the linkedin-oauth Supabase Edge Function.'
      );
    }

    let response: Response;
    try {
      response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUriToUse,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
        }),
      });
    } catch (networkError: any) {
      // Handle network/CORS errors
      console.error('Network error during token exchange:', networkError);
      throw new Error(
        `Network error: Unable to connect to LinkedIn. This might be a CORS issue. ` +
        `Please deploy the linkedin-oauth Supabase Edge Function for a more reliable connection. ` +
        `Error: ${networkError?.message || 'Unknown network error'}`
      );
    }

    if (!response.ok) {
      let errorMessage = 'Failed to exchange code for token';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error_description || errorData.error || errorMessage;
        console.error('LinkedIn token exchange error:', errorData);
      } catch {
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
          console.error('LinkedIn token exchange error (text):', errorText);
        } catch {
          console.error('LinkedIn token exchange failed with status:', response.status, response.statusText);
        }
      }
      throw new Error(errorMessage);
    }

    const tokenData = await response.json();

    // Validate token response
    if (!tokenData.access_token) {
      throw new Error('LinkedIn did not return an access token. Please check your app configuration.');
    }

    return {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      refresh_token_expires_in: tokenData.refresh_token_expires_in,
    };
  }
}

/**
 * Get LinkedIn user profile information
 * Note: This may require r_liteprofile scope. If not available, returns minimal profile.
 */
async function getLinkedInProfile(accessToken: string): Promise<{
  id: string;
  firstName: { localized: { [key: string]: string } };
  lastName: { localized: { [key: string]: string } };
  profilePicture?: { displayImage: string };
}> {
  try {
    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // If profile fetch fails (e.g., missing r_liteprofile scope), return minimal profile
      // We can still use the access token for posting
      console.warn('Could not fetch full LinkedIn profile. Using minimal profile info.');
      return {
        id: 'unknown',
        firstName: { localized: { en_US: 'User' } },
        lastName: { localized: { en_US: '' } },
      };
    }

    return response.json();
  } catch (error) {
    console.warn('Error fetching LinkedIn profile:', error);
    // Return minimal profile so OAuth can complete
    return {
      id: 'unknown',
      firstName: { localized: { en_US: 'User' } },
      lastName: { localized: { en_US: '' } },
    };
  }
}

/**
 * Refresh LinkedIn access token
 */
async function refreshLinkedInToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const LINKEDIN_CLIENT_SECRET = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET;

  if (!LINKEDIN_CLIENT_SECRET) {
    throw new Error('LinkedIn client secret not configured');
  }

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh LinkedIn token');
  }

  return response.json();
}

/**
 * Encrypt token (client-side encryption before sending to database)
 * Note: In production, encryption should happen server-side
 */
function encryptToken(token: string): string {
  // Simple base64 encoding for now
  // In production, use proper encryption or let the database handle it
  return btoa(token);
}

/**
 * Decrypt token (client-side decryption after receiving from database)
 */
function decryptToken(encryptedToken: string): string {
  // Simple base64 decoding for now
  return atob(encryptedToken);
}

/**
 * Mask token for safe logging (shows first 10 chars and last 4 chars)
 */
function maskToken(token: string): string {
  if (!token || token.length < 15) {
    return '***';
  }
  return `${token.substring(0, 10)}...${token.substring(token.length - 4)}`;
}

/**
 * Mask ID for safe logging (shows first 4 and last 4 characters)
 */
function maskId(id: string): string {
  if (!id || id.length < 9) {
    return '***';
  }
  return `${id.substring(0, 4)}...${id.substring(id.length - 4)}`;
}

/**
 * Complete LinkedIn OAuth flow and store tokens
 */
export async function completeLinkedInOAuth(
  code: string,
  userId: string,
  brandId: string
): Promise<{ connection: Connection; token: LinkedInOAuthToken }> {
  try {
    // Exchange code for token (may include profile if Edge Function is used)
    const tokenData = await exchangeCodeForToken(code);

    // Get user profile (optional - may fail if r_liteprofile scope not available)
    // Edge Function may have already fetched profile, so check tokenData.profile first
    let profile: { id: string; firstName: { localized: { [key: string]: string } }; lastName: { localized: { [key: string]: string } }; profilePicture?: { displayImage: string } };

    if (tokenData.profile) {
      // Use profile from Edge Function response
      profile = tokenData.profile;
    } else {
      // Try fetching profile separately
      try {
        profile = await getLinkedInProfile(tokenData.access_token);
      } catch (error) {
        console.warn('Could not fetch LinkedIn profile, using minimal info:', error);
        // Use minimal profile info - we can still post without full profile
        profile = {
          id: 'unknown',
          firstName: { localized: { en_US: 'User' } },
          lastName: { localized: { en_US: '' } },
        };
      }
    }

    // Create or update connection
    let connection: Connection;
    try {
      connection = await findOrCreateConnection(userId, brandId, 'linkedin');
    } catch (error: any) {
      throw new Error(`Failed to create connection: ${error?.message || error}`);
    }

    // Calculate expiration dates
    const tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
    const refreshTokenExpiresAt = tokenData.refresh_token_expires_in
      ? new Date(Date.now() + tokenData.refresh_token_expires_in * 1000).toISOString()
      : null;

    // Check if token already exists
    const existingToken = await getLinkedInOAuthTokenByConnection(connection.id);

    // Build profile name safely
    const firstName = profile.firstName?.localized?.en_US || profile.firstName?.localized?.[Object.keys(profile.firstName.localized || {})[0]] || '';
    const lastName = profile.lastName?.localized?.en_US || profile.lastName?.localized?.[Object.keys(profile.lastName.localized || {})[0]] || '';
    const profileName = `${firstName} ${lastName}`.trim() || 'LinkedIn User';

    const tokenDataToStore = {
      connection_id: connection.id,
      user_id: userId,
      brand_id: brandId,
      access_token_encrypted: encryptToken(tokenData.access_token),
      refresh_token_encrypted: tokenData.refresh_token
        ? encryptToken(tokenData.refresh_token)
        : null,
      token_expires_at: tokenExpiresAt,
      refresh_token_expires_at: refreshTokenExpiresAt,
      oauth_scopes: LINKEDIN_SCOPES,
      linkedin_user_id: profile.id !== 'unknown' ? profile.id : `user_${userId.substring(0, 8)}`,
      linkedin_profile_url: profile.id !== 'unknown' ? `https://www.linkedin.com/in/${profile.id}` : null,
      profile_name: profileName,
      profile_picture_url: profile.profilePicture?.displayImage || null,
    };

    let token: LinkedInOAuthToken;

    try {
      if (existingToken) {
        // Update existing token
        token = await updateLinkedInOAuthToken(existingToken.id, tokenDataToStore);
      } else {
        // Create new token
        token = await createLinkedInOAuthToken(tokenDataToStore);
      }
    } catch (error: any) {
      throw new Error(`Failed to save LinkedIn token: ${error?.message || error}`);
    }

    // Debug logging: OAuth completion
    console.log('[LinkedIn Debug]', {
      event: 'oauth_complete',
      status: 'success',
      timestamp: new Date().toISOString(),
      user_id: maskId(userId),
      brand_id: maskId(brandId),
      connection_id: maskId(connection.id),
      token_expires_at: tokenExpiresAt,
      refresh_token_expires_at: refreshTokenExpiresAt,
      has_refresh_token: !!tokenData.refresh_token,
      linkedin_user_id: profile.id !== 'unknown' ? profile.id : `user_${maskId(userId)}`,
      profile_name: profileName,
      profile_picture_url: profile.profilePicture?.displayImage ? 'present' : 'not_available',
      linkedin_profile_url: profile.id !== 'unknown' ? `https://www.linkedin.com/in/${profile.id}` : null,
      oauth_scopes: LINKEDIN_SCOPES,
      token_storage: existingToken ? 'updated' : 'created',
      access_token_preview: maskToken(tokenData.access_token),
    });

    return { connection, token };
  } catch (error: any) {
    // Re-throw with more context
    if (error.message) {
      throw error;
    }
    throw new Error(`LinkedIn OAuth failed: ${error}`);
  }
}

/**
 * Get valid access token (with automatic refresh if needed)
 * Returns both access token and person URN
 */
export async function getValidAccessToken(brandId: string): Promise<{ accessToken: string; personUrn: string } | null> {
  const token = await getValidLinkedInToken(brandId);

  if (!token) {
    // Debug logging: Token not found
    console.log('[LinkedIn Debug]', {
      event: 'token_retrieval',
      status: 'not_found',
      timestamp: new Date().toISOString(),
      brand_id: maskId(brandId),
      message: 'No valid LinkedIn token found in database',
    });
    return null;
  }

  // Check if token is expired or expiring soon (within 5 minutes)
  const expiresAt = new Date(token.token_expires_at);
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  let accessToken: string;
  let tokenRefreshed = false;
  let tokenValidity: 'valid' | 'expired' | 'expiring_soon';

  if (expiresAt > fiveMinutesFromNow) {
    // Token is still valid
    accessToken = decryptToken(token.access_token_encrypted);
    tokenValidity = 'valid';
  } else {
    // Token is expired or expiring soon, try to refresh
    tokenValidity = expiresAt > now ? 'expiring_soon' : 'expired';

    if (!token.refresh_token_encrypted) {
      console.error('No refresh token available');
      console.log('[LinkedIn Debug]', {
        event: 'token_retrieval',
        status: 'failed',
        timestamp: new Date().toISOString(),
        brand_id: maskId(brandId),
        reason: 'no_refresh_token',
        token_validity: tokenValidity,
      });
      return null;
    }

    try {
      const refreshToken = decryptToken(token.refresh_token_encrypted);
      const newTokenData = await refreshLinkedInToken(refreshToken);

      // Update stored token
      const newExpiresAt = new Date(Date.now() + newTokenData.expires_in * 1000).toISOString();
      await updateLinkedInOAuthToken(token.id, {
        access_token_encrypted: encryptToken(newTokenData.access_token),
        token_expires_at: newExpiresAt,
        last_token_refresh_at: new Date().toISOString(),
      });

      accessToken = newTokenData.access_token;
      tokenRefreshed = true;
    } catch (error) {
      console.error('Failed to refresh LinkedIn token:', error);
      console.log('[LinkedIn Debug]', {
        event: 'token_retrieval',
        status: 'failed',
        timestamp: new Date().toISOString(),
        brand_id: maskId(brandId),
        reason: 'refresh_failed',
        token_validity: tokenValidity,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  // Get person URN from stored token (linkedin_user_id)
  // Convert to the format required by LinkedIn UGC Posts API: urn:li:member:{numeric_id}
  let personUrn = token.linkedin_user_id;
  const originalUrn = personUrn;

  // Helper function to convert to member URN format
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

    // If it's just a numeric ID, convert to member URN
    if (/^\d+$/.test(urn)) {
      return `urn:li:member:${urn}`;
    }

    // If it contains "user_" prefix (urn:li:person:user_xxxxx), we can't extract numeric ID
    // This will need to be fetched from API
    if (urn.includes('user_')) {
      console.warn('Stored URN contains user_ prefix, cannot convert to member format:', urn);
      return urn; // Will be handled by Edge Function
    }

    // If it's urn:li:person:xxx (non-numeric), try to extract numeric part
    const numericMatch = urn.match(/(\d+)$/);
    if (numericMatch) {
      return `urn:li:member:${numericMatch[1]}`;
    }

    // Default: try to add member prefix if it doesn't have one
    if (!urn.startsWith('urn:li:')) {
      return `urn:li:member:${urn}`;
    }

    return urn;
  }

  if (personUrn) {
    personUrn = convertToMemberUrn(personUrn);
  }

  // Debug logging: Token retrieval success
  console.log('[LinkedIn Debug]', {
    event: 'token_retrieval',
    status: 'success',
    timestamp: new Date().toISOString(),
    brand_id: maskId(brandId),
    token_validity: tokenValidity,
    token_refreshed: tokenRefreshed,
    token_preview: maskToken(accessToken),
    original_person_urn: originalUrn,
    converted_person_urn: personUrn,
    urn_converted: originalUrn !== personUrn,
    token_expires_at: token.token_expires_at,
  });

  return { accessToken, personUrn };
}

/**
 * Get LinkedIn user URN (person ID)
 */
async function getLinkedInPersonUrn(accessToken: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (networkError: any) {
    console.error('Network error fetching LinkedIn profile:', networkError);
    throw new Error(
      `Network error: Unable to connect to LinkedIn API. ` +
      `This might be a CORS issue or network connectivity problem. ` +
      `Error: ${networkError?.message || 'Unknown network error'}`
    );
  }

  if (!response.ok) {
    let errorMessage = 'Failed to fetch LinkedIn profile';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error_description || errorData.error || errorMessage;
      console.error('LinkedIn profile API error:', errorData);
    } catch {
      try {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
    }

    if (response.status === 401) {
      throw new Error('LinkedIn authentication failed. Your access token may have expired. Please reconnect your LinkedIn account.');
    } else if (response.status === 403) {
      throw new Error('LinkedIn permission denied. Please ensure you have granted the required permissions.');
    } else {
      throw new Error(errorMessage);
    }
  }

  const data = await response.json();
  if (!data.id) {
    throw new Error('LinkedIn API did not return a valid user ID');
  }
  return data.id; // Returns URN like "urn:li:person:xxxxx"
}

/**
 * Post content to LinkedIn
 */
export async function postToLinkedIn(
  accessToken: string,
  content: string,
  options: {
    mediaUrns?: string[];
    visibility?: 'PUBLIC' | 'CONNECTIONS';
    lifecycleState?: 'PUBLISHED' | 'DRAFT';
    personUrn?: string; // Optional: pass person URN to avoid API call
  } = {}
): Promise<{ id: string }> {
  // Try using Supabase Edge Function first (avoids CORS issues)
  try {
    console.log('[LinkedIn Post] Attempting to use Edge Function for LinkedIn post...');
    console.log('[LinkedIn Post] Options:', {
      hasPersonUrn: !!options.personUrn,
      personUrn: options.personUrn,
      lifecycleState: options.lifecycleState,
      visibility: options.visibility
    });

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn('[LinkedIn Post] User not authenticated, Edge Function may fail:', authError);
    } else {
      console.log('[LinkedIn Post] User authenticated:', user.id);
    }

    // Validate person URN format if provided
    let personUrn = options.personUrn;
    if (personUrn) {
      // Validate URN format
      const isValidUrn = personUrn.match(/^urn:li:(member|person):\d+$/) || personUrn.match(/^\d+$/);
      if (!isValidUrn && !personUrn.includes('user_')) {
        console.warn('[LinkedIn Post] Person URN format may be invalid:', personUrn);
      }
      console.log('[LinkedIn Post] Using provided person URN:', personUrn);
    } else {
      console.log('[LinkedIn Post] No person URN provided, Edge Function will fetch it');
    }

    // Check Supabase configuration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('[LinkedIn Post] VITE_SUPABASE_URL is not configured');
      throw new Error('Supabase URL is not configured. Please check your environment variables.');
    }
    console.log('[LinkedIn Post] Supabase URL configured:', supabaseUrl ? 'Yes' : 'No');

    let invokeResult;
    try {
      // Get the current session to ensure we're authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn('[LinkedIn Post] No active session, Edge Function may require authentication');
      }

      console.log('[LinkedIn Post] Invoking Edge Function with:', {
        functionName: 'linkedin-post',
        hasAccessToken: !!accessToken,
        accessTokenLength: accessToken?.length || 0,
        contentLength: content?.length || 0,
        hasPersonUrn: !!personUrn,
        hasSession: !!session
      });

      invokeResult = await supabase.functions.invoke('linkedin-post', {
        body: {
          access_token: accessToken,
          content,
          options: {
            ...options,
            person_urn: personUrn, // Pass person URN if available
          },
        },
      });

      console.log('[LinkedIn Post] Edge Function invoke completed');
    } catch (invokeError: any) {
      // Catch network errors from the invoke call itself
      console.error('[LinkedIn Post] Edge Function invoke failed:', invokeError);
      console.error('[LinkedIn Post] Invoke error details:', {
        message: invokeError?.message,
        name: invokeError?.name,
        stack: invokeError?.stack,
        cause: invokeError?.cause,
        toString: invokeError?.toString?.()
      });

      // Check if it's a network/CORS error
      const errorMsg = invokeError?.message || String(invokeError);
      const isNetworkError = errorMsg.includes('Failed to fetch') ||
        invokeError?.name === 'TypeError' ||
        errorMsg.includes('NetworkError') ||
        errorMsg.includes('fetch') ||
        errorMsg.includes('Network request failed') ||
        (invokeError?.name === 'TypeError' && errorMsg.includes('fetch'));

      if (isNetworkError) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        throw new Error(
          `EDGE_FUNCTION_INVOKE_FAILED: Unable to invoke Supabase Edge Function.\n\n` +
          `Error: ${errorMsg}\n\n` +
          `Diagnostics:\n` +
          `- Supabase URL configured: ${supabaseUrl ? 'Yes' : 'No'}\n` +
          `- Supabase Key configured: ${supabaseKey ? 'Yes' : 'No'}\n` +
          `- Function name: "linkedin-post"\n\n` +
          `Possible causes:\n` +
          `1. Edge Function "linkedin-post" is not deployed\n` +
          `2. Incorrect Supabase project URL or keys\n` +
          `3. Network connectivity issue\n` +
          `4. CORS configuration problem\n` +
          `5. You are not authenticated (not logged in)\n\n` +
          `Please check:\n` +
          `1. Supabase Dashboard → Edge Functions → Verify "linkedin-post" exists and is deployed\n` +
          `2. Your .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY\n` +
          `3. You are logged in to the application\n` +
          `4. Check browser console (F12) for detailed error messages\n` +
          `5. Check Supabase Dashboard → Edge Functions → Logs for function errors\n\n` +
          `To deploy the function:\n` +
          `1. Go to Supabase Dashboard → Edge Functions\n` +
          `2. Create new function named "linkedin-post"\n` +
          `3. Copy code from supabase/functions/linkedin-post/index.ts\n` +
          `4. Click Deploy`
        );
      }
      throw invokeError;
    }

    const { data, error } = invokeResult;

    console.log('[LinkedIn Post] Edge Function response:', {
      hasData: !!data,
      hasError: !!error,
      dataId: data?.id,
      dataError: data?.error,
      errorMessage: error?.message,
      errorName: error?.name,
      errorContext: error?.context,
      errorStatus: error?.status
    });

    if (error) {
      console.error('[LinkedIn Post] Edge Function returned error:', error);
      console.error('[LinkedIn Post] Error details:', JSON.stringify(error, null, 2));

      // Check for specific error types
      const errorMessage = error?.message || String(error);
      const errorStr = errorMessage.toLowerCase();
      const errorName = error?.name || '';

      // Check if it's a network/invoke error (function not reachable)
      if (errorStr.includes('failed to fetch') ||
        errorStr.includes('networkerror') ||
        errorStr.includes('network') ||
        errorStr.includes('fetch') ||
        errorName === 'TypeError' ||
        error?.status === 0 ||
        (error?.message && error.message.includes('Failed to fetch'))) {
        throw new Error(
          `EDGE_FUNCTION_INVOKE_FAILED: Unable to invoke Supabase Edge Function.\n\n` +
          `Error: ${errorMessage}\n\n` +
          `This means the Edge Function "linkedin-post" cannot be reached. The function is likely NOT deployed.\n\n` +
          `Steps to fix:\n` +
          `1. Go to Supabase Dashboard → Edge Functions\n` +
          `2. Check if "linkedin-post" function exists\n` +
          `3. If not, create it:\n` +
          `   - Click "Create a new function"\n` +
          `   - Name it exactly: "linkedin-post"\n` +
          `   - Copy code from: supabase/functions/linkedin-post/index.ts\n` +
          `   - Click "Deploy"\n` +
          `4. Verify your .env file has:\n` +
          `   VITE_SUPABASE_URL=your-project-url\n` +
          `   VITE_SUPABASE_ANON_KEY=your-anon-key\n` +
          `5. Make sure you are logged in to the application\n\n` +
          `See DEPLOY_LINKEDIN_OAUTH_STEP_BY_STEP.md for detailed instructions.`
        );
      }

      if (errorStr.includes('not found') || errorStr.includes('404') || errorStr.includes('function not found')) {
        throw new Error(
          'EDGE_FUNCTION_NOT_DEPLOYED: The "linkedin-post" Edge Function is not deployed. ' +
          'Please deploy it in Supabase Dashboard → Edge Functions. ' +
          'See DEPLOY_LINKEDIN_OAUTH_STEP_BY_STEP.md for instructions.'
        );
      }

      // Authentication errors
      if (errorStr.includes('unauthorized') || errorStr.includes('401') || errorStr.includes('auth')) {
        throw new Error(
          `EDGE_FUNCTION_AUTH_ERROR: Authentication failed when calling Edge Function. ` +
          `Please ensure you are logged in and try again. Error: ${errorMessage}`
        );
      }

      throw new Error(`Edge Function error: ${errorMessage}`);
    }

    if (data?.error) {
      console.error('[LinkedIn Post] Edge Function returned error:', data.error);
      console.error('[LinkedIn Post] Full error response:', JSON.stringify(data, null, 2));

      // Provide helpful error messages for common issues
      const errorStr = String(data.error).toLowerCase();
      if (errorStr.includes('revoked') || errorStr.includes('token used in the request has been revoked')) {
        throw new Error('Your LinkedIn connection has been revoked. The token used in the request has been revoked by the user. Please reconnect your LinkedIn account.');
      } else if (errorStr.includes('authentication') || errorStr.includes('401') || errorStr.includes('unauthorized')) {
        throw new Error('LinkedIn authentication failed. Your access token may have expired. Please reconnect your LinkedIn account.');
      } else if (errorStr.includes('permission') || errorStr.includes('403') || errorStr.includes('forbidden')) {
        throw new Error('LinkedIn permission denied. Please ensure you have granted the required permissions (w_member_social scope).');
      } else if (errorStr.includes('rate limit') || errorStr.includes('429') || errorStr.includes('too many')) {
        throw new Error('LinkedIn rate limit exceeded. Please try again in a few minutes.');
      } else if (errorStr.includes('author') || errorStr.includes('urn') || errorStr.includes('member')) {
        throw new Error(`LinkedIn API error: ${data.error}. This may be a person URN format issue. Please reconnect your LinkedIn account.`);
      } else {
        throw new Error(`LinkedIn API error: ${data.error}`);
      }
    }

    if (!data?.id) {
      throw new Error('Edge Function did not return a post ID. Please check the function logs.');
    }

    console.log('Successfully posted via Edge Function, post ID:', data.id);
    return { id: data.id };
  } catch (edgeFunctionError: any) {
    console.error('[LinkedIn Post] Edge Function error details:', edgeFunctionError);
    console.error('[LinkedIn Post] Full error object:', JSON.stringify(edgeFunctionError, null, 2));

    const errorMessage = edgeFunctionError?.message || String(edgeFunctionError);
    const errorStr = errorMessage.toLowerCase();

    // Check if Edge Function is not deployed
    if (errorMessage.includes('EDGE_FUNCTION_NOT_DEPLOYED') || errorStr.includes('not found') || errorStr.includes('404')) {
      throw new Error(
        'LinkedIn Post Edge Function is not deployed or not found.\n\n' +
        'Please verify:\n' +
        '1. The function name is exactly "linkedin-post" (lowercase, with hyphen)\n' +
        '2. The function is deployed in your Supabase project\n' +
        '3. Go to Supabase Dashboard → Edge Functions → Check if "linkedin-post" exists\n\n' +
        'See DEPLOY_LINKEDIN_OAUTH_STEP_BY_STEP.md for deployment instructions.'
      );
    }

    // Check if it's an invoke failure (network/CORS) - DO NOT FALLBACK, throw error immediately
    if (errorMessage.includes('EDGE_FUNCTION_INVOKE_FAILED') ||
      errorMessage.includes('EDGE_FUNCTION_NETWORK_ERROR') ||
      errorStr.includes('failed to fetch') ||
      errorStr.includes('networkerror') ||
      errorStr.includes('network') ||
      edgeFunctionError?.name === 'TypeError') {
      // This is a network error calling the Edge Function - don't fallback to client-side (will also fail)
      throw new Error(
        `Unable to connect to Supabase Edge Function.\n\n` +
        `Error: ${errorMessage}\n\n` +
        `This means the Edge Function "linkedin-post" cannot be reached. Possible causes:\n` +
        `1. Edge Function "linkedin-post" is NOT deployed in Supabase\n` +
        `2. Supabase project URL or keys are incorrect\n` +
        `3. You are not authenticated (not logged in)\n` +
        `4. Network connectivity issue\n\n` +
        `IMPORTANT: Client-side posting will also fail due to CORS restrictions.\n` +
        `You MUST deploy the Edge Function to fix this issue.\n\n` +
        `Steps to fix:\n` +
        `1. Go to Supabase Dashboard → Edge Functions\n` +
        `2. Check if "linkedin-post" function exists\n` +
        `3. If not, create it and copy code from: supabase/functions/linkedin-post/index.ts\n` +
        `4. Deploy the function\n` +
        `5. Verify your .env file has:\n` +
        `   VITE_SUPABASE_URL=your-project-url\n` +
        `   VITE_SUPABASE_ANON_KEY=your-anon-key\n` +
        `6. Make sure you are logged in to the application\n\n` +
        `See DEPLOY_LINKEDIN_OAUTH_STEP_BY_STEP.md for detailed deployment instructions.`
      );
    }

    // Check if it's an authentication error
    if (errorMessage.includes('EDGE_FUNCTION_AUTH_ERROR') || errorStr.includes('unauthorized') || errorStr.includes('401')) {
      throw new Error(
        `Authentication failed when calling Edge Function.\n\n` +
        `Please ensure you are logged in and try again.\n` +
        `If the problem persists, try logging out and logging back in.`
      );
    }

    // Only fallback if it's a specific error from the Edge Function (not a network/invoke error)
    // For example, if Edge Function returned an error response (not a network failure)
    const isEdgeFunctionResponseError = errorMessage.includes('Edge Function error:') ||
      errorMessage.includes('Edge Function returned error:');

    if (!isEdgeFunctionResponseError) {
      // If it's not a response error, it's likely a network/invoke error - don't fallback
      throw new Error(
        `Edge Function invocation failed: ${errorMessage}\n\n` +
        `Please check:\n` +
        `1. Edge Function "linkedin-post" is deployed\n` +
        `2. Your Supabase configuration is correct\n` +
        `3. You are logged in\n` +
        `4. Check browser console and Supabase logs for details`
      );
    }

    // Only attempt fallback if Edge Function returned an error response (not a network failure)
    console.warn('[LinkedIn Post] Edge Function returned error response, attempting client-side fallback:', edgeFunctionError);

    try {
      // Get person URN
      const personUrn = await getLinkedInPersonUrn(accessToken);

      const body: any = {
        author: personUrn,
        lifecycleState: options.lifecycleState || 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: options.mediaUrns && options.mediaUrns.length > 0 ? 'IMAGE' : 'NONE',
            media: options.mediaUrns && options.mediaUrns.length > 0
              ? options.mediaUrns.map(urn => ({ status: 'READY', media: urn }))
              : undefined,
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': options.visibility || 'PUBLIC',
        },
      };

      let response: Response;
      try {
        response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
          body: JSON.stringify(body),
        });
      } catch (networkError: any) {
        console.error('Network error posting to LinkedIn:', networkError);
        throw new Error(
          `Network error: Unable to connect to LinkedIn API. ` +
          `This might be a CORS issue. Please deploy the linkedin-post Edge Function in Supabase. ` +
          `Error: ${networkError?.message || 'Unknown network error'}`
        );
      }

      if (!response.ok) {
        let errorMessage = 'Failed to post to LinkedIn';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error_description || errorData.error || errorMessage;
          console.error('LinkedIn API error:', errorData);
        } catch {
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
            console.error('LinkedIn API error (text):', errorText);
          } catch {
            console.error('LinkedIn API error - status:', response.status, response.statusText);
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        }

        // Provide helpful error messages for common issues
        if (response.status === 401) {
          throw new Error('LinkedIn authentication failed. Your access token may have expired. Please reconnect your LinkedIn account.');
        } else if (response.status === 403) {
          throw new Error('LinkedIn permission denied. Please ensure you have granted the required permissions (w_member_social scope).');
        } else if (response.status === 429) {
          throw new Error('LinkedIn rate limit exceeded. Please try again in a few minutes.');
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      return { id: data.id };
    } catch (error: any) {
      // Re-throw with context if it's already a formatted error
      if (error.message && (error.message.includes('Network error') || error.message.includes('authentication') || error.message.includes('permission'))) {
        throw error;
      }
      // Otherwise, wrap it
      throw new Error(`Failed to post to LinkedIn: ${error?.message || error}`);
    }
  }
}

/**
 * Schedule a post on LinkedIn by creating a DRAFT and then publishing it later
 * Note: LinkedIn doesn't have native scheduling API, so we create a draft and publish it at scheduled time
 */
export async function scheduleLinkedInPost(
  accessToken: string,
  content: string,
  scheduledAt: Date,
  options: {
    mediaUrns?: string[];
    visibility?: 'PUBLIC' | 'CONNECTIONS';
    personUrn?: string; // Optional: pass person URN to avoid API call
  } = {}
): Promise<{ id: string; draftId: string }> {
  // Create a DRAFT post first
  const draftResult = await postToLinkedIn(accessToken, content, {
    ...options,
    lifecycleState: 'DRAFT',
    personUrn: options.personUrn,
  });

  // Return both the draft ID and the post ID
  // The draft ID can be used later to publish the post
  return {
    id: draftResult.id,
    draftId: draftResult.id,
  };
}

/**
 * Publish a draft post on LinkedIn
 */
export async function publishLinkedInDraft(
  accessToken: string,
  draftId: string
): Promise<{ id: string }> {
  // Get person URN
  const personUrn = await getLinkedInPersonUrn(accessToken);

  // Update the draft to PUBLISHED state
  const body: any = {
    id: draftId,
    lifecycleState: 'PUBLISHED',
  };

  const response = await fetch(`https://api.linkedin.com/v2/ugcPosts/${draftId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to publish LinkedIn draft: ${error}`);
  }

  const data = await response.json();
  return { id: data.id || draftId };
}

/**
 * Check if user has LinkedIn connection
 */
export async function hasLinkedInConnection(brandId: string): Promise<boolean> {
  const token = await getValidLinkedInToken(brandId);
  const isConnected = token !== null;

  // Debug logging: Connection check
  if (token) {
    const expiresAt = new Date(token.token_expires_at);
    const now = new Date();
    const expiresInMs = expiresAt.getTime() - now.getTime();
    const expiresInDays = Math.floor(expiresInMs / (1000 * 60 * 60 * 24));
    const expiresInHours = Math.floor((expiresInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    console.log('[LinkedIn Debug]', {
      event: 'connection_check',
      status: 'success',
      timestamp: new Date().toISOString(),
      brand_id: maskId(brandId),
      is_connected: true,
      token_found: true,
      token_valid: expiresAt > now,
      token_expires_at: token.token_expires_at,
      token_expires_in: expiresInMs > 0 ? `${expiresInDays}d ${expiresInHours}h` : 'expired',
      connection_status: 'connected',
      profile_name: token.profile_name || 'not_available',
      linkedin_user_id: token.linkedin_user_id,
      has_refresh_token: !!token.refresh_token_encrypted,
      oauth_scopes: token.oauth_scopes,
    });
  } else {
    console.log('[LinkedIn Debug]', {
      event: 'connection_check',
      status: 'not_found',
      timestamp: new Date().toISOString(),
      brand_id: maskId(brandId),
      is_connected: false,
      token_found: false,
      message: 'No valid LinkedIn token found for this brand',
    });
  }

  return isConnected;
}

/**
 * Get LinkedIn profile information from stored token
 */
export async function getLinkedInProfileInfo(brandId: string): Promise<{
  profile_name: string;
  profile_picture_url: string | null;
  linkedin_profile_url: string | null;
} | null> {
  try {
    const token = await getValidLinkedInToken(brandId);

    if (!token) {
      return null;
    }

    return {
      profile_name: token.profile_name || 'Your Name',
      profile_picture_url: token.profile_picture_url || null,
      linkedin_profile_url: token.linkedin_profile_url || null,
    };
  } catch (error) {
    console.error('Error fetching LinkedIn profile info:', error);
    return null;
  }
}

