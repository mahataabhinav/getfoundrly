# Testing LinkedIn Post Publishing

## Pre-Testing Checklist

### 1. Verify Edge Function Deployment
- [ ] Go to Supabase Dashboard → Edge Functions
- [ ] Verify `linkedin-post` function exists and is deployed
- [ ] Check function logs for any errors (Edge Functions → linkedin-post → Logs)

### 2. Verify Environment Variables
- [ ] Check `.env` file has:
  - `VITE_SUPABASE_URL=your-project-url`
  - `VITE_SUPABASE_ANON_KEY=your-anon-key`
  - `VITE_LINKEDIN_CLIENT_ID=your-client-id`
  - `VITE_LINKEDIN_REDIRECT_URI=http://localhost:5173/auth/linkedin/callback` (or your production URL)

### 3. Verify LinkedIn App Configuration
- [ ] Go to https://www.linkedin.com/developers/apps
- [ ] Check your app has `w_member_social` scope enabled
- [ ] Verify redirect URI matches: `http://localhost:5173/auth/linkedin/callback` (or your production URL)

## Testing Steps

### Step 1: Login to Foundrly App
1. Open your app in browser (usually `http://localhost:5173`)
2. Login with credentials: `nihar.padhi83@gmail.com` / `Abhiannu@1996`
3. Verify you're logged in and can see the dashboard

### Step 2: Add Website Information
1. Navigate to the LinkedIn Post Generator
2. Enter website information:
   - **Brand Name**: (e.g., "Test Brand")
   - **Website URL**: (e.g., "https://example.com")
3. Click "Continue"
4. Wait for BrandDNA extraction to complete
5. Review the BrandDNA preview

### Step 3: Generate a Post
1. Select a post type (e.g., "Thought Leadership")
2. Enter a topic
3. Click "Generate Post"
4. Wait for post generation
5. Review the generated post

### Step 4: Connect to LinkedIn
1. Click "Publish" button
2. Click "Connect to LinkedIn" (if not already connected)
3. You'll be redirected to LinkedIn login
4. Login with: `nihar.padhi83@gmail.com` / `Abhiannu@1996`
5. Authorize the app
6. You should be redirected back to the app

### Step 5: Publish Post
1. After connecting, you should see the post preview
2. Review the post preview
3. Click "Publish Now" or "Confirm Publish"
4. Wait for publishing to complete
5. You should see a success message

## What to Check

### Browser Console (F12)
- [ ] No "Failed to fetch" errors
- [ ] Look for `[LinkedIn Post]` log messages
- [ ] Check for any Edge Function invocation logs
- [ ] Verify no CORS errors

### Supabase Edge Function Logs
1. Go to Supabase Dashboard → Edge Functions → linkedin-post
2. Click on "Logs" tab
3. Look for:
   - `[LinkedIn Post Edge Function] Function called`
   - `[LinkedIn Post Edge Function] Request body received`
   - `[LinkedIn Post Edge Function] Posting to LinkedIn API...`
   - `Post successful, ID: ...`

### Expected Success Flow
1. ✅ Edge Function is invoked successfully
2. ✅ Edge Function receives access token and content
3. ✅ Edge Function posts to LinkedIn API
4. ✅ LinkedIn API returns post ID
5. ✅ Success message displayed in app

## Common Issues & Solutions

### Issue: "Failed to fetch" error
**Solution:**
- Verify Edge Function is deployed
- Check Supabase URL and keys in `.env`
- Ensure you're logged in to the app
- Check browser console for detailed error

### Issue: "Edge Function not found"
**Solution:**
- Go to Supabase Dashboard → Edge Functions
- Verify `linkedin-post` exists
- If not, create and deploy it
- Function name must be exactly `linkedin-post` (lowercase, with hyphen)

### Issue: "LinkedIn authentication failed"
**Solution:**
- Disconnect and reconnect LinkedIn account
- Verify LinkedIn app has correct scopes
- Check LinkedIn Developer Portal for app status

### Issue: "Invalid person URN format"
**Solution:**
- Disconnect and reconnect LinkedIn account
- This refreshes the stored person URN
- The Edge Function will convert it to the correct format

## Debugging Tips

1. **Check Browser Console**: Look for detailed error messages with `[LinkedIn Post]` prefix
2. **Check Edge Function Logs**: Supabase Dashboard → Edge Functions → linkedin-post → Logs
3. **Verify Network Tab**: In browser DevTools → Network, look for requests to Supabase Edge Functions
4. **Test Edge Function Directly**: You can test the function from Supabase Dashboard → Edge Functions → linkedin-post → Invoke

## Success Indicators

✅ Post appears on your LinkedIn profile
✅ Success message shown in app
✅ No errors in browser console
✅ Edge Function logs show successful post
✅ Post ID returned from LinkedIn API

## Next Steps After Successful Test

1. Test with different post types
2. Test scheduling functionality
3. Test with different brands/websites
4. Verify posts appear correctly on LinkedIn

