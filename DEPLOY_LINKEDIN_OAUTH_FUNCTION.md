# Deploy LinkedIn OAuth Edge Function

This Edge Function handles LinkedIn OAuth token exchange server-side to avoid CORS issues and keep the client secret secure.

## Why Use Edge Function?

- **Security**: Client secret is never exposed in the browser
- **CORS**: Avoids CORS issues with LinkedIn's API
- **Reliability**: More reliable than client-side token exchange

## Deployment Steps

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Set environment variables**:
   ```bash
   supabase secrets set LINKEDIN_CLIENT_ID=your_client_id
   supabase secrets set LINKEDIN_CLIENT_SECRET=your_client_secret
   ```

5. **Deploy the function**:
   ```bash
   supabase functions deploy linkedin-oauth
   ```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it `linkedin-oauth`
5. Copy the contents of `supabase/functions/linkedin-oauth/index.ts`
6. Set environment variables:
   - `LINKEDIN_CLIENT_ID`: Your LinkedIn Client ID
   - `LINKEDIN_CLIENT_SECRET`: Your LinkedIn Client Secret
7. Deploy the function

## Environment Variables

Set these in your Supabase project:

- `LINKEDIN_CLIENT_ID`: Your LinkedIn OAuth Client ID
- `LINKEDIN_CLIENT_SECRET`: Your LinkedIn OAuth Client Secret

## Testing

After deployment, the OAuth flow will automatically use the Edge Function. If the Edge Function is not available, it will fall back to client-side token exchange (requires `VITE_LINKEDIN_CLIENT_SECRET` in your `.env` file).

## Troubleshooting

- **Function not found**: Make sure the function is deployed and named exactly `linkedin-oauth`
- **401 Unauthorized**: Check that environment variables are set correctly in Supabase
- **CORS errors**: The Edge Function should handle CORS automatically

## Fallback

If the Edge Function is not deployed, the app will fall back to client-side token exchange. However, this requires:
- `VITE_LINKEDIN_CLIENT_SECRET` in your `.env` file
- May still encounter CORS issues

For production, **always use the Edge Function** for better security and reliability.

