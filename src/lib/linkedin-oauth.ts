/**
 * LinkedIn OAuth Integration
 * 
 * Functions for LinkedIn OAuth flow and token management
 */

import { supabase } from './supabase';
import {
  findOrCreateConnection,
  createLinkedInOAuthToken,
  getLinkedInOAuthTokenByConnection,
  updateLinkedInOAuthToken,
  getValidLinkedInToken,
  type Connection,
  type LinkedInOAuthToken,
} from './database';

// LinkedIn OAuth Configuration
// These should be stored in environment variables
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '';
const LINKEDIN_REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI || `${window.location.origin}/auth/linkedin/callback`;
const LINKEDIN_SCOPES = ['w_member_social', 'r_liteprofile', 'r_emailaddress'];

/**
 * Generate LinkedIn OAuth authorization URL
 */
export function getLinkedInAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    scope: LINKEDIN_SCOPES.join(' '),
    state: state || generateState(),
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

/**
 * Generate a random state for OAuth flow
 */
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  refresh_token_expires_in?: number;
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
      grant_type: 'authorization_code',
      code,
      redirect_uri: LINKEDIN_REDIRECT_URI,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

/**
 * Get LinkedIn user profile information
 */
async function getLinkedInProfile(accessToken: string): Promise<{
  id: string;
  firstName: { localized: { [key: string]: string } };
  lastName: { localized: { [key: string]: string } };
  profilePicture?: { displayImage: string };
}> {
  const response = await fetch('https://api.linkedin.com/v2/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LinkedIn profile');
  }

  return response.json();
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
 * Complete LinkedIn OAuth flow and store tokens
 */
export async function completeLinkedInOAuth(
  code: string,
  userId: string,
  brandId: string
): Promise<{ connection: Connection; token: LinkedInOAuthToken }> {
  // Exchange code for token
  const tokenData = await exchangeCodeForToken(code);

  // Get user profile
  const profile = await getLinkedInProfile(tokenData.access_token);

  // Create or update connection
  const connection = await findOrCreateConnection(userId, brandId, 'linkedin');

  // Calculate expiration dates
  const tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
  const refreshTokenExpiresAt = tokenData.refresh_token_expires_in
    ? new Date(Date.now() + tokenData.refresh_token_expires_in * 1000).toISOString()
    : null;

  // Check if token already exists
  const existingToken = await getLinkedInOAuthTokenByConnection(connection.id);

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
    linkedin_user_id: profile.id,
    linkedin_profile_url: `https://www.linkedin.com/in/${profile.id}`,
    profile_name: `${profile.firstName.localized.en_US || ''} ${profile.lastName.localized.en_US || ''}`.trim(),
    profile_picture_url: profile.profilePicture?.displayImage || null,
  };

  let token: LinkedInOAuthToken;

  if (existingToken) {
    // Update existing token
    token = await updateLinkedInOAuthToken(existingToken.id, tokenDataToStore);
  } else {
    // Create new token
    token = await createLinkedInOAuthToken(tokenDataToStore);
  }

  return { connection, token };
}

/**
 * Get valid access token (with automatic refresh if needed)
 */
export async function getValidAccessToken(brandId: string): Promise<string | null> {
  const token = await getValidLinkedInToken(brandId);

  if (!token) return null;

  // Check if token is expired or expiring soon (within 5 minutes)
  const expiresAt = new Date(token.token_expires_at);
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

  if (expiresAt > fiveMinutesFromNow) {
    // Token is still valid
    return decryptToken(token.access_token_encrypted);
  }

  // Token is expired or expiring soon, try to refresh
  if (!token.refresh_token_encrypted) {
    console.error('No refresh token available');
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

    return newTokenData.access_token;
  } catch (error) {
    console.error('Failed to refresh LinkedIn token:', error);
    return null;
  }
}

/**
 * Get LinkedIn user URN (person ID)
 */
async function getLinkedInPersonUrn(accessToken: string): Promise<string> {
  const response = await fetch('https://api.linkedin.com/v2/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LinkedIn profile');
  }

  const data = await response.json();
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
  } = {}
): Promise<{ id: string }> {
  // Get person URN
  const personUrn = await getLinkedInPersonUrn(accessToken);

  const body: any = {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
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

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to post to LinkedIn: ${error}`);
  }

  const data = await response.json();
  return { id: data.id };
}

/**
 * Check if user has LinkedIn connection
 */
export async function hasLinkedInConnection(brandId: string): Promise<boolean> {
  const token = await getValidLinkedInToken(brandId);
  return token !== null;
}

