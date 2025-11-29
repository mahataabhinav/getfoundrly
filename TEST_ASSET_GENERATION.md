# Asset Generation Testing Summary

## Test Scenario
**Input:**
- Website Name: Apple
- Website URL: www.apple.com
- Topic: iPhone 17 Pro launch

## Code Verification ✅

### 1. Image Generation Module (`src/lib/asset-generator.ts`)
- ✅ Uses DALL-E 3 API (`dall-e-3` model)
- ✅ Generates 3 image variations (primary, alternate1, alternate2)
- ✅ Brand profile integration for personalized prompts
- ✅ Proper error handling and fallbacks
- ✅ Image saving to Supabase Storage

### 2. Video Script Generation
- ✅ Uses `gpt-4o-mini` for cost efficiency
- ✅ Generates complete script, scenes, and storyboard
- ✅ Creates placeholder thumbnail (SVG-based)
- ✅ Stores in content metadata

### 3. UI Integration (`src/components/dashboard/LinkedInPostGenerator.tsx`)
- ✅ Images/Videos tabs implemented
- ✅ Auto-selection based on post type
- ✅ Preview modals for both images and videos
- ✅ Attach functionality integrated
- ✅ Loading states and error handling

## Expected Flow

1. **User enters brand info:**
   - Website Name: "Apple"
   - Website URL: "www.apple.com"
   - System extracts brand profile (colors, tone, style, etc.)

2. **User selects post type:**
   - Chooses "Announcement" (recommended for product launches)

3. **User provides topic:**
   - Topic: "iPhone 17 Pro launch"
   - System generates LinkedIn post with brand profile

4. **Asset Generation:**
   - **Images Tab:**
     - Click "Generate Images"
     - System generates 3 DALL-E images based on:
       - Apple brand colors (white, silver, space gray)
       - Minimalist design aesthetic
       - iPhone product imagery
       - Professional announcement style
     - Images displayed in grid
     - User clicks image → Preview modal → Attach to post
   
   - **Videos Tab:**
     - Click "Generate Video Script"
     - System generates:
       - Video script for iPhone 17 Pro launch
       - Scene breakdown (3-5 scenes)
       - Storyboard frames
       - Placeholder thumbnail
     - User clicks video → Preview modal with script/storyboard → Attach to post

## Authentication Requirement

⚠️ **Note:** The flow requires Supabase authentication. To test:
1. Create account or login
2. Navigate to Dashboard → Create section
3. Click "LinkedIn Posts" → "Generate"

## Potential Issues to Watch For

1. **CORS Issues:**
   - Website fetching uses proxy (`api.allorigins.win`)
   - May need backend proxy in production

2. **OpenAI API Limits:**
   - DALL-E 3 has rate limits
   - Image generation takes time (10-30 seconds per image)

3. **Storage:**
   - Requires Supabase Storage bucket configured
   - Media assets need proper permissions

4. **Brand Extraction:**
   - Large websites may timeout
   - Some sites block scraping

## Code Status

✅ All components properly integrated
✅ TypeScript types defined
✅ Error handling in place
✅ UI components ready
✅ Database schema supports assets

## Next Steps for Full Testing

1. Set up Supabase authentication
2. Configure OpenAI API keys
3. Test brand extraction with apple.com
4. Generate post with iPhone 17 Pro topic
5. Generate images and verify display
6. Generate video script and verify preview
7. Test attach functionality
8. Verify assets saved to database

## Test Commands

```bash
# Start dev server
npm run dev

# Check for linting errors
npm run lint

# Verify environment variables
echo $VITE_OPENAI_API_KEY
echo $VITE_SUPABASE_URL
```

