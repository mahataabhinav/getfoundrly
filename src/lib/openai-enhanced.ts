/**
 * Enhanced OpenAI Content Generation
 * 
 * Generates LinkedIn posts with brand profile integration,
 * image prompts, video prompts, and A/B variations.
 */

import OpenAI from 'openai';
import type { BrandProfile } from './brand-extractor';

// Get OpenAI client instance
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
}) : null;

export interface LinkedInPostContent {
  // Main post content
  postText: string;

  // Hook, body, CTA breakdown
  structure: {
    hook: string;
    body: string;
    cta: string;
  };

  // Image prompts
  imagePrompts: {
    primary: string;
    alternate1: string;
    alternate2: string;
  };

  // Video prompt (optional)
  videoPrompt?: {
    description: string;
    tone: string;
    style: string;
    environment: string;
    duration?: string;
  };

  // Hashtags
  hashtags: string[];

  // A/B variations
  variations: {
    versionA: string;
    versionB: string;
  };
}

export interface GenerateLinkedInPostOptions {
  brandName: string;
  brandUrl?: string;
  brandProfile: BrandProfile;
  postType: string;
  topic: string;
  contextDetails?: string;
}

/**
 * Generate comprehensive LinkedIn post content with brand profile
 */
export async function generateLinkedInPostEnhanced(
  options: GenerateLinkedInPostOptions
): Promise<LinkedInPostContent> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  const {
    brandName,
    brandUrl,
    brandProfile,
    postType,
    topic,
    contextDetails,
  } = options;

  // Build brand context from profile
  const brandContext = buildBrandContext(brandProfile);

  const systemPrompt = `You are an expert LinkedIn content creator specializing in professional thought leadership and brand visibility. 
Create engaging, authentic LinkedIn posts that drive engagement and establish authority while staying true to the brand's identity.

Guidelines:
- Write in a conversational yet professional tone that matches the brand voice
- Use emojis sparingly and strategically (1-2 max)
- Include actionable insights
- End with a question or call-to-action to drive engagement
- Use relevant hashtags (3-5 max)
- Keep posts between 200-300 words for optimal engagement
- Make it feel personal and authentic, not corporate
- Ensure brand consistency in tone, messaging, and visual style

You must generate:
1. A complete LinkedIn post (hook + body + CTA)
2. Breakdown of hook, body, and CTA separately
3. Three image prompts (primary + 2 alternates) that match brand colors and visual style
4. One optional UGC-style video prompt
5. Relevant hashtags
6. Two A/B variations of the post text

Return your response as valid JSON matching this structure:
{
  "postText": "Complete LinkedIn post text with hook, body, and CTA",
  "structure": {
    "hook": "Opening hook (first 1-2 sentences)",
    "body": "Main content body",
    "cta": "Call-to-action or question"
  },
  "imagePrompts": {
    "primary": "Detailed image generation prompt matching brand style",
    "alternate1": "Alternative image prompt option 1",
    "alternate2": "Alternative image prompt option 2"
  },
  "videoPrompt": {
    "description": "Video content description",
    "tone": "Video tone (e.g., energetic, calm, professional)",
    "style": "Video style (e.g., talking head, b-roll, UGC)",
    "environment": "Setting/environment description",
    "duration": "Suggested duration (e.g., 30s, 60s)"
  },
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "variations": {
    "versionA": "Alternative version A of the post",
    "versionB": "Alternative version B of the post"
  }
}`;

  let announcementInstruction = '';
  if (postType.toLowerCase() === 'announcement') {
    announcementInstruction = `\n8. IMPORTANT: Since this is an Announcement, seamlessly integrate a compelling Call to Action (CTA) that encourages the reader to check it out, sign up, or learn more. Make it feel natural and woven into the narrative, not just appended at the end.`;
  }

  const userPrompt = `Create a ${postType} LinkedIn post for ${brandName}${brandUrl ? ` (${brandUrl})` : ''}.

Topic: ${topic}
${contextDetails ? `Additional context: ${contextDetails}` : ''}

Brand Profile:
${brandContext}

Generate a compelling LinkedIn post that:
1. Captures attention with a strong opening hook
2. Provides valuable insights or storytelling aligned with brand voice
3. Engages the audience with a question or CTA
4. Uses appropriate hashtags
5. Includes image prompts that match brand colors and visual style
6. Includes a UGC-style video prompt if relevant
7. Provides two A/B variations for testing${announcementInstruction}

Return the complete response as JSON.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content || '{}';
    const parsedContent = JSON.parse(responseContent) as LinkedInPostContent;

    // Validate and ensure all required fields
    if (!parsedContent.postText) {
      throw new Error('Failed to generate post content');
    }

    // Ensure structure exists
    if (!parsedContent.structure) {
      parsedContent.structure = {
        hook: parsedContent.postText.split('\n\n')[0] || '',
        body: parsedContent.postText.split('\n\n').slice(1, -1).join('\n\n') || '',
        cta: parsedContent.postText.split('\n\n').slice(-1)[0] || '',
      };
    }

    // Ensure image prompts exist
    if (!parsedContent.imagePrompts) {
      parsedContent.imagePrompts = {
        primary: `Professional image for ${brandName} LinkedIn post about ${topic}`,
        alternate1: `Alternative image option 1 for ${brandName}`,
        alternate2: `Alternative image option 2 for ${brandName}`,
      };
    }

    // Ensure hashtags exist
    if (!parsedContent.hashtags || parsedContent.hashtags.length === 0) {
      parsedContent.hashtags = ['#Leadership', '#Business', '#Innovation'];
    }

    // Ensure variations exist
    if (!parsedContent.variations) {
      parsedContent.variations = {
        versionA: parsedContent.postText,
        versionB: parsedContent.postText,
      };
    }

    return parsedContent;
  } catch (error: any) {
    console.error('Error generating enhanced LinkedIn post:', error);
    if (error?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your .env file.');
    } else if (error?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    } else if (error?.message?.includes('JSON')) {
      throw new Error('Failed to parse AI response. Please try again.');
    }
    throw new Error(`Failed to generate post: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Build brand context string from brand profile
 */
function buildBrandContext(profile: BrandProfile): string {
  const parts: string[] = [];

  if (profile.brandTone) {
    parts.push(`Brand Tone: ${profile.brandTone}`);
  }
  if (profile.brandVoice) {
    parts.push(`Brand Voice: ${profile.brandVoice}`);
  }
  if (profile.mission) {
    parts.push(`Mission: ${profile.mission}`);
  }
  if (profile.values && profile.values.length > 0) {
    parts.push(`Core Values: ${profile.values.join(', ')}`);
  }
  if (profile.industry) {
    parts.push(`Industry: ${profile.industry}`);
  }
  if (profile.niche) {
    parts.push(`Niche: ${profile.niche}`);
  }
  if (profile.targetAudience) {
    const audience = profile.targetAudience;
    if (audience.demographics) {
      parts.push(`Target Audience: ${audience.demographics}`);
    }
    if (audience.psychographics) {
      parts.push(`Audience Psychographics: ${audience.psychographics}`);
    }
  }
  if (profile.brandColors) {
    const colors = Object.entries(profile.brandColors)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    if (colors) {
      parts.push(`Brand Colors: ${colors}`);
    }
  }
  if (profile.visualStyle) {
    parts.push(`Visual Style: ${profile.visualStyle}`);
  }
  if (profile.imageThemes && profile.imageThemes.length > 0) {
    parts.push(`Image Themes: ${profile.imageThemes.join(', ')}`);
  }
  if (profile.videoCues) {
    const cues = profile.videoCues;
    const videoInfo = [
      cues.tone && `Tone: ${cues.tone}`,
      cues.style && `Style: ${cues.style}`,
      cues.environment && `Environment: ${cues.environment}`,
      cues.mood && `Mood: ${cues.mood}`,
    ].filter(Boolean).join(', ');
    if (videoInfo) {
      parts.push(`Video Cues: ${videoInfo}`);
    }
  }

  return parts.join('\n');
}

/**
 * Regenerate post with same parameters (for A/B testing)
 */
export async function regenerateLinkedInPost(
  options: GenerateLinkedInPostOptions
): Promise<LinkedInPostContent> {
  // Same function, but with slightly different temperature for variation
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  const {
    brandName,
    brandUrl,
    brandProfile,
    postType,
    topic,
    contextDetails,
  } = options;

  const brandContext = buildBrandContext(brandProfile);

  const systemPrompt = `You are an expert LinkedIn content creator. Generate a fresh variation of a LinkedIn post with the same topic and brand context, but with a different angle, structure, or approach.`;

  const userPrompt = `Regenerate a ${postType} LinkedIn post for ${brandName}${brandUrl ? ` (${brandUrl})` : ''}.

Topic: ${topic}
${contextDetails ? `Additional context: ${contextDetails}` : ''}

Brand Profile:
${brandContext}

Create a NEW variation of the post with a different angle or approach. Return as JSON with the same structure as before.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9, // Higher temperature for more variation
      response_format: { type: 'json_object' },
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content || '{}';
    const parsedContent = JSON.parse(responseContent) as LinkedInPostContent;

    // Validate and ensure all required fields (same as generateLinkedInPostEnhanced)
    if (!parsedContent.postText) {
      throw new Error('Failed to regenerate post content');
    }

    // Ensure structure exists
    if (!parsedContent.structure) {
      parsedContent.structure = {
        hook: parsedContent.postText.split('\n\n')[0] || '',
        body: parsedContent.postText.split('\n\n').slice(1, -1).join('\n\n') || '',
        cta: parsedContent.postText.split('\n\n').slice(-1)[0] || '',
      };
    }

    // Ensure image prompts exist
    if (!parsedContent.imagePrompts) {
      parsedContent.imagePrompts = {
        primary: `Professional image for ${brandName} LinkedIn post about ${topic}`,
        alternate1: `Alternative image option 1 for ${brandName}`,
        alternate2: `Alternative image option 2 for ${brandName}`,
      };
    }

    // Ensure hashtags exist
    if (!parsedContent.hashtags || parsedContent.hashtags.length === 0) {
      parsedContent.hashtags = ['#Leadership', '#Business', '#Innovation'];
    }

    // Ensure variations exist
    if (!parsedContent.variations) {
      parsedContent.variations = {
        versionA: parsedContent.postText,
        versionB: parsedContent.postText,
      };
    }

    return parsedContent;
  } catch (error: any) {
    console.error('Error regenerating LinkedIn post:', error);
    throw new Error(`Failed to regenerate post: ${error?.message || 'Unknown error'}`);
  }
}

