# Testing AI-Powered LinkedIn Post Generation

## Prerequisites

1. **OpenAI API Key**: You need a valid OpenAI API key
2. **Environment Variable**: Add `VITE_OPENAI_API_KEY` to your `.env` file
3. **Supabase Setup**: Database migration should be applied
4. **User Authentication**: You need to be logged in

## Quick Test Steps

### Step 1: Set Up Environment

Create or update `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
VITE_SUPABASE_URL=https://xacfeuxdtmpcumljcvzw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhY2ZldXhkdG1wY3VtbGpjdnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODQxOTUsImV4cCI6MjA3NzY2MDE5NX0.T3y-dGyETvstmL5lbSq1JLP8F6h5PwjGMCwVgQaFbn8
```

### Step 2: Start the Development Server

```bash
npm run dev
```

### Step 3: Test the Flow

1. **Login to Dashboard**
   - Navigate to the app
   - Login with your account

2. **Open LinkedIn Post Generator**
   - Click on "Create" tab in dashboard
   - Click "LinkedIn Posts" card
   - This opens the LinkedInPostGenerator modal

3. **Step 1: Enter Website Details**
   - Enter a brand name (e.g., "Acme Inc")
   - Enter a website URL (e.g., "https://acme.com")
   - Click "Continue"
   - ✅ Should save brand to database
   - ✅ Should show loading state ("Saving...")

4. **Step 2: Select Post Type**
   - Choose a post type (e.g., "Thought Leadership")
   - ✅ Should automatically proceed to Step 3

5. **Step 3: Enter Topic**
   - Enter a topic (e.g., "Why most startups fail at brand visibility")
   - Optionally add context details
   - Click "Generate Post"
   - ✅ Should show "Generating..." state
   - ✅ Should call OpenAI API
   - ✅ Should display AI-generated post
   - ✅ Should save to database with `ai_model: 'gpt-4o'`

6. **Step 4: Review Generated Post**
   - ✅ Post should be personalized based on:
     - Brand name
     - Post type
     - Topic
     - Context details
   - Try "Regenerate" button
   - ✅ Should generate a different version
   - Try "Edit in Editor"
   - ✅ Should open PostEditor with AI refinement

7. **Test Post Editor AI**
   - In PostEditor, try commands like:
     - "Make it shorter"
     - "More professional tone"
     - "Add a strong CTA"
   - ✅ Should use AI to refine the post
   - ✅ Should update the preview in real-time

## Expected Behavior

### Successful AI Generation
- Post should be 200-300 words
- Should include relevant hashtags
- Should match the selected post type style
- Should incorporate brand name naturally
- Should include a call-to-action or question

### Error Handling
- If API key is missing: Console error, fallback post shown
- If API fails: Fallback post shown, user sees error message
- If network fails: Error message displayed

## Debugging

### Check Browser Console
Look for:
- ✅ "Generating AI post..." (success)
- ❌ "Error generating AI post:" (failure)
- ❌ "Failed to generate post" (API error)

### Check Network Tab
- Look for OpenAI API calls to `https://api.openai.com/v1/chat/completions`
- Check response status (200 = success)
- Check request payload includes your prompt

### Common Issues

1. **"Failed to generate post"**
   - Check API key is correct
   - Verify API key has credits
   - Check OpenAI API status

2. **"Brand not found"**
   - Ensure Step 1 completed successfully
   - Check database for brand record

3. **Post not personalized**
   - Verify all fields are filled (brand, type, topic)
   - Check OpenAI response in network tab
   - Verify API key has access to GPT-4o

## Manual API Test

You can test the OpenAI function directly in browser console:

```javascript
// In browser console after logging in
import { generateLinkedInPost } from './src/lib/openai';

const testPost = await generateLinkedInPost({
  brandName: 'Test Brand',
  brandUrl: 'https://test.com',
  postType: 'thought-leadership',
  topic: 'Why AI is transforming content creation',
  contextDetails: 'Target audience: founders and marketers',
});

console.log(testPost);
```

## Verification Checklist

- [ ] Environment variable set correctly
- [ ] Dev server running without errors
- [ ] Can login to dashboard
- [ ] LinkedIn Post Generator opens
- [ ] Brand saves to database (Step 1)
- [ ] Post type selection works (Step 2)
- [ ] AI generation works (Step 3)
- [ ] Generated post is personalized
- [ ] Post saves to database with AI metadata
- [ ] Regenerate works
- [ ] Post Editor AI refinement works
- [ ] Error handling works (test with invalid API key)

## Performance Expectations

- **AI Generation**: 2-5 seconds (depending on API response time)
- **Post Refinement**: 1-3 seconds
- **Database Save**: < 1 second

## Next Steps After Testing

1. If everything works: You're ready to use AI-powered generation!
2. If errors occur: Check the troubleshooting section above
3. For production: Set up backend proxy (see OPENAI_SETUP.md)

