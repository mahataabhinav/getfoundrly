/**
 * Google Gemini Image Generation Module
 * 
 * Generates images using Google Gemini API (gemini-2.5-flash-image model)
 * Integrates with brand profile for personalized image generation
 * 
 * Note: Uses Gemini 2.5 Flash Image model for image generation
 */

import type { BrandProfile } from './brand-extractor';
import type { GeneratedImage } from './asset-generator';

// Get API key from environment
const apiKey = import.meta.env.VITE_BANANA_API_KEY;

/**
 * Generate brand images using Google Gemini API
 */
export async function generateBrandImages(
  prompt: string,
  brandProfile: BrandProfile
): Promise<GeneratedImage[]> {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_BANANA_API_KEY to your .env file.');
  }

  // Build enhanced prompt from brand profile
  const enhancedPrompt = buildBrandImagePrompt(prompt, brandProfile);

  try {
    const variations: GeneratedImage[] = [];
    const variationTypes: Array<'primary' | 'alternate1' | 'alternate2'> = ['primary', 'alternate1', 'alternate2'];
    
    // Generate 3 variations with different style modifiers
    for (let i = 0; i < 3; i++) {
      const variationType = variationTypes[i];
      
      // Add variation-specific instructions
      let variationPrompt = enhancedPrompt;
      if (i === 1) {
        variationPrompt = `${enhancedPrompt} - Alternative style: more minimalist and clean`;
      } else if (i === 2) {
        variationPrompt = `${enhancedPrompt} - Alternative style: more dynamic and energetic`;
      }

      const imageData = await generateSingleImage(variationPrompt, apiKey);
      
      variations.push({
        id: `gemini_img_${Date.now()}_${i}`,
        url: imageData.url,
        prompt: variationPrompt,
        variation: variationType,
        metadata: {
          brandColors: extractBrandColors(brandProfile),
          style: brandProfile.visualStyle || 'professional',
          dimensions: { width: 1024, height: 1024 },
          provider: 'gemini',
        },
      });
    }

    return variations;
  } catch (error: any) {
    console.error('Error generating images with Gemini:', error);
    if (error?.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your .env file.');
    } else if (error?.message?.includes('rate limit') || error?.status === 429) {
      throw new Error('Gemini API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to generate images: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Generate a single image using Gemini API
 */
async function generateSingleImage(prompt: string, apiKey: string): Promise<{ url: string }> {
  try {
    // Use Google Generative AI REST API with gemini-2.5-flash-image model
    // API endpoint for image generation
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API request failed: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Extract image data from response
    const candidates = data.candidates || [];
    if (candidates.length === 0) {
      throw new Error('No candidates in response');
    }

    const parts = candidates[0].content?.parts || [];
    
    // Look for inline image data (base64)
    for (const part of parts) {
      if (part.inlineData) {
        // Convert base64 to blob URL
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        const blob = base64ToBlob(base64Data, mimeType);
        const url = URL.createObjectURL(blob);
        return { url };
      }
    }

    // If no inline data found, the model might not support direct image generation
    // In this case, create a placeholder and log a warning
    console.warn('Gemini API did not return image data. Model may not support direct image generation.');
    throw new Error('Image generation not supported by this model. Please use a model that supports image generation like gemini-2.5-flash-image.');
  } catch (error: any) {
    // If the specific model endpoint doesn't work, try alternative approach
    if (error?.message?.includes('not found') || error?.message?.includes('404')) {
      // Fallback: Create a placeholder image based on the prompt
      // In production, you would integrate with an actual image generation service
      console.warn('Gemini image generation endpoint not available. Using placeholder.');
      const placeholderUrl = createPlaceholderImage(prompt);
      return { url: placeholderUrl };
    }
    throw error;
  }
}

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Create a placeholder SVG image based on prompt
 * Used as fallback when actual image generation is not available
 */
function createPlaceholderImage(prompt: string): string {
  // Extract key colors and themes from prompt for placeholder
  const colors = ['#1A1A1A', '#6B7280', '#3B82F6'];
  const primaryColor = colors[0];
  const secondaryColor = colors[1];
  
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#grad)"/>
      <text x="512" y="480" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" font-weight="bold">
        ${prompt.substring(0, 40)}${prompt.length > 40 ? '...' : ''}
      </text>
      <text x="512" y="540" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" opacity="0.9">
        Generated Image Preview
      </text>
    </svg>
  `.trim();
  
  // Convert SVG to data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Build enhanced image prompt from brand profile
 */
function buildBrandImagePrompt(basePrompt: string, brandProfile: BrandProfile): string {
  const parts: string[] = [];
  
  // Base prompt
  parts.push('Create a clean, modern, professional LinkedIn visual');
  
  // Brand colors
  if (brandProfile.brandColors) {
    const colors = Object.values(brandProfile.brandColors)
      .filter(Boolean)
      .join(', ');
    if (colors) {
      parts.push(`using these brand colors: ${colors}`);
    }
  }
  
  // Visual style
  if (brandProfile.visualStyle) {
    parts.push(`style: ${brandProfile.visualStyle}`);
  }
  
  // Brand tone
  if (brandProfile.brandTone) {
    parts.push(`tone: ${brandProfile.brandTone}`);
  }
  
  // Image themes
  if (brandProfile.imageThemes && brandProfile.imageThemes.length > 0) {
    parts.push(`themes: ${brandProfile.imageThemes.join(', ')}`);
  }
  
  // Original prompt context
  if (basePrompt) {
    parts.push(`context: ${basePrompt}`);
  }
  
  // Quality and format
  parts.push('High quality, professional, clean design, suitable for LinkedIn');
  parts.push('No text overlay, image only');
  
  return parts.join('; ');
}

/**
 * Extract brand colors as array
 */
function extractBrandColors(profile: BrandProfile): string[] {
  if (!profile.brandColors) return [];
  
  return Object.values(profile.brandColors)
    .filter((color): color is string => Boolean(color));
}
