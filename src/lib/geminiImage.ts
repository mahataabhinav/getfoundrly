/**
 * Google Gemini Image Generation Module
 * (Powered by Nano Banana API)
 * 
 * Generates images using Google Gemini API (gemini-2.5-flash-image model)
 * Integrates with BrandDNA for hyper-realistic, brand-consistent visual generation.
 */

import type { BrandProfile } from './brand-extractor';
import type { GeneratedImage } from './asset-generator';
import type { BrandDNA } from '../types/database';

// Get API key from environment
const apiKey = import.meta.env.VITE_BANANA_API_KEY;

/**
 * Generate brand images using Google Gemini API
 */
export async function generateBrandImages(
  basePrompt: string,
  brandProfile: BrandProfile,
  brandName: string,
  brandDNA?: BrandDNA
): Promise<GeneratedImage[]> {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_BANANA_API_KEY to your .env file.');
  }

  // Extract post type from prompt context or default to 'linkedin'
  const postType = determinePostType(basePrompt);

  // Build enhanced prompt strategies
  const strategies = [
    { name: 'clean-minimal', prompt: buildPrompt(basePrompt, brandProfile, brandDNA, postType, 'clean-minimal', brandName) },
    { name: 'bold-brand', prompt: buildPrompt(basePrompt, brandProfile, brandDNA, postType, 'bold-brand', brandName) },
    { name: 'lifestyle-context', prompt: buildPrompt(basePrompt, brandProfile, brandDNA, postType, 'lifestyle-context', brandName) }
  ];

  try {
    const variations: GeneratedImage[] = [];

    // Generate 3 variations in parallel
    const promises = strategies.map(async (strategy, index) => {
      const imageData = await generateSingleImage(strategy.prompt, apiKey);
      return {
        id: `gemini_img_${Date.now()}_${index}`,
        url: imageData.url,
        prompt: strategy.prompt,
        variation: index === 0 ? 'primary' : index === 1 ? 'alternate1' : 'alternate2',
        metadata: {
          brandColors: extractBrandColors(brandProfile, brandDNA),
          style: strategy.name,
          dimensions: { width: 1024, height: 1024 },
          provider: 'gemini',
          postType: postType
        },
      } as GeneratedImage;
    });

    const results = await Promise.allSettled(promises);

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        variations.push(result.value);
      } else {
        console.error('Failed verification:', result.reason);
      }
    });

    if (variations.length === 0) {
      throw new Error('Failed to generate any images.');
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

    // Fallback if no image data
    console.warn('Gemini API did not return image data.');
    throw new Error('Image generation not supported by this output.');
  } catch (error: any) {
    // If the specific model endpoint doesn't work, try alternative approach or fallback
    if (error?.message?.includes('not found') || error?.message?.includes('404')) {
      console.warn('Gemini image generation endpoint not available. Using placeholder.');
      const placeholderUrl = createPlaceholderImage(prompt);
      return { url: placeholderUrl };
    }
    throw error;
  }
}

/**
 * Determine Post Type from prompt text
 */
function determinePostType(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('announcement') || p.includes('launch')) return 'Announcement';
  if (p.includes('hiring') || p.includes('join us') || p.includes('team')) return 'Hiring';
  if (p.includes('milestone') || p.includes('celebrat') || p.includes('award')) return 'Milestone';
  if (p.includes('tips') || p.includes('guide') || p.includes('how to')) return 'Educational';
  if (p.includes('event') || p.includes('webinar')) return 'Event';
  if (p.includes('quote') || p.includes('inspiration')) return 'Quote';
  return 'General';
}

/**
 * Build Strict, Brand-Consistent Prompt
 */
function buildPrompt(
  basePrompt: string,
  brandProfile: BrandProfile,
  brandDNA: BrandDNA | undefined,
  postType: string,
  styleMode: 'clean-minimal' | 'bold-brand' | 'lifestyle-context',
  brandNameArg: string
): string {
  // 1. Brand Identity Extraction
  const brandName = brandDNA?.dna_data?.identity?.official_name || brandNameArg || 'Brand';
  const colors = extractBrandColors(brandProfile, brandDNA);
  const colorString = colors.length > 0 ? colors.join(', ') : 'professional, neutral colors';
  const fonts = brandDNA?.dna_data?.visual_identity?.typography?.font_families?.join(', ') || 'modern sans-serif';
  const vibe = brandDNA?.dna_data?.voice?.tone_descriptors?.join(', ') || brandProfile.brandTone || 'Professional, Trustworthy';

  // 2. Post Type Styling Rules
  let compositionRule = '';
  switch (postType) {
    case 'Announcement':
      compositionRule = 'Subject: Big reveal, dramatic lighting, center focus. Background: Abstract gradient using brand colors. Mood: Exciting, Premium.';
      break;
    case 'Hiring':
      compositionRule = 'Subject: Professional team environment, modern workspace or friendly professional portrait. Lighting: Bright, warm, inviting. Mood: Welcoming, Growth.';
      break;
    case 'Milestone':
      compositionRule = 'Subject: Success metaphor, upward transparency graph or champion element. Background: Clean, success-oriented. Mood: Celebratory, Data-driven.';
      break;
    case 'Educational':
      compositionRule = 'Subject: Clear concept illustration, organized layout, minimal distraction. Background: Solid or very subtle texture. Mood: Clarity, Knowledge.';
      break;
    case 'Event':
      compositionRule = 'Subject: Stage or Digital gathering metaphor, dynamic energy. Mood: Engaging, Urgent.';
      break;
    default: // General
      compositionRule = 'Subject: Professional business context, high-end photography style. Mood: Trustworthy.';
  }

  // 3. Style Mode Variation
  if (styleMode === 'clean-minimal') {
    compositionRule += ' Style: Ultra-minimalist, lots of negative space, matte finish, soft shadows.';
  } else if (styleMode === 'bold-brand') {
    compositionRule += ` Style: Heavy usage of brand colors (${colorString}), high contrast, bold geometric shapes.`;
  } else if (styleMode === 'lifestyle-context') {
    compositionRule += ' Style: Real-world photography look, shallow depth of field (bokeh), authentic texture.';
  }

  // 4. Construct the Mega-Prompt
  return `
    Create a high-fidelity, photorealistic image for a LinkedIn ${postType} post by ${brandName}.
    
    BRAND GUIDELINES:
    - Colors to feature: ${colorString}
    - Aesthetic Vibe: ${vibe}
    - Typography Style (if text appears in abstract forms): ${fonts}
    
    VISUAL COMPOSITION:
    ${compositionRule}
    
    CONTEXT:
    ${basePrompt}
    
    STRICT REQUIREMENTS:
    - NO distorted text or garbled letters.
    - NO cartoonish 3D characters.
    - MUST look like professional corporate photography or high-end graphic design.
    - Aspect Ratio: 1:1 or 4:5 (Standard Social Media).
    - Lighting: Studio quality.
    
    Make it look like a human designer created this.
    `.trim();
}

/**
 * Extract brand colors as array
 */
function extractBrandColors(profile: BrandProfile, brandDNA?: BrandDNA): string[] {
  // Try BrandDNA first
  if (brandDNA?.dna_data?.visual_identity?.color_palette?.hex_codes) {
    return Object.values(brandDNA.dna_data.visual_identity.color_palette.hex_codes);
  }
  if (brandDNA?.dna_data?.visual_identity?.color_palette?.primary) {
    return brandDNA.dna_data.visual_identity.color_palette.primary;
  }

  // Fallback to BrandProfile
  if (profile.brandColors) {
    return Object.values(profile.brandColors)
      .filter((color): color is string => Boolean(color));
  }

  return [];
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
 */
function createPlaceholderImage(prompt: string): string {
  // Extract key colors from prompt for placeholder
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
        ${prompt.substring(0, 30)}
      </text>
      <text x="512" y="540" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" opacity="0.9">
        Gemini Image Fallback
      </text>
    </svg>
  `.trim();

  // Convert SVG to data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

