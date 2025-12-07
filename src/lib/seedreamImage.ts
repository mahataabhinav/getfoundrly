/**
 * ByteDance SeedDream 4.0 Image Generation Module
 * 
 * Generates images using fal.ai API with ByteDance SeedDream v4 model
 * Integrates with brand profile for personalized image generation
 * 
 * Note: Uses fal.ai/bytedance/seedream/v4/text-to-image endpoint
 */

import { fal } from "@fal-ai/client";
import type { BrandProfile } from './brand-extractor';
import type { GeneratedImage } from './asset-generator';

// Get API key from environment
const apiKey = import.meta.env.VITE_FAL_API_KEY;

// Configure fal.ai client with API key
if (apiKey) {
  fal.config({
    credentials: apiKey,
  });
}

/**
 * Generate brand images using ByteDance SeedDream 4.0 via fal.ai API
 */
export async function generateBrandImages(
  prompt: string,
  brandProfile: BrandProfile
): Promise<GeneratedImage[]> {
  if (!apiKey) {
    throw new Error('fal.ai API key is not configured. Please add VITE_FAL_API_KEY to your .env file.');
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

      const imageData = await generateSingleImage(variationPrompt);
      
      variations.push({
        id: `seedream_img_${Date.now()}_${i}`,
        url: imageData.url,
        prompt: variationPrompt,
        variation: variationType,
        metadata: {
          brandColors: extractBrandColors(brandProfile),
          style: brandProfile.visualStyle || 'professional',
          dimensions: { width: 1024, height: 1024 },
          provider: 'seedream',
        },
      });
    }

    return variations;
  } catch (error: any) {
    console.error('Error generating images with SeedDream:', error);
    if (error?.message?.includes('API key') || error?.message?.includes('credentials')) {
      throw new Error('Invalid fal.ai API key. Please check your .env file.');
    } else if (error?.message?.includes('rate limit') || error?.status === 429) {
      throw new Error('fal.ai API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to generate images: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Generate a single image using fal.ai SeedDream API
 */
async function generateSingleImage(prompt: string): Promise<{ url: string }> {
  try {
    // Use fal.ai client to call SeedDream v4 text-to-image endpoint
    const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/text-to-image", {
      input: {
        prompt: prompt,
        image_size: "square", // LinkedIn optimal: 1024x1024
        num_images: 1,
        enable_safety_checker: true,
        enhance_prompt_mode: "standard",
      },
      logs: false,
    });

    // Extract image URL from response
    const images = result.data?.images;
    if (!images || images.length === 0) {
      throw new Error('No images returned from SeedDream API');
    }

    const imageUrl = images[0]?.url;
    if (!imageUrl) {
      throw new Error('Invalid image URL in SeedDream API response');
    }

    return { url: imageUrl };
  } catch (error: any) {
    console.error('Error calling SeedDream API:', error);
    
    // Handle specific error cases
    if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
      throw new Error('Invalid fal.ai API key. Please check your .env file.');
    } else if (error?.message?.includes('429') || error?.message?.includes('rate limit')) {
      throw new Error('fal.ai API rate limit exceeded. Please try again later.');
    } else if (error?.message?.includes('model') || error?.message?.includes('not found')) {
      throw new Error('SeedDream model not available. Please check fal.ai status.');
    }
    
    throw new Error(`Failed to generate image: ${error?.message || 'Unknown error'}`);
  }
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

