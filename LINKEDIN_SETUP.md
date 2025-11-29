# LinkedIn Post Generator Setup Guide

## Overview

This guide will help you set up the LinkedIn post generator with database integration and OAuth authentication.

## Prerequisites

1. Supabase project with the migration applied
2. LinkedIn Developer App
3. Environment variables configured

## Step 1: Run Database Migration

Apply the database migration to create all necessary tables:

```bash
# If using Supabase CLI
supabase db push

# Or apply manually via Supabase Dashboard
# Go to SQL Editor and run: supabase/migrations/20251120093348_enhance_linkedin_post_schema.sql
```

## Step 2: Create Supabase Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `media-assets`
3. Set bucket to **Public** (or configure RLS policies)
4. Add policy for authenticated users to upload/read their own files

Example policy:
```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
```

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# LinkedIn OAuth Configuration
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id
VITE_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
VITE_LINKEDIN_REDIRECT_URI=http://localhost:5173/auth/linkedin/callback
```

### Getting LinkedIn OAuth Credentials

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create a new app or use existing
3. In "Auth" tab, add redirect URL: `http://localhost:5173/auth/linkedin/callback` (for development)
4. Request the following scopes:
   - `w_member_social` - Post on behalf of user
   - `r_liteprofile` - Read basic profile
   - `r_emailaddress` - Read email address
5. Copy Client ID and Client Secret to your `.env` file

## Step 4: Create OAuth Callback Route

Create a callback page to handle LinkedIn OAuth redirect:

**File: `src/pages/AuthCallback.tsx`**
```tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { completeLinkedInOAuth } from '../lib/linkedin-oauth';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/dashboard?error=oauth_failed');
        return;
      }

      if (code) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            navigate('/login');
            return;
          }

          // Get brandId from sessionStorage or state
          const brandId = sessionStorage.getItem('linkedin_brand_id');
          if (!brandId) {
            navigate('/dashboard?error=no_brand');
            return;
          }

          await completeLinkedInOAuth(code, user.id, brandId);
          navigate('/dashboard?linkedin_connected=true');
        } catch (error) {
          console.error('Error completing OAuth:', error);
          navigate('/dashboard?error=oauth_failed');
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Connecting LinkedIn...</p>
      </div>
    </div>
  );
}
```

Add route in your router:
```tsx
<Route path="/auth/linkedin/callback" element={<AuthCallback />} />
```

## Step 5: Update PublishModal OAuth Flow

The PublishModal component has been updated to handle OAuth. Make sure to:

1. Store `brandId` in sessionStorage before redirecting to LinkedIn:
```tsx
sessionStorage.setItem('linkedin_brand_id', brandId);
window.location.href = getLinkedInAuthUrl();
```

2. Update the OAuth callback handler in PublishModal to read from sessionStorage

## Step 6: Test the Integration

1. Start your dev server: `npm run dev`
2. Navigate to LinkedIn Post Generator
3. Enter website details (Step 1)
4. Select post type (Step 2)
5. Enter topic and generate post (Step 3)
6. Click "Publish" (Step 4)
7. Connect LinkedIn account
8. Publish or schedule the post

## Troubleshooting

### LinkedIn OAuth Issues

- **"Invalid redirect URI"**: Make sure the redirect URI in LinkedIn app matches exactly (including http/https, port, path)
- **"Invalid client"**: Check that Client ID and Secret are correct in `.env`
- **"Insufficient permissions"**: Ensure all required scopes are approved in LinkedIn app

### Database Issues

- **"Table does not exist"**: Make sure migration was applied successfully
- **"Permission denied"**: Check RLS policies are set up correctly
- **"Foreign key violation"**: Ensure related records (brands, users) exist

### Storage Issues

- **"Bucket not found"**: Create the `media-assets` bucket in Supabase Dashboard
- **"Upload failed"**: Check bucket policies allow authenticated uploads
- **"Access denied"**: Verify RLS policies for storage bucket

## Next Steps

1. **Background Job for Scheduled Posts**: Set up a cron job or scheduled function to check `content_schedules` and publish posts at scheduled times
2. **Token Refresh Service**: Implement automatic token refresh before expiration
3. **Error Handling**: Add retry logic and better error messages
4. **Analytics**: Track post performance and update `content_metrics` table

## API Reference

See the following files for function documentation:
- `src/lib/database.ts` - Database CRUD operations
- `src/lib/storage.ts` - File upload/storage operations
- `src/lib/linkedin-oauth.ts` - LinkedIn OAuth and posting
- `src/types/database.ts` - TypeScript type definitions


