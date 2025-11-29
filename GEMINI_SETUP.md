# Gemini Image Generation Setup Guide

## Overview

This app now supports Google Gemini (Gemini 2.5 Flash Image) as an alternative image generation provider alongside DALL-E. Users can choose between DALL-E and Gemini when generating images for LinkedIn posts.

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey) or [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new API key for Gemini
3. Enable the Generative Language API in your Google Cloud project
4. Copy your API key

### 2. Configure Environment Variable

Add to your `.env` file:

```env
VITE_BANANA_API_KEY=your_gemini_api_key_here
```

**Note:** The variable is named `VITE_BANANA_API_KEY` to match the original specification, but it stores the Gemini API key.

### 3. Model Information

The implementation uses the `gemini-2.5-flash-image` model for image generation. If this model is not available in your region or API tier, the system will:

1. Attempt to use the model endpoint
2. Fall back to a placeholder image if the model is unavailable
3. Show an error message: "Couldn't generate images. Try again."

### 4. Usage

1. Navigate to LinkedIn Post Generator
2. Enter website URL and generate post
3. Go to Step 4 (Post Preview)
4. Click on "Images" tab
5. Select provider (DALL-E or Gemini) using the toggle
6. Click "Generate Images"
7. Select an image from the 3 generated options
8. Image will be attached to the post preview

## Features

- **Provider Selection:** Toggle between DALL-E and Gemini
- **Brand-Aware Generation:** Uses brand profile (colors, tone, style) for personalized images
- **3 Variations:** Generates primary, alternate1, and alternate2 versions
- **Error Handling:** Graceful fallback with retry option
- **Preview Integration:** Selected image appears in post preview
- **Editor Support:** Image can be removed/changed in the editor

## API Endpoint

The implementation uses the Google Generative Language API:

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent
```

## Response Format

The API returns base64-encoded images in the response:

```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "inlineData": {
          "mimeType": "image/png",
          "data": "base64_encoded_image_data"
        }
      }]
    }
  }]
}
```

## Troubleshooting

### "Couldn't generate images. Try again."

- Check that `VITE_BANANA_API_KEY` is set correctly
- Verify the API key has access to Gemini models
- Check API quota/rate limits
- Try switching to DALL-E as fallback

### Model Not Found Error

- The `gemini-2.5-flash-image` model may not be available in your region
- Check Google AI Studio for available models
- Update the model name in `src/lib/geminiImage.ts` if needed

### Images Not Displaying

- Check browser console for CORS errors
- Verify blob URLs are being created correctly
- Ensure images are being converted from base64 properly

## Code Structure

- `src/lib/geminiImage.ts` - Gemini API integration
- `src/lib/asset-generator.ts` - Unified image generation with provider selection
- `src/components/ImagePicker.tsx` - Image selection UI component
- `src/components/dashboard/LinkedInPostGenerator.tsx` - Main integration
- `src/components/dashboard/PostEditor.tsx` - Image preview in editor

## Future Enhancements

- Support for additional image generation providers
- Batch image generation optimization
- Image caching to reduce API calls
- Custom image dimensions
- Image editing capabilities

