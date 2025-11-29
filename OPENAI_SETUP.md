# OpenAI API Integration Setup

## Overview

This app uses OpenAI's GPT-4o API for AI-powered content generation and personalization across the dashboard and content creation features.

## Features Using AI

1. **LinkedIn Post Generation** - AI generates personalized LinkedIn posts based on brand, topic, and context
2. **Post Editor** - AI refines and edits posts based on user instructions
3. **Dashboard Personalization** - AI generates personalized welcome messages
4. **Newsletter Generation** - AI creates complete newsletter content
5. **Blog Post Generation** - AI generates SEO-optimized blog posts

## Setup Instructions

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key (you won't be able to see it again)

### 2. Configure Environment Variables

Add to your `.env` file:

```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

**Important Security Note:**
- The current implementation uses `dangerouslyAllowBrowser: true` which exposes the API key in the client bundle
- For production, you should:
  1. Create a backend API proxy to handle OpenAI requests
  2. Store the API key securely on the server
  3. Rate limit requests
  4. Add usage tracking

### 3. Backend Proxy (Recommended for Production)

Create a backend endpoint that proxies OpenAI requests:

**Example Node.js/Express:**
```javascript
app.post('/api/openai/chat', async (req, res) => {
  const { messages, options } = req.body;
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    ...options,
  });
  
  res.json(completion);
});
```

Then update `src/lib/openai.ts` to call your backend instead of directly calling OpenAI.

## Current Implementation

### Models Used
- **Primary Model**: `gpt-4o` (latest GPT-4 model)
- **Fallback Options**: Can be changed to `gpt-4-turbo` or `gpt-3.5-turbo` for cost savings

### Functions Available

1. **`generateLinkedInPost()`** - Generates LinkedIn posts
2. **`refinePostContent()`** - Refines existing posts based on instructions
3. **`generatePersonalizedWelcome()`** - Creates personalized dashboard messages
4. **`generateInsights()`** - Generates AI insights and recommendations
5. **`generateNewsletter()`** - Creates newsletter content
6. **`generateBlogPost()`** - Creates blog post content
7. **`chatCompletion()`** - General-purpose chat completion

## Usage Examples

### Generate LinkedIn Post
```typescript
import { generateLinkedInPost } from '../lib/openai';

const post = await generateLinkedInPost({
  brandName: 'Acme Inc',
  brandUrl: 'https://acme.com',
  postType: 'thought-leadership',
  topic: 'Why most startups fail at brand visibility',
  contextDetails: 'Target audience: founders, tone: professional',
  brandTone: 'Professional and approachable',
});
```

### Refine Post
```typescript
import { refinePostContent } from '../lib/openai';

const refined = await refinePostContent(
  originalPost,
  'Make it shorter and more bold',
  'Acme Inc'
);
```

## Cost Considerations

- **GPT-4o**: ~$0.005 per 1K input tokens, ~$0.015 per 1K output tokens
- **GPT-4 Turbo**: ~$0.01 per 1K input tokens, ~$0.03 per 1K output tokens
- **GPT-3.5 Turbo**: ~$0.0005 per 1K input tokens, ~$0.0015 per 1K output tokens

For cost optimization:
1. Use GPT-3.5 Turbo for simple tasks
2. Use GPT-4o for complex content generation
3. Implement caching for repeated requests
4. Add rate limiting

## Error Handling

All AI functions include error handling with fallbacks:
- If AI generation fails, components show user-friendly error messages
- Some functions have fallback content (e.g., basic welcome message)
- Errors are logged to console for debugging

## Testing

1. Set up your `.env` file with a valid API key
2. Test each AI function individually
3. Monitor API usage in OpenAI dashboard
4. Check error handling with invalid API key

## Security Best Practices

1. **Never commit API keys to git**
2. **Use environment variables** for all secrets
3. **Implement backend proxy** for production
4. **Add rate limiting** to prevent abuse
5. **Monitor usage** and set spending limits in OpenAI dashboard
6. **Validate user input** before sending to AI

## Troubleshooting

### "Failed to generate post"
- Check API key is correct in `.env`
- Verify API key has sufficient credits
- Check network connectivity
- Review OpenAI API status

### "Rate limit exceeded"
- Implement request throttling
- Add retry logic with exponential backoff
- Consider upgrading OpenAI plan

### High costs
- Switch to GPT-3.5 Turbo for non-critical features
- Implement caching
- Reduce max_tokens where possible
- Add usage limits per user

