/**
 * Brand Profile Extraction Module
 * 
 * Fetches and analyzes websites to extract comprehensive brand identity
 * using OpenAI for intelligent analysis and structuring.
 */

import OpenAI from 'openai';

// Get OpenAI client instance
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
}) : null;
import type { Brand } from '../types/database';

export interface BrandProfile {
  // Visual Identity
  brandColors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  logoDescription?: string;
  typographyHints?: {
    fontFamily?: string;
    fontStyle?: string;
    headingsStyle?: string;
  };
  
  // Brand Identity
  mission?: string;
  values?: string[];
  brandTone?: string;
  brandVoice?: string;
  
  // Business Context
  industry?: string;
  niche?: string;
  targetAudience?: {
    demographics?: string;
    psychographics?: string;
    painPoints?: string[];
  };
  services?: string[];
  products?: string[];
  
  // Website Metadata
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  
  // Competitive Intelligence
  competitors?: string[];
  positioning?: string;
  
  // Contact Information
  contactInfo?: {
    email?: string;
    phone?: string;
    socials?: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
      facebook?: string;
    };
  };
  
  // Visual Content
  imageThemes?: string[];
  visualStyle?: string;
  
  // Video Content
  videoCues?: {
    tone?: string;
    style?: string;
    environment?: string;
    mood?: string;
  };
  
  // Extracted Raw Data
  rawContent?: {
    html?: string;
    text?: string;
    metadata?: Record<string, any>;
  };
}

/**
 * Fetch website HTML content
 * Note: In production, this should be done via a backend proxy to avoid CORS issues
 */
async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Use a CORS proxy for browser-based fetching
    // In production, this should be done server-side
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(normalizedUrl)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (data.contents) {
      return data.contents;
    }
    
    throw new Error('Failed to fetch website content');
  } catch (error) {
    console.error('Error fetching website:', error);
    // Fallback: try direct fetch (may fail due to CORS)
    try {
      const response = await fetch(normalizedUrl, {
        mode: 'no-cors',
      });
      // Note: no-cors mode doesn't allow reading response, so this is a fallback
      return '';
    } catch (fallbackError) {
      throw new Error('Unable to fetch website content. Please ensure the URL is accessible.');
    }
  }
}

/**
 * Extract text content from HTML
 */
function extractTextFromHTML(html: string): string {
  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Remove script and style elements
  const scripts = doc.querySelectorAll('script, style, noscript');
  scripts.forEach(el => el.remove());
  
  // Extract text content
  const body = doc.body || doc.documentElement;
  return body?.textContent || body?.innerText || '';
}

/**
 * Extract basic metadata from HTML
 */
function extractMetadata(html: string): Record<string, any> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const metadata: Record<string, any> = {};
  
  // Extract meta tags
  const metaTags = doc.querySelectorAll('meta');
  metaTags.forEach(meta => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) {
      metadata[name] = content;
    }
  });
  
  // Extract title
  const title = doc.querySelector('title');
  if (title) {
    metadata.title = title.textContent;
  }
  
  // Extract Open Graph tags
  const ogTags: Record<string, string> = {};
  doc.querySelectorAll('meta[property^="og:"]').forEach(meta => {
    const property = meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (property && content) {
      ogTags[property] = content;
    }
  });
  if (Object.keys(ogTags).length > 0) {
    metadata.openGraph = ogTags;
  }
  
  // Extract colors from CSS or inline styles
  const colors: string[] = [];
  const styleSheets = doc.querySelectorAll('style');
  styleSheets.forEach(style => {
    const cssText = style.textContent || '';
    const colorMatches = cssText.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\([^)]+\)|rgba\([^)]+\)/g);
    if (colorMatches) {
      colors.push(...colorMatches);
    }
  });
  if (colors.length > 0) {
    metadata.colors = [...new Set(colors)];
  }
  
  return metadata;
}

/**
 * Use OpenAI to analyze website content and extract brand profile
 */
async function analyzeWithOpenAI(
  websiteName: string,
  websiteUrl: string,
  htmlContent: string,
  textContent: string,
  metadata: Record<string, any>
): Promise<BrandProfile> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  // Chunk the content if it's too long (OpenAI has token limits)
  const maxChunkSize = 10000; // characters
  const chunks: string[] = [];
  
  if (textContent.length > maxChunkSize) {
    // Split into chunks by sentences
    const sentences = textContent.match(/[^.!?]+[.!?]+/g) || [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxChunkSize) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    if (currentChunk) {
      chunks.push(currentChunk);
    }
  } else {
    chunks.push(textContent);
  }

  // Analyze first chunk (most important content is usually at the top)
  const contentToAnalyze = chunks[0] || textContent.substring(0, maxChunkSize);

  const systemPrompt = `You are an expert brand analyst specializing in extracting comprehensive brand identity from websites. 
Analyze the provided website content and extract a detailed brand profile in JSON format.

Extract and structure the following information:
1. Brand colors (primary, secondary, accent, background, text) - from CSS, design patterns, or brand guidelines
2. Logo description (visual style, elements, colors)
3. Typography hints (font families, styles, heading styles)
4. Mission statement
5. Core values (as an array)
6. Brand tone and voice (professional, casual, friendly, authoritative, etc.)
7. Industry and niche
8. Target audience (demographics, psychographics, pain points)
9. Services and products offered
10. Website metadata (title, description, keywords)
11. Competitors (inferred from keywords, text patterns, industry mentions)
12. Brand positioning
13. Contact information (email, phone, social media links)
14. Image themes and visual style
15. Video content cues (tone, style, environment, mood)

Return ONLY valid JSON matching this structure:
{
  "brandColors": {
    "primary": "#hex or color name",
    "secondary": "#hex or color name",
    "accent": "#hex or color name",
    "background": "#hex or color name",
    "text": "#hex or color name"
  },
  "logoDescription": "description",
  "typographyHints": {
    "fontFamily": "font name",
    "fontStyle": "style description",
    "headingsStyle": "heading style"
  },
  "mission": "mission statement",
  "values": ["value1", "value2"],
  "brandTone": "tone description",
  "brandVoice": "voice description",
  "industry": "industry name",
  "niche": "niche description",
  "targetAudience": {
    "demographics": "description",
    "psychographics": "description",
    "painPoints": ["pain1", "pain2"]
  },
  "services": ["service1", "service2"],
  "products": ["product1", "product2"],
  "metaTitle": "title",
  "metaDescription": "description",
  "keywords": ["keyword1", "keyword2"],
  "competitors": ["competitor1", "competitor2"],
  "positioning": "positioning statement",
  "contactInfo": {
    "email": "email@example.com",
    "phone": "+1234567890",
    "socials": {
      "linkedin": "url",
      "twitter": "url",
      "instagram": "url",
      "facebook": "url"
    }
  },
  "imageThemes": ["theme1", "theme2"],
  "visualStyle": "style description",
  "videoCues": {
    "tone": "tone description",
    "style": "style description",
    "environment": "environment description",
    "mood": "mood description"
  }
}

If information is not available, use null or empty arrays/objects. Be thorough and extract as much as possible.`;

  const userPrompt = `Website Name: ${websiteName}
Website URL: ${websiteUrl}

Website Metadata:
${JSON.stringify(metadata, null, 2)}

Website Content (first ${Math.min(contentToAnalyze.length, maxChunkSize)} characters):
${contentToAnalyze}

Extract the complete brand profile in JSON format.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temperature for more consistent extraction
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content || '{}';
    const brandProfile = JSON.parse(responseContent) as BrandProfile;

    // Store raw content for reference
    brandProfile.rawContent = {
      html: htmlContent.substring(0, 50000), // Store first 50k chars
      text: textContent.substring(0, 50000),
      metadata,
    };

    return brandProfile;
  } catch (error: any) {
    console.error('Error analyzing brand with OpenAI:', error);
    if (error?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your .env file.');
    } else if (error?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to analyze brand: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Extract brand profile from website URL
 */
export async function extractBrandProfile(
  websiteName: string,
  websiteUrl: string,
  useCache: boolean = true
): Promise<BrandProfile> {
  try {
    // Fetch website content
    const htmlContent = await fetchWebsiteContent(websiteUrl);
    
    // Extract text and metadata
    const textContent = extractTextFromHTML(htmlContent);
    const metadata = extractMetadata(htmlContent);
    
    // Analyze with OpenAI
    const brandProfile = await analyzeWithOpenAI(
      websiteName,
      websiteUrl,
      htmlContent,
      textContent,
      metadata
    );
    
    return brandProfile;
  } catch (error: any) {
    console.error('Error extracting brand profile:', error);
    throw error;
  }
}

/**
 * Save brand profile to database (stores in brand.metadata)
 */
export async function saveBrandProfile(
  brandId: string,
  brandProfile: BrandProfile
): Promise<void> {
  const { updateBrand } = await import('./database');
  
  // Get existing metadata to preserve other data
  const { getBrand } = await import('./database');
  const existingBrand = await getBrand(brandId);
  const existingMetadata = existingBrand?.metadata || {};
  
  await updateBrand(brandId, {
    metadata: {
      ...existingMetadata,
      brandProfile,
      extractedAt: new Date().toISOString(),
    },
    // Also update relevant fields if available
    brand_tone: brandProfile.brandTone || undefined,
    brand_summary: brandProfile.mission || undefined,
    primary_keywords: brandProfile.keywords || undefined,
  });
}

/**
 * Get cached brand profile from database
 */
export async function getCachedBrandProfile(brandId: string): Promise<BrandProfile | null> {
  const { getBrand } = await import('./database');
  
  const brand = await getBrand(brandId);
  if (!brand || !brand.metadata?.brandProfile) {
    return null;
  }
  
  return brand.metadata.brandProfile as BrandProfile;
}

