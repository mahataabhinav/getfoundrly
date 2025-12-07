# Debugging LinkedIn User ID Error

## Current Error
```
"Unable to get LinkedIn user ID. Please reconnect your LinkedIn account and ensure you grant all required permissions (including 'r_liteprofile' scope). Error: Unknown error"
```

## Steps to Debug

### 1. Check Edge Function Logs
1. Go to Supabase Dashboard → Edge Functions → `linkedin-post`
2. Click on "Logs" tab
3. Look for recent errors with these prefixes:
   - `[LinkedIn Post Edge Function] /v2/me response status:`
   - `[LinkedIn Post Edge Function] UserInfo response status:`
   - `[LinkedIn Post Edge Function] UserInfo error response:`
4. Copy the full error details from the logs

### 2. Verify Edge Function is Deployed with Latest Code
1. Go to Supabase Dashboard → Edge Functions → `linkedin-post`
2. Check the code - it should have:
   - Updated error messages (no mention of 'r_liteprofile' in new errors)
   - Logging for `/v2/me` and `/v2/userinfo` endpoints
3. If the code looks old, redeploy:
   - Copy code from `supabase/functions/linkedin-post/index.ts`
   - Paste into Supabase Dashboard
   - Click "Deploy"

### 3. Verify LinkedIn App Scopes
1. Go to https://www.linkedin.com/developers/apps
2. Select your app
3. Go to "Auth" tab
4. Check "Products" section - ensure these are enabled:
   - ✅ Sign In with LinkedIn using OpenID Connect
   - ✅ Share on LinkedIn
5. Check "OAuth 2.0 scopes" - should include:
   - `openid`
   - `profile`
   - `w_member_social`

### 4. Test OAuth Flow
1. Disconnect LinkedIn account in the app
2. Reconnect
3. When LinkedIn asks for permissions, make sure you see:
   - "Sign in with LinkedIn"
   - "Share on LinkedIn"
4. Grant ALL permissions
5. Try posting again

### 5. Check What Scopes Were Actually Granted
The Edge Function logs should show what the `/v2/userinfo` endpoint returns. Look for:
- `[LinkedIn Post Edge Function] Full userinfo response:`
- This will show what data LinkedIn is actually returning

## Common Issues

### Issue: `/v2/userinfo` returns 401 Unauthorized
**Cause**: Access token doesn't have OpenID Connect scopes
**Fix**: 
- Ensure `openid` and `profile` scopes are in your OAuth request
- Disconnect and reconnect to get new token with correct scopes

### Issue: `/v2/userinfo` returns `user_xxxxx` format
**Cause**: LinkedIn app doesn't have proper OpenID Connect configuration
**Fix**:
- Enable "Sign In with LinkedIn using OpenID Connect" product in LinkedIn Developer Portal
- Ensure scopes are enabled in app settings

### Issue: Both endpoints fail
**Cause**: Access token might be invalid or expired
**Fix**:
- Disconnect and reconnect LinkedIn account
- Check token expiration in database

## Next Steps

After checking the logs, share:
1. The actual error response from `/v2/userinfo` endpoint (from Edge Function logs)
2. The HTTP status code returned
3. Whether the Edge Function code has been redeployed with latest changes

This will help identify the exact issue.

