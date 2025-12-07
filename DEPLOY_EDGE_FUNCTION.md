# Deploy Supabase Edge Function for Website Fetching

## Overview

The `fetch-website` Edge Function allows server-side website fetching to avoid CORS issues when extracting BrandDNA.

## Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Logged in to Supabase: `supabase login`
3. Linked to your project: `supabase link --project-ref your-project-ref`

## Deployment Steps

### 1. Link to Your Supabase Project

```bash
supabase link --project-ref your-project-ref
```

You can find your project ref in your Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

### 2. Deploy the Edge Function

```bash
supabase functions deploy fetch-website
```

### 3. Set Environment Variables (if needed)

The function uses these environment variables (usually set automatically):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin access)

To set them manually:
```bash
supabase secrets set SUPABASE_URL=your-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: The service role key should be kept secret and only used server-side.

### 4. Test the Function

You can test it locally first:
```bash
supabase functions serve fetch-website
```

Then test with:
```bash
curl -X POST http://localhost:54321/functions/v1/fetch-website \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Alternative: Manual Deployment via Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it `fetch-website`
5. Copy the contents of `supabase/functions/fetch-website/index.ts`
6. Click **Deploy**

## Verification

After deployment, the BrandDNA feature should automatically use the Edge Function instead of the CORS proxy. You can verify by:

1. Creating a new BrandDNA profile
2. Checking the browser console - you should see successful requests to the Edge Function
3. The website content should be fetched successfully without CORS errors

## Troubleshooting

- **401 Unauthorized**: Make sure the user is logged in and the session token is valid
- **Function not found**: Ensure the function is deployed and the name matches exactly
- **Timeout errors**: Some websites may take longer to fetch - the function has a 30-second timeout

