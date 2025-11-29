# Quick Test Guide: AI-Powered LinkedIn Post Generation

## 🚀 Quick Start (5 minutes)

### Step 1: Add OpenAI API Key

Create or edit `.env` file in the root directory:

```bash
# Copy this template
cat > .env << 'EOF'
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
VITE_SUPABASE_URL=https://xacfeuxdtmpcumljcvzw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2ZldXhkdG1wY3VtbGpjdnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODQxOTUsImV4cCI6MjA3NzY2MDE5NX0.T3y-dGyETvstmL5lbSq1JLP8F6h5PwjGMCwVgQaFbn8
EOF
```

**Get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)
4. Replace `sk-your-actual-api-key-here` in `.env`

### Step 2: Start the App

```bash
npm run dev
```

### Step 3: Test the Flow

1. **Login** to your dashboard
2. Click **"Create"** tab
3. Click **"LinkedIn Posts"** card
4. Follow the wizard:
   - **Step 1**: Enter brand name and URL → Click "Continue"
   - **Step 2**: Select a post type (e.g., "Thought Leadership")
   - **Step 3**: Enter topic → Click "Generate Post"
   - **Step 4**: Review AI-generated post!

## ✅ What to Look For

### Successful Test:
- ✅ "Generating..." shows when clicking "Generate Post"
- ✅ Post appears in 2-5 seconds
- ✅ Post is personalized with your brand name
- ✅ Post matches the selected post type style
- ✅ Post includes relevant hashtags
- ✅ Post has a call-to-action or question

### Expected Output Example:
```
🚀 Why Most Startups Fail at Brand Visibility

After working with 100+ startups, I've noticed a pattern...

[Personalized content based on your brand]

What's your biggest visibility challenge? Drop it below 👇

#StartupLife #BrandVisibility #Marketing
```

## 🐛 Troubleshooting

### "Failed to generate post"
- **Check**: Is `VITE_OPENAI_API_KEY` in `.env`?
- **Check**: Is the API key valid? (starts with `sk-`)
- **Check**: Does your OpenAI account have credits?
- **Solution**: Restart dev server after adding `.env`

### "OpenAI API key is not configured"
- **Check**: `.env` file exists in root directory
- **Check**: Variable name is exactly `VITE_OPENAI_API_KEY`
- **Solution**: Restart dev server: `npm run dev`

### Post not personalized
- **Check**: Did you complete Step 1 (brand name/URL)?
- **Check**: Browser console for errors
- **Check**: Network tab for OpenAI API calls

### "Invalid API key" error
- **Check**: API key copied correctly (no extra spaces)
- **Check**: API key hasn't expired
- **Solution**: Generate a new key from OpenAI dashboard

## 📊 Verify It's Working

### Check Browser Console:
- ✅ No errors
- ✅ "Generating AI post..." log (if added)
- ✅ OpenAI API call in Network tab

### Check Database:
After generating, verify in Supabase:
- `content_items` table has new record
- `ai_model` field = `'gpt-4o'`
- `body` field contains the generated post

## 🎯 Test Checklist

- [ ] `.env` file created with API key
- [ ] Dev server started successfully
- [ ] Can login to dashboard
- [ ] LinkedIn Post Generator opens
- [ ] Step 1: Brand saves successfully
- [ ] Step 2: Post type selection works
- [ ] Step 3: AI generation works (2-5 seconds)
- [ ] Generated post is personalized
- [ ] Post saves to database
- [ ] "Regenerate" button works
- [ ] Post Editor AI refinement works

## 💡 Pro Tips

1. **First test**: Use a simple topic like "Why AI is important"
2. **Check costs**: Monitor OpenAI usage dashboard
3. **Test different types**: Try different post types to see variety
4. **Test refinement**: Use Post Editor to refine generated posts

## 🆘 Still Having Issues?

1. **Check console errors**: Open browser DevTools (F12)
2. **Check network tab**: Look for failed API calls
3. **Verify API key**: Test in OpenAI Playground
4. **Check Supabase**: Ensure database migration is applied

## Next: Test Post Editor AI

After generating a post:
1. Click "Edit in Editor"
2. Try commands:
   - "Make it shorter"
   - "More professional tone"
   - "Add a strong CTA"
3. ✅ Post should refine using AI

---

**Ready to test?** Start with Step 1 above! 🚀

