# Firecrawl API Integration Setup

## Overview

This app uses Firecrawl API for comprehensive website scraping and crawling, including images and videos, to extract high-quality BrandDNA data for personalized LinkedIn content generation.

## Features Using Firecrawl

1. **BrandDNA Extraction** - Comprehensive website scraping and crawling to extract brand information
2. **Visual Identity Analysis** - Extract images, logos, and visual elements from websites
3. **Multi-Page Crawling** - Crawl related pages (about, products, blog) for comprehensive brand data
4. **Enhanced Content Analysis** - Use clean markdown content for better AI analysis

## Setup Instructions

### 1. Get Firecrawl API Key

1. Go to [Firecrawl](https://www.firecrawl.dev/)
2. Sign up or log in
3. Navigate to [API Keys](https://www.firecrawl.dev/app/api-keys)
4. Create a new API key
5. Copy the key (starts with `fc-`)

### 2. Configure Environment Variables

Add to your `.env` file:

```env
VITE_FIRECRAWL_API_KEY=fc-your-api-key-here
```

**Important Security Note:**
- The current implementation exposes the API key in the client bundle
- For production, you should:
  1. Create a backend API proxy to handle Firecrawl requests
  2. Store the API key securely on the server
  3. Rate limit requests
  4. Add usage tracking

### 3. Backend Proxy (Recommended for Production)

Create a backend endpoint that proxies Firecrawl requests:

**Example Node.js/Express:**
```javascript
app.post('/api/firecrawl/scrape', async (req, res) => {
  const { url, options } = req.body;
  
  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const result = await firecrawl.scrapeUrl(url, options);
  
  res.json(result);
});
```

Then update `src/lib/firecrawl.ts` to call your backend instead of directly calling Firecrawl.

## Current Implementation

### Functions Available

1. **`scrapeWebsite()`** - Scrape a single website URL
2. **`crawlWebsite()`** - Crawl multiple pages from a website
3. **`extractWebsiteData()`** - Comprehensive extraction combining scrape and crawl
4. **`isFirecrawlAvailable()`** - Check if Firecrawl is configured

### Integration Points

- **Brand Extractor** (`src/lib/brand-extractor.ts`):
  - Uses Firecrawl to fetch website content
  - Extracts images and videos for visual identity analysis
  - Falls back to standard method if Firecrawl is unavailable

- **BrandDNA Creation** (`src/lib/brand-dna.ts`):
  - Automatically uses Firecrawl when creating BrandDNA
  - Stores extracted images and videos in BrandDNA data

- **UI Components**:
  - `LinkedInPostGenerator` - Shows Firecrawl loading states
  - `BrandDNAWizard` - Shows Firecrawl extraction progress

## Usage Examples

### Scrape Single Website
```typescript
import { scrapeWebsite } from '../lib/firecrawl';

const result = await scrapeWebsite('https://example.com', {
  onlyMainContent: true,
  includeTags: ['article', 'main'],
});

if (result.success) {
  console.log('Markdown:', result.markdown);
  console.log('Images:', result.images);
  console.log('Videos:', result.videos);
}
```

### Crawl Website
```typescript
import { crawlWebsite } from '../lib/firecrawl';

const result = await crawlWebsite('https://example.com', {
  maxPages: 10,
  maxDepth: 2,
  includePaths: ['/about', '/products'],
  excludePaths: ['/privacy', '/terms'],
});

if (result.success) {
  console.log('Pages crawled:', result.pages?.length);
}
```

### Extract Comprehensive Data
```typescript
import { extractWebsiteData } from '../lib/firecrawl';

const result = await extractWebsiteData('https://example.com', {
  useCrawl: true,
  maxPages: 10,
  maxDepth: 2,
});

if (result.success) {
  console.log('Content:', result.content);
  console.log('Images:', result.images);
  console.log('Videos:', result.videos);
}
```

## Cost Considerations

- **Firecrawl Pricing**: Check [Firecrawl Pricing](https://www.firecrawl.dev/pricing) for current rates
- **Optimization Tips**:
  1. Use `scrapeWebsite()` for single pages (cheaper)
  2. Use `crawlWebsite()` only when comprehensive data is needed
  3. Limit `maxPages` and `maxDepth` to control costs
  4. Cache results to avoid repeated API calls

## Error Handling

All Firecrawl functions include error handling with fallbacks:
- If Firecrawl fails, the system falls back to standard website fetching
- Errors are logged to console for debugging
- User-friendly error messages are shown in the UI

## Testing

1. Set up your `.env` file with a valid API key
2. Test scraping a simple website
3. Test crawling with a multi-page site
4. Verify fallback behavior when API key is missing
5. Check error handling with invalid URLs

## Security Best Practices

1. **Never commit API keys to git**
2. **Use environment variables** for all secrets
3. **Implement backend proxy** for production
4. **Add rate limiting** to prevent abuse
5. **Monitor usage** and set spending limits in Firecrawl dashboard
6. **Validate URLs** before sending to Firecrawl

## Troubleshooting

### "Firecrawl API key is not configured"
- Check API key is correct in `.env`
- Verify the key starts with `fc-`
- Restart the development server after adding the key

### "Failed to scrape website"
- Verify the URL is accessible
- Check if the website blocks scrapers
- Review Firecrawl API status
- Check API key has sufficient credits

### High costs
- Reduce `maxPages` and `maxDepth` in crawl options
- Use `scrapeWebsite()` instead of `crawlWebsite()` when possible
- Implement caching for repeated requests
- Add usage limits per user

### Fallback to standard method
- This is expected behavior if Firecrawl is unavailable
- Check console logs for specific error messages
- Verify API key is valid and has credits

## Integration with BrandDNA

When Firecrawl is used for BrandDNA extraction:

1. **Higher Quality Data**: More comprehensive extraction with images and videos
2. **Better Visual Identity**: Extracted images help identify logos, colors, and visual style
3. **Multi-Page Analysis**: Crawling multiple pages provides complete brand picture
4. **Higher Confidence Scores**: Firecrawl-extracted data has 85% confidence vs 70% for standard extraction

The extracted data is automatically stored in the `brand_dna` table and used for LinkedIn content generation.

