# SeedDream 4.0 Image Generation Setup Guide

## Overview

This app now supports ByteDance SeedDream 4.0 as an alternative image generation provider alongside DALL-E and Gemini. Users can choose between DALL-E, Gemini, or SeedDream when generating images for LinkedIn posts. SeedDream 4.0 is accessed through the fal.ai API.

## Setup Instructions

### 1. Get fal.ai API Key

1. Go to [fal.ai](https://fal.ai) and create an account or sign in
2. Navigate to your API keys section in the dashboard
3. Create a new API key or copy your existing one
4. Make sure you have access to the ByteDance SeedDream models

### 2. Configure Environment Variable

Add to your `.env` file:

```env
VITE_FAL_API_KEY=your_fal_ai_api_key_here
```

**Note:** The variable must be named `VITE_FAL_API_KEY` to be accessible in the Vite frontend.

### 3. Install Dependencies

The implementation uses the `@fal-ai/client` npm package. Install it if not already installed:

```bash
npm install @fal-ai/client
```

### 4. Model Information

The implementation uses the `fal-ai/bytedance/seedream/v4/text-to-image` model endpoint. SeedDream 4.0 offers:

- Ultra-fast image generation (4K resolution support)
- Superior text rendering
- High-quality professional images
- Brand-aware generation with custom prompts

If the model is not available or you encounter errors, the system will:
1. Show an error message: "Couldn't generate images. Try again."
2. Optionally fall back to DALL-E if configured
3. Display specific error messages for API key, rate limit, or model availability issues

### 5. Usage

1. Navigate to LinkedIn Post Generator
2. Enter website URL and generate post
3. Go to Step 4 (Post Preview)
4. Click on "Images" tab
5. Select provider (DALL-E, Gemini, or SeedDream) using the toggle
6. Click "Generate Images" (or images will auto-generate after post creation)
7. Select an image from the 3 generated options
8. Image will be attached to the post preview

## Features

- **Provider Selection:** Toggle between DALL-E, Gemini, and SeedDream
- **Brand-Aware Generation:** Uses brand profile (colors, tone, style) for personalized images
- **3 Variations:** Generates primary, alternate1, and alternate2 versions
- **Error Handling:** Graceful fallback with retry option
- **Preview Integration:** Selected image appears in post preview
- **Editor Support:** Image can be removed/changed in the editor
- **High Quality:** SeedDream 4.0 generates high-resolution, professional images optimized for LinkedIn

## API Endpoint

The implementation uses the fal.ai API:

```
Model: fal-ai/bytedance/seedream/v4/text-to-image
Documentation: https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image/api
```

## Response Format

The API returns image URLs in the response:

```json
{
  "images": [
    {
      "url": "https://..."
    }
  ],
  "seed": 123456789
}
```

## Troubleshooting

### "Couldn't generate images. Try again."

- Check that `VITE_FAL_API_KEY` is set correctly in your `.env` file
- Verify the API key has access to SeedDream models
- Check API quota/rate limits in your fal.ai dashboard
- Try switching to DALL-E or Gemini as fallback

### Invalid API Key Error

- Verify your fal.ai API key is correct
- Check that the key hasn't expired or been revoked
- Ensure the key has proper permissions for model access
- Update the key in your `.env` file and restart the dev server

### Rate Limit Exceeded

- Check your fal.ai account usage and limits
- Wait a few minutes before retrying
- Consider upgrading your fal.ai plan if you hit rate limits frequently
- Use DALL-E or Gemini as alternatives

### Model Not Available

- Check fal.ai status page for service outages
- Verify the SeedDream model is available in your region
- Check fal.ai documentation for model availability
- Try using DALL-E or Gemini as fallback

### Images Not Displaying

- Check browser console for CORS errors
- Verify image URLs are being fetched correctly
- Check network tab to see if images are loading
- Ensure the fal.ai API is returning valid image URLs

## Code Structure

- `src/lib/seedreamImage.ts` - SeedDream API integration via fal.ai
- `src/lib/asset-generator.ts` - Unified image generation with provider selection
- `src/components/ImagePicker.tsx` - Image selection UI component
- `src/components/dashboard/LinkedInPostGenerator.tsx` - Main integration
- `src/components/dashboard/PostEditor.tsx` - Image preview in editor

## API Configuration

The SeedDream integration uses the fal.ai client library:

```typescript
import { fal } from "@fal-ai/client";

fal.config({
  credentials: import.meta.env.VITE_FAL_API_KEY
});

const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/text-to-image", {
  input: {
    prompt: "your prompt here",
    image_size: "square",
    num_images: 1
  }
});
```

## Image Specifications

- **Default Size:** 1024x1024 (square) - optimal for LinkedIn
- **Format:** PNG or JPEG (as returned by API)
- **Quality:** High-quality professional images
- **Style:** Brand-aware, professional, LinkedIn-optimized

## Security Notes

**Important:** When running in production:

- Never expose your `VITE_FAL_API_KEY` in client-side code if possible
- Consider using a server-side proxy for API calls in production
- Monitor API usage to prevent unauthorized access
- Use environment variables securely and never commit them to version control

For more information on secure API key handling, see the [fal.ai documentation](https://fal.ai/docs).

## Future Enhancements

- Support for additional SeedDream features (image editing, multi-image fusion)
- Custom image dimensions
- Batch image generation optimization
- Advanced prompt enhancement modes
- Style transfer capabilities

## References

- [fal.ai SeedDream Documentation](https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image/api)
- [fal.ai Client Library](https://github.com/fal-ai/fal-client)
- [ByteDance SeedDream 4.0](https://www.seedreampro.com/)

