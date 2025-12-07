/**
 * Brand Profile Extraction Module
 * 
 * Fetches and analyzes websites to extract comprehensive brand identity
 * using OpenAI for intelligent analysis and structuring.
 */

import OpenAI from 'openai';
import { supabase } from './supabase';
import { extractWebsiteData, isFirecrawlAvailable } from './firecrawl';

// Get OpenAI client instance
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
}) : null;
import type { Brand } from '../types/database';
import type { BrandDNAData, BrandDNAProvenance } from '../types/database';

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
  
  // Confidence scores for extraction (0-100)
  confidenceScores?: Record<string, number>;
}

/**
 * Extract comprehensive BrandDNA data from website
 * This is an enhanced version that extracts all BrandDNA sections
 */
export async function extractBrandDNA(
  websiteName: string,
  websiteUrl: string
): Promise<{ dnaData: BrandDNAData; provenance: BrandDNAProvenance[] }> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  let htmlContent = '';
  let textContent = '';
  let metadata: Record<string, any> = {};
  let contentToAnalyze = '';
  let hasContent = false;
  let firecrawlImages: Array<{ url: string; alt?: string }> = [];
  let firecrawlVideos: Array<{ url: string; title?: string }> = [];
  let usedFirecrawl = false;

  // Try Firecrawl first if available
  if (isFirecrawlAvailable()) {
    try {
      console.log('Using Firecrawl to extract website content...');
      const firecrawlResult = await extractWebsiteData(websiteUrl, {
        useCrawl: true, // Use crawl for comprehensive data
        maxPages: 10,
        maxDepth: 2,
      });

      if (firecrawlResult.success && firecrawlResult.markdown) {
        usedFirecrawl = true;
        contentToAnalyze = firecrawlResult.markdown;
        metadata = firecrawlResult.metadata || {};
        firecrawlImages = firecrawlResult.images || [];
        firecrawlVideos = firecrawlResult.videos || [];
        hasContent = contentToAnalyze.length > 50;

        // If we have multiple pages, combine them intelligently
        if (firecrawlResult.pages && firecrawlResult.pages.length > 1) {
          // The extractWebsiteData already combines pages, but we can add context
          metadata.pages_crawled = firecrawlResult.pages.length;
          metadata.page_urls = firecrawlResult.pages.map((p) => p.url);
        }

        console.log(`Firecrawl extraction successful: ${contentToAnalyze.length} chars, ${firecrawlImages.length} images, ${firecrawlVideos.length} videos`);
      } else {
        console.warn('Firecrawl extraction failed, falling back to standard method:', firecrawlResult.error);
      }
    } catch (firecrawlError) {
      console.warn('Firecrawl error, falling back to standard method:', firecrawlError);
    }
  }

  // Fallback to standard method if Firecrawl not available or failed
  if (!usedFirecrawl) {
    try {
      // Try to fetch website content using standard method
    htmlContent = await fetchWebsiteContent(websiteUrl);
    textContent = extractTextFromHTML(htmlContent);
    metadata = extractMetadata(htmlContent);

    // Chunk content if needed
    const maxChunkSize = 15000;
    contentToAnalyze = textContent.length > maxChunkSize 
      ? textContent.substring(0, maxChunkSize) 
      : textContent;
    hasContent = contentToAnalyze.length > 50;
  } catch (error) {
    console.warn('Could not fetch website content, proceeding with URL-based extraction:', error);
    // If fetching fails, we'll still try to extract using just the URL and name
    // This allows OpenAI to make intelligent inferences
    contentToAnalyze = `Website Name: ${websiteName}\nWebsite URL: ${websiteUrl}`;
    metadata = { url: websiteUrl, name: websiteName };
    hasContent = false;
    }
  }

  // Adjust system prompt based on whether we have content
  let systemPrompt = `You are an expert brand analyst specializing in extracting comprehensive BrandDNA from websites. 
Extract ALL available brand information and structure it according to the BrandDNA schema.

CRITICAL: You MUST extract data for ALL sections below. Do not skip any section. For each section:
- Look for relevant information in the website content
- Extract from multiple pages if available (about, products, blog, features, pricing, etc.)
- Use images/videos to extract visual identity data
- Infer reasonable values when direct information is not available
- Be thorough and comprehensive

Return ONLY valid JSON matching this comprehensive structure:
{
  "identity": {
    "official_name": "company name",
    "domains": ["primary domain", "aliases"],
    "tagline": "1-line tagline",
    "elevator_pitch": "1-2 sentence pitch",
    "year_founded": 2020,
    "headquarters": "city, country",
    "legal_entity": "LLC/Inc/etc",
    "company_size": "startup/SMB/enterprise",
    "social_links": {
      "twitter": "url",
      "linkedin": "url",
      "instagram": "url",
      "youtube": "url"
    },
    "linkedin_bio": "LinkedIn company bio text",
    "sources": [{"field": "tagline", "url": "source_url"}]
  },
  "voice": {
    "tone_descriptors": ["bold", "empathetic", "technical"],
    "examples": {
      "micro_hook": "1-line example",
      "short_post": "3-5 line example"
    },
    "forbidden_words": ["words", "to", "avoid"],
    "preferred_emojis": ["emoji1", "emoji2"],
    "punctuation_rules": "description",
    "tone_intensity": "subtle|neutral|emphatic"
  },
  "messaging": {
    "value_props": [
      {"text": "value prop 1", "proof": "metric/study/testimonial", "source": "url"},
      {"text": "value prop 2", "proof": "proof", "source": "url"},
      {"text": "value prop 3", "proof": "proof", "source": "url"}
    ],
    "pillars": ["pillar1", "pillar2"],
    "target_problems": ["problem1", "problem2", "problem3"],
    "elevator_benefits": {
      "creators": "benefit for creators",
      "enterprises": "benefit for enterprises"
    }
  },
  "products": [
    {
      "name": "Product name",
      "description": "one-line description",
      "pricing_model": "free/paid/tiers",
      "differentiators": ["diff1", "diff2"],
      "product_url": "url"
    }
  ],
  "audience": {
    "primary_segments": ["segment1", "segment2"],
    "personas": [
      {
        "name": "Persona name",
        "role": "role title",
        "pain_points": ["pain1", "pain2"],
        "goals": ["goal1", "goal2"],
        "channels": ["channel1", "channel2"],
        "preferred_messaging": "messaging line"
      }
    ]
  },
  "proof": {
    "metrics": [
      {"label": "User count", "value": "10K+", "source_url": "url"},
      {"label": "ARR", "value": "$1M", "source_url": "url"}
    ],
    "testimonials": [
      {"quote": "testimonial text", "attribution": "Name, Title", "source_url": "url"}
    ],
    "case_studies": [
      {"problem": "problem", "solution": "solution", "result": "result", "source_url": "url"}
    ],
    "press_mentions": [
      {"title": "article title", "excerpt": "excerpt", "url": "url"}
    ],
    "awards": [
      {"name": "award name", "year": 2024, "url": "url"}
    ]
  },
  "visual_identity": {
    "logos": [
      {"url": "logo_url", "variant": "light|dark|default", "format": "svg|png"}
    ],
    "color_palette": {
      "primary": ["#hex1", "#hex2"],
      "secondary": ["#hex3", "#hex4"],
      "hex_codes": {"primary": "#hex", "secondary": "#hex"},
      "use_cases": {"primary": "description"}
    },
    "typography": {
      "font_families": ["font1", "font2"],
      "font_substitutes": ["substitute1"]
    },
    "image_style_guide": {
      "photography_vs_illustration": "preference",
      "mood": "mood description",
      "filters": "filter style"
    },
    "example_imagery": ["image_url1", "image_url2"],
    "alt_text_guidelines": "guidelines",
    "default_alt_text_templates": ["template1", "template2"]
  },
  "creative_guidelines": {
    "post_length_preferences": "short|medium|long|mixed",
    "preferred_formats": ["single image", "carousel", "video"],
    "cta_style": "Sign up vs Get started",
    "hashtag_strategy": {
      "branded_hashtags": ["#hashtag1"],
      "banned_hashtags": ["#hashtag2"]
    },
    "accessibility_rules": {
      "contrast_ratio": "WCAG AA",
      "alt_text_required": true
    }
  },
  "seo": {
    "top_keywords": ["keyword1", "keyword2", "keyword3"],
    "semantic_clusters": ["cluster1", "cluster2"],
    "negative_keywords": ["keyword to avoid"],
    "suggested_hashtags": {
      "keyword1": ["#hashtag1", "#hashtag2"]
    }
  },
  "competitive": {
    "top_competitors": [
      {"name": "competitor", "differentiation": "how we differ"}
    ],
    "market_trends": ["trend1", "trend2"],
    "positioning_statement": "positioning vs competitors"
  },
  "compliance": {
    "allowed_claims": ["claim1", "claim2"],
    "restricted_claims": ["claim to avoid"],
    "required_disclaimers": ["disclaimer text"],
    "ip_trademark_notes": "notes"
  }
}

EXTRACTION INSTRUCTIONS BY SECTION:

1. IDENTITY: Extract company name, tagline, elevator pitch, founding year, headquarters, company size, social links, LinkedIn bio from homepage, about page, footer, meta tags.

2. VOICE: Analyze content tone from blog posts, social media excerpts, about page. Extract tone descriptors, examples of writing style, preferred emojis, forbidden words, punctuation patterns.

3. MESSAGING: Extract value propositions from homepage hero, features page, benefits sections. Find messaging pillars from main navigation, key pages. Identify target problems from problem statements, pain points mentioned. Extract elevator benefits for different audiences.

4. PRODUCTS: Extract from products page, features page, pricing page. Get product names, descriptions, pricing models, differentiators, product URLs. Look for product comparisons, feature lists.

5. AUDIENCE: Identify primary segments from "Who is this for" sections, use cases, customer stories. Create personas from customer testimonials, case studies, target audience descriptions. Extract pain points, goals, preferred channels, messaging preferences.

6. PROOF: Extract metrics from homepage stats, about page numbers, press releases. Find testimonials from testimonials page, customer reviews, case studies. Extract case studies with problem/solution/result. Find press mentions from press page, news section, media kit. Extract awards from awards page, about page.

7. VISUAL IDENTITY: 
- Extract logo URLs from header, footer, favicon, meta tags
- Analyze color palette from CSS, images, brand colors mentioned
- Extract typography from font-family CSS, design system mentions
- Analyze image style from photography style, illustration usage
- Store ALL image URLs in example_imagery array
- Extract alt text patterns from existing alt attributes

8. CREATIVE GUIDELINES: Infer from content patterns - post lengths, formats used, CTA styles, hashtag usage. Extract from style guides if available.

9. SEO: Extract top keywords from meta keywords, headings, repeated terms. Identify semantic clusters from related content. Find negative keywords from content that avoids certain terms. Map keywords to suggested hashtags.

10. COMPETITIVE: Extract competitors mentioned in comparisons, "vs" pages, competitive analysis. Identify market trends from blog posts, industry insights. Create positioning statement from differentiation messaging.

11. COMPLIANCE: Extract from terms of service, privacy policy, legal pages. Find allowed claims from marketing copy, restricted claims from disclaimers, required disclaimers from fine print.

IMPORTANT: If images or videos are provided in the content, use them to:
- Extract visual identity (colors, logos, image styles)
- Analyze brand aesthetics and visual tone
- Identify logo URLs and variants
- Understand brand's visual communication style
- Extract ALL image URLs and store in visual_identity.example_imagery array
- Analyze dominant colors from images for color_palette`;

  if (!hasContent) {
    // Update system prompt for URL-only extraction
    systemPrompt = systemPrompt.replace(
      'Extract ALL available brand information and structure it according to the BrandDNA schema.',
      'Extract brand information based on the website name and URL. Since we could not fetch the website content, make intelligent inferences based on the domain name, company name, and your knowledge of similar companies. Mark fields with lower confidence scores (30-50) since they are inferred rather than extracted from actual content.'
    );
  }

  // Build enhanced user prompt with Firecrawl data if available
  let userPrompt = '';
  
  if (hasContent) {
    userPrompt = `Website Name: ${websiteName}
Website URL: ${websiteUrl}

Website Metadata:
${JSON.stringify(metadata, null, 2)}

Website Content:
${contentToAnalyze}`;

    // Add Firecrawl-specific information if available
    if (usedFirecrawl) {
      if (firecrawlImages.length > 0) {
        userPrompt += `\n\nExtracted Images (${firecrawlImages.length}):\n${firecrawlImages.slice(0, 20).map((img, i) => `${i + 1}. ${img.url}${img.alt ? ` (alt: ${img.alt})` : ''}`).join('\n')}`;
        userPrompt += '\n\nCRITICAL: Use these images to:\n- Extract ALL image URLs and store in visual_identity.example_imagery array\n- Analyze color palette from images (dominant colors)\n- Identify logo URLs and variants\n- Understand brand aesthetics and visual tone\n- Extract image style preferences (photography vs illustration, mood, filters)';
      }
      
      if (firecrawlVideos.length > 0) {
        userPrompt += `\n\nExtracted Videos (${firecrawlVideos.length}):\n${firecrawlVideos.slice(0, 10).map((vid, i) => `${i + 1}. ${vid.url}${vid.title ? ` (${vid.title})` : ''}`).join('\n')}`;
        userPrompt += '\n\nUse these videos to understand brand messaging, tone, and visual style.';
      }

      // Add context about pages crawled
      if (metadata.pages_crawled) {
        userPrompt += `\n\nPages Crawled: ${metadata.pages_crawled} pages were analyzed. Use information from all pages to extract comprehensive data:\n`;
        if (metadata.page_urls) {
          metadata.page_urls.forEach((url: string, idx: number) => {
            userPrompt += `- Page ${idx + 1}: ${url}\n`;
          });
        }
        userPrompt += '\nExtract data from each page type:\n- Homepage: Identity, messaging, value props\n- About page: Identity, voice, proof\n- Products page: Products, features, differentiators\n- Blog: Voice, SEO keywords, messaging\n- Pricing: Products, value props\n- Case studies: Proof, audience personas';
      }
    }

    userPrompt += '\n\nExtract comprehensive BrandDNA in JSON format.';
  } else {
    userPrompt = `Website Name: ${websiteName}
Website URL: ${websiteUrl}

Note: We could not fetch the actual website content due to CORS restrictions. Please extract BrandDNA based on:
1. The company name and domain
2. Your knowledge of similar companies in this space
3. Common patterns for companies with similar names/domains

Extract what you can infer, but mark confidence lower since this is inferred rather than extracted from actual content.`;
  }

  try {

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
      max_tokens: 6000, // Increased for comprehensive extraction
    });

    const responseContent = completion.choices[0]?.message?.content || '{}';
    const extractedData = JSON.parse(responseContent) as BrandDNAData;

    // Store Firecrawl images in visual_identity.example_imagery
    if (usedFirecrawl && firecrawlImages.length > 0) {
      if (!extractedData.visual_identity) {
        extractedData.visual_identity = {};
      }
      if (!extractedData.visual_identity.example_imagery) {
        extractedData.visual_identity.example_imagery = [];
      }
      // Merge Firecrawl images with extracted images (avoid duplicates)
      const existingUrls = new Set(extractedData.visual_identity.example_imagery);
      firecrawlImages.forEach(img => {
        if (img.url && !existingUrls.has(img.url)) {
          extractedData.visual_identity.example_imagery!.push(img.url);
        }
      });
    }

    // Extract logo URLs from images if not already extracted
    if (usedFirecrawl && firecrawlImages.length > 0 && (!extractedData.visual_identity?.logos || extractedData.visual_identity.logos.length === 0)) {
      if (!extractedData.visual_identity) {
        extractedData.visual_identity = {};
      }
      if (!extractedData.visual_identity.logos) {
        extractedData.visual_identity.logos = [];
      }
      // Look for logo-like images (containing "logo" in URL or alt text)
      firecrawlImages.forEach(img => {
        if (img.url && (img.url.toLowerCase().includes('logo') || img.alt?.toLowerCase().includes('logo'))) {
          extractedData.visual_identity.logos!.push({
            url: img.url,
            variant: 'default',
            format: img.url.toLowerCase().includes('.svg') ? 'svg' : 'png',
          });
        }
      });
    }

    // Build provenance array with confidence scores
    const provenance: BrandDNAProvenance[] = [];
    const now = new Date().toISOString();
    
    // Calculate confidence scores based on data presence and quality
    const calculateConfidence = (field: any, path: string): number => {
      if (!field || (Array.isArray(field) && field.length === 0) || 
          (typeof field === 'object' && Object.keys(field).length === 0)) {
        return 0;
      }
      // Higher confidence if we used Firecrawl (comprehensive extraction)
      // Medium confidence if we have basic content
      // Lower confidence if we couldn't fetch actual content (inferred data)
      if (usedFirecrawl) {
        return 85; // Firecrawl provides high-quality extraction
      } else if (hasContent) {
        return 70; // Basic content extraction
      } else {
        return 40; // Inferred data
      }
    };

    // Add provenance for each major section
    const addProvenance = (data: any, basePath: string) => {
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        Object.keys(data).forEach(key => {
          const fieldPath = basePath ? `${basePath}.${key}` : key;
          const value = data[key];
          
          if (value !== null && value !== undefined) {
            if (typeof value === 'object' && !Array.isArray(value)) {
              addProvenance(value, fieldPath);
            } else if (Array.isArray(value) && value.length > 0) {
              provenance.push({
                field: fieldPath,
                source_url: websiteUrl,
                last_updated: now,
                trust_score: calculateConfidence(value, fieldPath),
                extraction_method: 'auto',
              });
            } else if (typeof value === 'string' && value.trim() !== '') {
              provenance.push({
                field: fieldPath,
                source_url: websiteUrl,
                last_updated: now,
                trust_score: calculateConfidence(value, fieldPath),
                extraction_method: 'auto',
              });
            }
          }
        });
      }
    };

    addProvenance(extractedData, '');

    return {
      dnaData: extractedData,
      provenance,
    };
  } catch (error: any) {
    console.error('Error extracting BrandDNA:', error);
    if (error?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your .env file.');
    } else if (error?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    }
    // If it's a website fetch error, provide a more helpful message
    if (error?.message?.includes('Unable to fetch website content') || error?.message?.includes('fetch website')) {
      throw new Error('Could not fetch website content (CORS restrictions). BrandDNA will be created with inferred data based on the website name and URL. You can edit and complete it manually in the BrandDNA section.');
    }
    throw new Error(`Failed to extract BrandDNA: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Fetch website HTML content using Supabase Edge Function
 * Falls back to CORS proxy if Edge Function is not available
 */
async function fetchWebsiteContent(url: string): Promise<string> {
  // Normalize URL
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  // Try Supabase Edge Function first (preferred method)
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('fetch-website', {
      body: { url: normalizedUrl },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!error && data && data.success) {
      return data.html || '';
    }

    // If Edge Function fails, fall through to fallback
    console.warn('Edge Function failed, trying fallback:', error || data?.error);
  } catch (edgeFunctionError: any) {
    // Edge Function might not be deployed yet, use fallback
    console.warn('Edge Function not available, using fallback:', edgeFunctionError.message);
  }

  // Fallback: Use CORS proxy (less reliable but works without backend)
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(normalizedUrl)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (data.contents) {
      return data.contents;
    }
    
    throw new Error('Failed to fetch website content from proxy');
  } catch (fallbackError) {
    console.error('Fallback also failed:', fallbackError);
    throw new Error('Unable to fetch website content. Please ensure the URL is accessible and the Edge Function is deployed.');
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

