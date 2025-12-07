# Step-by-Step: Deploy LinkedIn Edge Functions

This guide will help you deploy the LinkedIn Edge Functions to fix CORS and "Failed to fetch" errors.

**You need to deploy TWO functions:**
1. `linkedin-oauth` - For OAuth token exchange
2. `linkedin-post` - For posting content to LinkedIn (fixes CORS issues)

## Prerequisites

- Your LinkedIn Client ID (from LinkedIn Developer Portal)
- Your LinkedIn Client Secret (from LinkedIn Developer Portal)
- Access to your Supabase project

## Option 1: Using Supabase Dashboard (Easiest)

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project

### Step 2: Navigate to Edge Functions

1. In the left sidebar, click **"Edge Functions"**
2. You should see a list of functions (or an empty list if none are deployed)

### Step 3: Create the Function

1. Click **"Create a new function"** button
2. Name it: `linkedin-oauth` (must be exactly this name)
3. Click **"Create function"**

### Step 4: Add the Code

1. In the code editor, delete any default code
2. Open the file: `supabase/functions/linkedin-oauth/index.ts` in your project
3. Copy **ALL** the code from that file
4. Paste it into the Supabase code editor

### Step 5: Set Environment Variables (Secrets)

**This is the most important step!**

1. In the Edge Function editor, look for **"Secrets"** or **"Environment Variables"** section
2. Click **"Add secret"** or **"Manage secrets"**
3. Add these two secrets:

   **Secret 1:**
   - Name: `LINKEDIN_CLIENT_ID`
   - Value: Your LinkedIn Client ID (from LinkedIn Developer Portal)
   - Click **"Save"**

   **Secret 2:**
   - Name: `LINKEDIN_CLIENT_SECRET`
   - Value: Your LinkedIn Client Secret (from LinkedIn Developer Portal)
   - Click **"Save"**

### Step 6: Deploy

1. Click **"Deploy"** button (usually at the top right)
2. Wait for deployment to complete (should take 10-30 seconds)
3. You should see a success message

### Step 7: Deploy the LinkedIn Post Function (Required for Publishing)

**This function is required to fix CORS errors when publishing posts!**

1. In Edge Functions, click **"Create a new function"** again
2. Name it: `linkedin-post` (must be exactly this name)
3. Click **"Create function"**
4. Open the file: `supabase/functions/linkedin-post/index.ts` in your project
5. Copy **ALL** the code from that file
6. Paste it into the Supabase code editor
7. Click **"Deploy"** button
8. Wait for deployment to complete

**Note:** This function does NOT need any secrets - it uses the access token passed from your app.

### Step 8: Test

1. Go back to your app
2. Try connecting to LinkedIn (uses `linkedin-oauth` function)
3. Try publishing a post (uses `linkedin-post` function)
4. Both "Failed to fetch" errors should be resolved!

---

## Option 2: Using Supabase CLI

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window for you to authenticate.

### Step 3: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

To find your project ref:
1. Go to Supabase Dashboard
2. Click on your project
3. Go to Settings → General
4. Copy the "Reference ID"

### Step 4: Set Secrets

```bash
supabase secrets set LINKEDIN_CLIENT_ID=your_client_id_here
supabase secrets set LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

Replace `your_client_id_here` and `your_client_secret_here` with your actual values.

### Step 5: Deploy Both Functions

```bash
# Deploy OAuth function
supabase functions deploy linkedin-oauth

# Deploy Post function (required for publishing)
supabase functions deploy linkedin-post
```

### Step 6: Verify Deployment

```bash
supabase functions list
```

You should see both `linkedin-oauth` and `linkedin-post` in the list.

---

## How to Get LinkedIn Client ID and Secret

1. Go to https://www.linkedin.com/developers/apps
2. Select your app (or create a new one)
3. Go to **"Auth"** tab
4. Copy:
   - **Client ID**: Found at the top of the Auth tab
   - **Client Secret**: Click "Show" next to Client Secret and copy it

---

## Troubleshooting

### Error: "Function not found"
- Make sure the function name is exactly `linkedin-oauth` (lowercase, with hyphen)
- Check that deployment completed successfully

### Error: "LinkedIn OAuth credentials not configured"
- Make sure you set both `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` as secrets
- Secrets are case-sensitive - use exact names shown above
- After setting secrets, redeploy the function

### Error: "Failed to fetch" still appears
- Check browser console for detailed error
- Verify the function is deployed: Go to Supabase Dashboard → Edge Functions → Check if `linkedin-oauth` is listed
- Try redeploying the function

### How to Check if Function is Deployed

1. Go to Supabase Dashboard
2. Navigate to **Edge Functions**
3. Look for `linkedin-oauth` in the list
4. If it's there, click on it to see details
5. Check the "Logs" tab to see if there are any errors

---

## After Deployment

Once deployed, the app will automatically use the Edge Function. You don't need to change any code in your app - it will detect and use the Edge Function automatically.

The Edge Function:
- ✅ Avoids CORS issues
- ✅ Keeps your client secret secure (not exposed in browser)
- ✅ More reliable than client-side token exchange

---

## Still Having Issues?

1. **Check Function Logs**: In Supabase Dashboard → Edge Functions → linkedin-oauth → Logs
2. **Check Browser Console**: Look for detailed error messages
3. **Verify Secrets**: Make sure both secrets are set correctly
4. **Test Function**: Try invoking the function manually from Supabase Dashboard

