import OpenAI from 'openai';
import type { BrandProfile } from './brand-extractor';

// Get OpenAI client instance
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
}) : null;

export interface InstagramCaptionContent {
    captions: {
        short: string;
        medium: string;
        long: string;
    };
    hashtags: {
        tier1: string[]; // Niche
        tier2: string[]; // Medium
        tier3: string[]; // Broad
        tier4: string[]; // Brand/Location
    };
    recommendations: {
        shortUse: string;
        mediumUse: string;
        longUse: string;
    };
}

export interface GenerateInstagramCaptionOptions {
    brandName: string;
    brandWebsite?: string;
    industry?: string;
    location?: string;
    postType: string; // Content Type from prompt
    topic: string; // Content Idea
    keyPoints?: string;
    targetAudience?: string;
    brandVoice?: string;
    brandProfile?: BrandProfile; // Optional full profile fallbacks
}

/**
 * Generate comprehensive Instagram captions (Short, Medium, Long) based on specific prompt engineering
 */
export async function generateInstagramCaptions(
    options: GenerateInstagramCaptionOptions
): Promise<InstagramCaptionContent> {
    if (!openai) {
        throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
    }

    const {
        brandName,
        brandWebsite,
        industry,
        location,
        postType,
        topic,
        keyPoints,
        targetAudience,
        brandVoice,
    } = options;

    const systemPrompt = `You are an expert social media content creator specializing in viral Instagram and TikTok captions for small and medium-sized businesses. Your role is to create engaging, conversion-focused captions that align with current trends while maintaining brand authenticity.

### YOUR TASK:
Generate 3 caption variations (short, medium, long) plus strategic hashtags for Instagram Reels/Posts based on the user's business information, content type, and target audience.

### CAPTION REQUIREMENTS:

**Structure Guidelines:**
1. Start with a STRONG HOOK (first 5-7 words must grab attention)
2. Include clear VALUE PROPOSITION (why should they care?)
3. Add SOCIAL PROOF or CREDIBILITY elements when relevant
4. End with clear CALL-TO-ACTION (CTA)
5. Use strategic line breaks for readability (mobile-optimized)
6. Include 1-2 relevant emojis per caption (not excessive)

**Tone Guidelines:**
- Confident but approachable
- Knowledgeable without being pretentious
- Authentic and passionate (never corporate/robotic)
- Conversational and relatable
- Action-oriented and clear

**Trending Elements to Incorporate:**
- Use pattern interrupts ("Wait...", "Stop scrolling...", "POV:", "This is your sign...")
- Include conversational phrases ("Here's the thing:", "Let me tell you why:", "Real talk:")
- Add curiosity gaps ("You won't believe...", "The secret to...", "What nobody tells you about...")
- Use inclusive language ("If you're like me...", "We've all been there...", "You know that feeling when...")

**What to AVOID:**
- Generic corporate speak ("We're excited to announce...")
- Excessive exclamation marks (!!!)
- Over-promising ("Best ever!", "Life-changing!", "Revolutionary!")
- Buzzword salad without substance
- Begging for engagement ("Like and share!", "Double tap if...")

### OUTPUT FORMAT:
Return response as valid JSON matching this structure:
{
  "captions": {
    "short": "50-80 words: Hook + Value + CTA",
    "medium": "100-150 words: Hook + Story/Context + Value + Social Proof + CTA",
    "long": "180-250 words: Hook + Full Story + Emotional Connection + Detailed Value + Strong CTA"
  },
  "hashtags": {
    "tier1": ["#niche1", "#niche2", ...], // 5-7 Niche specific (1k-50k posts)
    "tier2": ["#medium1", "#medium2", ...], // 5-7 Medium reach (50k-500k posts)
    "tier3": ["#broad1", "#broad2", ...], // 5-7 Broader appeal (500k-2M posts)
    "tier4": ["#brand1", "#brand2", ...] // 3-5 Brand/Location specific
  },
  "recommendations": {
    "shortUse": "Specific recommendation for when to use the short caption",
    "mediumUse": "Specific recommendation for when to use the medium caption",
    "longUse": "Specific recommendation for when to use the long caption"
  }
}`;

    const userPrompt = `Generate Instagram captions for the following business:

**Business Context:**
- Business Name: ${brandName}
- Industry: ${industry || 'General Business'}
- Website: ${brandWebsite || 'N/A'}
- Location: ${location || 'Online'}

**Content Details:**
- Content Type: ${postType}
- Content Idea: ${topic}
- Key Points to Include: ${keyPoints || 'N/A'}

**Targeting:**
- Primary Audience: ${targetAudience || 'General Audience'}

**Brand Messaging:**
- Brand Voice: ${brandVoice || 'Professional & Engaging'}

Process:
1. Analyze the business, audience, and brand messaging
2. Identify the primary hook that will resonate with the target audience
3. Determine the emotional angle
4. Craft 3 captions with varying lengths but consistent brand voice
5. Select hashtags that balance discoverability with relevance

Return the result as JSON.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.8,
            response_format: { type: 'json_object' },
            max_tokens: 2500,
        });

        const responseContent = completion.choices[0]?.message?.content || '{}';
        const parsedContent = JSON.parse(responseContent) as InstagramCaptionContent;

        // Basic validation
        if (!parsedContent.captions || !parsedContent.captions.short) {
            throw new Error('Failed to generate proper caption structure');
        }

        return parsedContent;
    } catch (error: any) {
        console.error('Error generating Instagram captions:', error);
        if (error?.status === 401) {
            throw new Error('Invalid OpenAI API key. Please check your .env file.');
        } else if (error?.status === 429) {
            throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to generate captions: ${error?.message || 'Unknown error'}`);
    }
}
